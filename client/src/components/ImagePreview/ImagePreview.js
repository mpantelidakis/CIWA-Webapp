import React from 'react';
import classes from './ImagePreview.module.scss'

const ImagePreview = props => (
    <div className={classes.ImagePreview} style={{height: props.height}}>
        <img src={props.Url} alt="" />
    </div>
)

export default ImagePreview