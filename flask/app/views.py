
import os, json
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

			# Instantiate the flir image extractor
			fie = FlirImageExtractor(is_debug = True)
			metadata_dictionary = collect_metadata(save_path)

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


api.add_resource(File, '/file/<string:filename>')
api.add_resource(FileList, '/files')


def collect_metadata(file_path):
	fie = FlirImageExtractor(is_debug = True)
	metadata_dictionary = fie.process_image(file_path)
	return metadata_dictionary


@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)