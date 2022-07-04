import os,time,cv2, sys, math

import tensorflow as tf
import argparse
import numpy as np

from ML.utils.utils import load_image, filepath_to_name
from ML.utils.helpers import get_label_info, reverse_one_hot, colour_code_segmentation
from ML.builders import model_builder

from app import app

from PIL import Image

# parser = argparse.ArgumentParser()
# parser.add_argument('--image', type=str, default=None, required=True, help='The image you want to predict on. ')
# parser.add_argument('--checkpoint_path', type=str, default="ML/checkpoints/latest_model_FRRN-A_CIWA.ckpt", required=False, help='The path to the latest checkpoint weights for your model.')
# parser.add_argument('--crop_height', type=int, default=480, help='Height of cropped input image to network')
# parser.add_argument('--crop_width', type=int, default=640, help='Width of cropped input image to network')
# parser.add_argument('--model', type=str, default="FRRN-A", required=False, help='The model you are using')
# parser.add_argument('--dataset', type=str, default="CIWA", required=False, help='The dataset you are using')
# args = parser.parse_args()

class Predictor:

    def __init__(self,
                is_debug=True, crop_height=480, crop_width=640,
                model="FRRN-A", image="", crop_type=""):

        print(crop_type)
        self.crop_type = crop_type
        if self.crop_type == "Pistachios":
            self.checkpoint_path = "ML/pistachios/checkpoints/model.ckpt"
        elif self.crop_type == "Tomatoes":
            self.checkpoint_path = "ML/tomatoes/checkpoints/model.ckpt"
        self.is_debug = is_debug
        self.crop_width = crop_width
        self.crop_height = crop_height
        self.model = model
        self.image = image

    def predictNsave(self):

        # Initializing network
        tf.reset_default_graph()
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        sess=tf.Session(config=config)

        if self.crop_type == "Pistachios":
            class_names_list, label_values = get_label_info("ML/pistachios/class_dict.csv")
        elif self.crop_type == "Tomatoes":
            class_names_list, label_values = get_label_info("ML/tomatoes/class_dict.csv")
        num_classes = len(label_values)
        net_input = tf.placeholder(tf.float32,shape=[None,None,None,3])
        net_output = tf.placeholder(tf.float32,shape=[None,None,None,num_classes])

        print("\n***** Begin prediction *****")
        # print("Dataset -->", args.dataset)
        print("Model -->", self.model)
        print("Crop Height -->", self.crop_height)
        print("Crop Width -->", self.crop_width)
        print("Num Classes -->", num_classes)
        print("Image -->", self.image)

        network, _ = model_builder.build_model(self.model, net_input=net_input,
                                                num_classes=num_classes,
                                                crop_width=self.crop_width,
                                                crop_height=self.crop_height,
                                                is_training=False)

        sess.run(tf.global_variables_initializer())

        

        print('Loading model checkpoint weights')
        saver=tf.train.Saver(max_to_keep=1000)
        saver.restore(sess, self.checkpoint_path)

        print("Testing image " + self.image)

        loaded_image = load_image(self.image)
        resized_image =cv2.resize(loaded_image, (self.crop_width, self.crop_height))
        input_image = np.expand_dims(np.float32(resized_image[:self.crop_height, :self.crop_width]),axis=0)/255.0

        st = time.time()
        output_image = sess.run(network,feed_dict={net_input:input_image})

        run_time = time.time()-st

        output_image = np.array(output_image[0,:,:,:])
        output_image = reverse_one_hot(output_image)

        out_vis_image = colour_code_segmentation(output_image, label_values)
        file_name = filepath_to_name(self.image)

        path = os.path.join(app.config['UPLOAD_FOLDER'], 'Predictions', file_name)
        cv2.imwrite("%s_pred.png"%(path),cv2.cvtColor(np.uint8(out_vis_image), cv2.COLOR_RGB2BGR))


        im = Image.open("%s_pred.png"%(path))
        x, y = im.size
        pixels = im.load()

        new_im = Image.new('RGBA', (x, y), (0,0,0,0))
        pixels_new = new_im.load()

        for i in range(0,x):
            for j in range (0, y):
                if pixels[i, j] == (0, 255, 0):
                    pixels_new[i, j] = (255, 162, 0,255)
        
        new_im.save("%s_pred.png"%(path), 'PNG')

        print("")
        print("Finished!")
        print("Wrote image " + "%s_pred.png"%(path))
        print("Time to completion: ", run_time)

        return True
