
import cv2 as cv
import numpy as np
import json

def image_downscale(img_np, width, height):
        """
        Downscale an image given dimensions
        and return it
        :return:
        """

        dim = (width, height)

        # resize the rgb image
        resized_visual_np = cv.resize(img_np, dim, interpolation=cv.INTER_AREA)

        return resized_visual_np

def crop_image_only_outside(img_np, tol=0):
    """
    Dynamic cropping of black bounding box

    Keyword arguments:
    img -- numpy array
    tol -- tolerance, how much away from total black (default 0)
    :return:
    """
    mask = img_np>tol
    if img_np.ndim==3:
        mask = mask.all(2)
    m,n = mask.shape
    mask0,mask1 = mask.any(0),mask.any(1)
    col_start,col_end = mask0.argmax(),n-mask0[::-1].argmax()
    row_start,row_end = mask1.argmax(),m-mask1[::-1].argmax()
    return img_np[row_start:row_end,col_start:col_end]



def crop_center(img, cropx, cropy):
    """
    Crop the image to the given dimensions
    :return:
    """
    y, x, z = img.shape
    startx = x // 2 - (cropx // 2)
    starty = y // 2 - (cropy // 2)
    return img[starty:starty + cropy, startx:startx + cropx]


def crop_mask_and_overlay_temps(temps_np, mask_path, crop_w, crop_h):
    pass

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)