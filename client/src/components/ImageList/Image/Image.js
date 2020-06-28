import React, {useEffect , useState, Fragment } from 'react'

import noPreview from "../../../assets/images/no-preview.jpg"
import axios from '../../../axios-orders'

const Image = props => {

    const [filePreviewUrl, setFilePreviewUrl] = useState(noPreview);


    useEffect(() => {
        axios.get('uploads/' + props.filename , {
            responseType: 'blob'
        })
        .then(res => {
            setFilePreviewUrl(URL.createObjectURL(res.data))
        })
        .catch(error => {
            //The interceptor of the hoc handles the exception
        })
    }, [])

    return <img src={filePreviewUrl} alt={`Img-${props.id}`}/>
}

export default Image