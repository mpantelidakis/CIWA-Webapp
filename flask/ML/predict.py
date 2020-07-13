import os,time,cv2, sys, math
import tensorflow as tf
import argparse
import numpy as np

from ML.utils.utils import load_image, filepath_to_name
from ML.utils.helpers import get_label_info, reverse_one_hot, colour_code_segmentation
from ML.builders import model_builder

from app import app


# parser = argparse.ArgumentParser()
# parser.add_argument('--image', type=str, default=None, required=True, help='The image you want to predict on. ')
# parser.add_argument('--checkpoint_path', type=str, default="ML/checkpoints/latest_model_FRRN-A_CIWA.ckpt", required=False, help='The path to the latest checkpoint weights for your model.')
# parser.add_argument('--crop_height', type=int, default=480, help='Height of cropped input image to network')
# parser.add_argument('--crop_width', type=int, default=640, help='Width of cropped input image to network')
# parser.add_argument('--model', type=str, default="FRRN-A", required=False, help='The model you are using')
# parser.add_argument('--dataset', type=str, default="CIWA", required=False, help='The dataset you are using')
# args = parser.parse_args()

class Predictor:

    def __init__(self, checkpoint_path="ML/checkpoints/latest_model_FRRN-A_CIWA.ckpt", 
                is_debug=True, crop_height=480, crop_width=640, model="FRRN-A", image=""):

        self.checkpoint_path = checkpoint_path
        self.is_debug = is_debug
        self.crop_width = crop_width
        self.crop_height = crop_height
        self.model = model
        self.image = image
        
    pass

    def predictNsave(self):

        class_names_list, label_values = get_label_info("ML/class_dict.csv")

        num_classes = len(label_values)

        print("\n***** Begin prediction *****")
        # print("Dataset -->", args.dataset)
        print("Model -->", self.model)
        print("Crop Height -->", self.crop_height)
        print("Crop Width -->", self.crop_width)
        print("Num Classes -->", num_classes)
        print("Image -->", self.image)

        # Initializing network
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        sess=tf.Session(config=config)

        net_input = tf.placeholder(tf.float32,shape=[None,None,None,3])
        net_output = tf.placeholder(tf.float32,shape=[None,None,None,num_classes]) 

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


        print("")
        print("Finished!")
        print("Wrote image " + "%s_pred.png"%(path))

        return
