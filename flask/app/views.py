
import os, json, re
import urllib.request
from app import app
from flask import Flask, request, redirect, jsonify, send_from_directory
from werkzeug.utils import secure_filename

from scripts.FlirImageExtractor import FlirImageExtractor

from app import mongo

from app import api
from flask_restful import Resource
from flask_pymongo import pymongo

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


def extract_metadata(file_path):
	fie = FlirImageExtractor(is_debug = True)
	metadata_dictionary = fie.extract_metadata(file_path)
	return metadata_dictionary

def modify_metadata(file_path, fie):
	metadata_dictionary = fie.modify_metadata(file_path)
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
			resp = jsonify({'error' : 'No file part in the request'})
			resp.status_code = 400
			return resp
		file = request.files['file']
		if file.filename == '':
			resp = jsonify({'error' : 'No file selected for uploading'})
			resp.status_code = 400
			return resp
		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			
			# Create the path to save the file
			save_path = os.path.join(app.config['UPLOAD_FOLDER'],'Flir_Images', filename)

			# Save the file to our local storage
			file.save(save_path)

			# Get the metadata part of the multipart-form
			metadata = request.form.get('metadata')
			pprint.pprint(metadata)
		
			if metadata:
				# Parse the data and create a Json object
				json_meta = json.loads(metadata)
				print("The request object also has metadata attached to it.")
				print(json_meta)

				# Extract and modify the image metadata and return a dictionary
				fie = FlirImageExtractor(is_debug = True, provided_metadata=json_meta)
				metadata_dictionary = modify_metadata(save_path, fie)
				fie.process_image(save_path)
				fie.save_images()
				fie.export_data_to_csv()

				# Emissivity is float in the original image, but not when we send it via form
				metadata_dictionary['Emissivity'] = extract_float(metadata_dictionary['Emissivity'])

			else:
				# Extract the image metadata and return a dictionary
				metadata_dictionary = extract_metadata(save_path)

			resp = {}
			if not 'AtmosphericTemperature' in metadata_dictionary.keys():
				resp['error'] = "Image does not contain weather metadata."
				resp = jsonify(resp)
				# Not acceptable
				resp.status_code = 406
				return resp
			
			# All temperatures are in celcius
			metadata_dictionary['AtmosphericTemperature'] = extract_float(metadata_dictionary['AtmosphericTemperature'])
			metadata_dictionary['IRWindowTemperature'] = extract_float(metadata_dictionary['IRWindowTemperature'])
			metadata_dictionary['ReflectedApparentTemperature'] = extract_float(metadata_dictionary['ReflectedApparentTemperature'])

			# Relative humidity is a percentage
			metadata_dictionary['RelativeHumidity'] = extract_float(metadata_dictionary['RelativeHumidity'])

			# In meters
			metadata_dictionary['SubjectDistance'] = extract_float(metadata_dictionary['SubjectDistance'])

			resp['metadata'] = metadata_dictionary
			
			# Append a message to the response object

			if metadata:
				# Save the file info in the db
				file_entry = {
					'file_name': filename,
					'metadata': metadata_dictionary
				}

				# If image name exists, replace it. If it does not, create it.
				check = dbfiles.replace_one({"file_name": filename}, file_entry, True)
				
				if check.upserted_id is not None:
					resp['msg'] = "File uploaded successfully! Generated Visual and Thermal Images."
				else:
					resp['msg'] = "File updated successfully! Regenerated Visual and Thermal Images."

			else:
				resp['msg'] = "Successfully extracted metadata!"

			# Jsonify the response
			resp = jsonify(resp)

			# Attach the status code
			resp.status_code = 201
			return resp
		else:
			resp = jsonify({'error' : 'Allowed file types are png, jpg, jpeg'})
			resp.status_code = 400
			return resp

	def get(self):
		
		# files = dbfiles.find()
		# x = []
		# for item in files:
		# 	# if id must be kept, use bson.json util
		# 	item.pop('_id') # _id is not json serializable
		# 	x.append(item)
		# 	# pprint.pprint(item)

		offset = int(request.args['offset'])
		limit = int(request.args['limit'])

		resp = paginate(offset, limit)
		resp.status_code = 200
		return resp

		# resp = jsonify(x)
		# resp.status_code = 200
		# return resp

class File(Resource):
	# Used to get a specific image details
	def get(self, filename):

		files = dbfiles.find_one({"file_name": filename})
		if files:
			files.pop('_id') # _id is not json serializable
			resp = jsonify(files)
			resp.status_code = 200
			return resp

		resp = jsonify({"msg":"File not found"})
		resp.status_code = 404
		return resp
	
	def delete(self, filename):
		
		files = dbfiles.delete_one({"file_name": filename})
		print(filename)

		if files.deleted_count != 0:
			print("Deleted .{} files.".format(files.deleted_count))
			# Delete from db logic here
			os.remove(os.path.join(app.config['UPLOAD_FOLDER'], 'Flir_Images', filename))
			os.remove(os.path.join(app.config['UPLOAD_FOLDER'], 'Visual_Images', filename))
			os.remove(os.path.join(app.config['UPLOAD_FOLDER'], 'Thermal_Images', filename.replace('.jpg', '.png')))
		
			resp = jsonify({"msg":"File successfully deleted"})
			resp.status_code = 200
			return resp

		resp = jsonify({"msg":"File not found"})
		resp.status_code = 404
		return resp

		
		

api.add_resource(File, '/api/file/<string:filename>')
api.add_resource(FileList, '/api/files')

def paginate(offset, limit):

	total_files = dbfiles.find().count()

	offset = 0 if offset <0 or offset >total_files else offset

	
	print(total_files)

	output = []

	if total_files>0:
		starting_id = dbfiles.find().sort('_id', pymongo.ASCENDING)
		last_id = starting_id[offset]['_id']

		images = dbfiles.find({'_id' : {'$gte' : last_id}}).sort('_id', pymongo.ASCENDING).limit(limit)

		
		for image in images:
			image.pop('_id') # _id is not json serializable
			output.append(image)
	
	next_url = {
		"offset": str(None if offset + limit>=total_files or total_files==0 else offset+limit),
		"limit": str(limit)
	}
	previous_url = {
		"offset": str(None if offset-limit<0 or total_files==0 else offset-limit),
		"limit": str(limit)
	}
	print("Previous Url:{}".format(previous_url))
	print("Next Url:{}".format(next_url))

	return jsonify({'result' : output, 'prev_url' : previous_url, 'next_url': next_url})

@app.route('/images/<filename>', methods=['GET'])
def get_image(filename):
	"""
	Returns an image from the media folder, given the type of the image
	Expects query param 'type' and the file name in the body of the request
	"""
	typeOfImage = request.args.get('type')
	# print(typeOfImage)
	# print(app.config['UPLOAD_FOLDER'])
	# print(filename)
	return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'],typeOfImage),filename)
