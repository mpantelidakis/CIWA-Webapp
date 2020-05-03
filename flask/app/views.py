
import os, json, re
import urllib.request
from app import app
from flask import Flask, request, redirect, jsonify, send_from_directory
from werkzeug.utils import secure_filename

from scripts.metadata_extractor import FlirImageExtractor

from app import mongo

from app import api
from flask_restful import Resource

import pprint

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

dbfiles = mongo.db.files

def GenerateReturnDictionary(status, msg):
    retJson = {
        "status": status,
        "msg": msg
    }
    return retJson


def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def collect_metadata(file_path):
	fie = FlirImageExtractor(is_debug = True)
	metadata_dictionary = fie.process_image(file_path)
	return metadata_dictionary

def extract_float(dirtystr):
        """
        Extract the float value of a string, helpful for parsing the exiftool data
        :return:
        """
        digits = re.findall(r"[-+]?\d*\.\d+|\d+", dirtystr)
        return float(digits[0])

class FileList(Resource):
	# Used to upload a new image or get all the available images

	def post(self):
		# The post request will have 2 different functionalities.

		# If a file and a metadata MultiDict are attached to the formdata received
		# the provided metadata will be used during temperature estimation

		# If only a file is attached to the request object, the file-encoded metadata
		# Will be used during temprature estimation

    	# The file of the formdata will be available under request.files
        # The metadata of the formdata will be available under request.form.get('metadata)

		# check if the post request has the file part
		if 'file' not in request.files:
			resp = jsonify({'msg' : 'No file part in the request'})
			resp.status_code = 400
			return resp
		file = request.files['file']
		if file.filename == '':
			resp = jsonify({'msg' : 'No file selected for uploading'})
			resp.status_code = 400
			return resp
		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			
			# Create the path to save the file
			save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

			# Save the file to our local storage
			file.save(save_path)

			# Get the metadata part of the multipart-form
			metadata = request.form.get('metadata')
		
			if metadata:
				# Parse the data and create a Json object
				json_meta = json.loads(metadata)
				print("The request object also has metadata attached to it.")
				print(json_meta)

			else:
	
				# Extract the image metadata and return a dictionary
				metadata_dictionary = collect_metadata(save_path)

				# All temperatures are in celcius
				metadata_dictionary['AtmosphericTemperature'] = extract_float(metadata_dictionary['AtmosphericTemperature'])
				metadata_dictionary['IRWindowTemperature'] = extract_float(metadata_dictionary['IRWindowTemperature'])
				metadata_dictionary['ReflectedApparentTemperature'] = extract_float(metadata_dictionary['ReflectedApparentTemperature'])

				# Relative humidity is a percentage
				metadata_dictionary['RelativeHumidity'] = extract_float(metadata_dictionary['RelativeHumidity'])

				# In meters
				metadata_dictionary['SubjectDistance'] = extract_float(metadata_dictionary['SubjectDistance'])


				# Save the file info in the db
				file_entry = {
					'file_name': filename,
					'metadata': metadata_dictionary
				}

				resp = {}
				resp['metadata'] = metadata_dictionary
				
				# If image name exists, replace it. If it does not, create it.
				check = dbfiles.replace_one({"file_name": filename}, file_entry, True)

				# Append a message to the response object
				if check.upserted_id is not None:
					resp['msg'] = "File uploaded successfully."
				else:
					resp['msg'] = "File updated successfully."

				# Jsonify the response
				resp = jsonify(resp)

				# Attach the status code
				resp.status_code = 201
				return resp
		else:
			resp = jsonify({'msg' : 'Allowed file types are png, jpg, jpeg'})
			resp.status_code = 400
			return resp

	def get(self):
		
		files = dbfiles.find()
		if files.count() == 0:
			resp = jsonify({"msg":"No files found."})
			print("No files found")
			resp.status_code = 200
			return resp

		x = []
		for item in files:
			# if id must be kept, use bson.json util
			item.pop('_id') # _id is not json serializable
			x.append(item)
			pprint.pprint(item)

		resp = jsonify(x)
		resp.status_code = 200
		return resp

class File(Resource):
	# Used to get a specific image details
	def get(self, filename):
		files = dbfiles.find_one({"file_name": filename})
		files.pop('_id') # _id is not json serializable
		if files:
			resp = jsonify(files)
			resp.status_code = 200
			return resp
		resp = jsonify({"msg":"The file does not exist."})
		resp.status_code = 200
		return resp
		

api.add_resource(File, '/api/file/<string:filename>')
api.add_resource(FileList, '/api/files')


def collect_metadata(file_path):
	fie = FlirImageExtractor(is_debug = True)
	metadata_dictionary = fie.process_image(file_path)
	return metadata_dictionary


@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)
