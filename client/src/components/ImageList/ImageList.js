import React, {useEffect , useState, Fragment } from 'react'
import axios from '../../axios-orders'

import Image from './Image/Image'


const ImageList = props => {

    const [imageList, setImageList] = useState([]);
    // console.log(props.history);

    useEffect(() => {
        axios.get('/api/files')
        .then(res => {
            setImageList(res.data);
        })
        .catch(error => {
            //The interceptor of the hoc handles the exception
        })
    }, [])

    let images = []
    if(imageList.length === 0){
        images = <p>No images upladed</p>
    }else{
        images = imageList.map((file, idx) => {
            return (
                <Fragment key={idx + 1}>
                    <h1>{file.file_name}</h1>
                    <Image filename={file.file_name} metadata={file.metadata} id={idx + 1}/>
                </Fragment>
                
            )
        })
    }

    return (
        <Fragment>
            <h1>Uploaded Images</h1>
            {images}
        </Fragment>
    )
}

export default ImageList