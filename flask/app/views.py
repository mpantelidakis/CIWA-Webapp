
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
	# Used upload a new image or get all the available images
	def post(self):
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
			# Uncomment l8er
			save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
			# Change l8er to the real upload path
			# save_path = os.path.join(os.getcwd() + '/images/', filename)
			file.save(save_path)

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

			# If image name exists, replace it. If it does not, create it.
			dbfiles.replace_one({"file_name": filename}, file_entry, True)

			resp = jsonify({"msg":"File uploaded successfully."})
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
