import React, { useState, useRef } from 'react';
import axios from 'axios'

import ImagePreview from '../ImagePreview/ImagePreview'

import classes from './ImageUploader.module.scss'



const ImageUploader = props => {
    const [file, setFile] = useState(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);
    
    const fileSelectedHandler = (event) => {
        console.log(event.target.files[0]);
        setFile(event.target.files[0]);
        if (props.withPreview)
        setFilePreviewUrl(URL.createObjectURL(event.target.files[0]))
    }

    const fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('file', file)
        axios.post('http://localhost:5000/api/files', fd, {
            onUploadProgress: ProgressEvent => {
                console.log('Upload Progress: ' + Math.round(ProgressEvent.loaded / ProgressEvent.total *100) + '%')
            }
        })
        .then(res => {
            console.log(res);
        })
    }

    const inputEl = useRef(null);

    const classBtnSelect = [classes.Btn, classes.Btn__Select].join(' ');
    const classbtnUpload = [classes.Btn, classes.Btn__Upload].join(' ');

    return (
        <div className={classes.ImageUploader}>
            {file ? 
            <React.Fragment>
            <p className={classes.Message}>Will be upladed: <br/> {file.name}</p>
            <p className={classes.Message}>File size: &nbsp; {(file.size/(1024)).toFixed(2)} &nbsp; KBs</p>
            <ImagePreview Url={filePreviewUrl}/>
            </React.Fragment>: 
            <p className={classes.Message}>Please select a file to upload.</p>}


            

            <input style={{display: 'none'}}
            type="file" 
            onChange={fileSelectedHandler}
            ref={inputEl}/>
            <div className={classes.Buttons}>
                <button className={classBtnSelect} onClick={() => inputEl.current.click()}>Select an image</button>
                <button className={classbtnUpload} onClick={fileUploadHandler}>Upload</button>
            </div>
        </div>
        
    )
}

export default ImageUploader