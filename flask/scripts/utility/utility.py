
import cv2 as cv
import numpy as np
import numpy.ma as ma
# np.set_printoptions(threshold=np.inf)
import json
from PIL import Image


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


def crop_mask_and_overlay_temps(temps_np, mask_path, crop_w, crop_h, at=0, val_sub=0, val_add=0):

    mask_visual = Image.open(mask_path)
    # convert image to numpy array
    mask_np = np.asarray(mask_visual)

    # print(mask_np.shape)

    shape = mask_np.shape
    # print(shape[0])
    # print(shape[1])
    # print(crop_w)
    # print(crop_h)

    # print("Diff x:",shape[0]- crop_w)
    # print("Diff y:",shape[1]- crop_h)

    # Remove black bounding box from the generated mask
    mask_np = crop_center(mask_np, shape[1] - crop_h, shape[0] - crop_w)

    mask_np_visual = Image.fromarray(mask_np)

    mask_np_visual.save(mask_path, 'PNG')
    
    # generate binary mask with 1 on non leaf pixels
    not_leaves_mask = np.int64(np.all(mask_np[:, :, :3] == 0, axis=2))

    

    # downscale the binary non sunlit leaf mask to match the thermal image
    downscaled_not_leaves_mask = cv.resize(np.uint8(not_leaves_mask), dsize=(80, 60), interpolation=cv.INTER_CUBIC)

    #Temperature thresholds
    threshold_min = at - val_sub
    threshold_max = at + val_add

    # generate binary mask with 1 where temperature out of threshold
    thermal_thresholding_mask = np.int64(np.logical_or(temps_np< threshold_min, temps_np> threshold_max))

    

    # Logic or between the 2 masks
    final_exclusion_mask_np = thermal_thresholding_mask | downscaled_not_leaves_mask

    # Get the sunlit leaves temperatures only
    temps_np_masked = ma.masked_array(temps_np, mask=final_exclusion_mask_np, fill_value=999)

    # Rebuild 1D array of sunlit leaves using the inverse of the exclusion mask
    sunlit_leaves_only = temps_np_masked[~temps_np_masked.mask]

    sunlit_leaves_mean_temp = sunlit_leaves_only.mean()

    # print(temps_np_masked.filled())
    print("Non leaf mask dimensions: ", downscaled_not_leaves_mask.shape)
    print("Out of temperature threshold mask dimensions: ", thermal_thresholding_mask.shape)
    print("Final exclusion mask dimensions: ", final_exclusion_mask_np.shape)
    print("Thermal data np dimensions: ", temps_np_masked.shape)
    print("Leaves only dimensions: ", sunlit_leaves_only.shape)
    print("Mean sunlit leaf temperature: ", sunlit_leaves_mean_temp)
    print("Threshold min:",threshold_min)
    print("Threshold max:",threshold_max)
    print("Atmospheric Temperature: ", at)


    
    # Return the mean sunlit leaf temp and the temperature array with
    # 999 in place of non sulit leaf values
    return sunlit_leaves_mean_temp, temps_np_masked.filled()

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)