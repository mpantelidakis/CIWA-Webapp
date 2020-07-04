import React, {useEffect , useState, Fragment } from 'react'
import ReactCompareImage from 'react-compare-image';


import noPreview from "../../../assets/images/no-preview.jpg"
import axios from '../../../axios-orders'

import classes from "./Images.module.scss";

const Images = props => {

    const [FlirPreviewUrl, setFlirPreviewUrl] = useState(noPreview);
    const [VisualPreviewUrl, setVisualPreviewUrl] = useState(noPreview);
    const [ThermalPreviewUrl, setThermalPreviewUrl] = useState(noPreview);

    const visual_request = axios.get('images/' + props.filename , { 
        responseType: 'blob',
        params: {
            type: 'Visual_Images'
        }
    })
    
    const flir_request = axios.get('images/' + props.filename , { 
        responseType: 'blob',
        params: {
            type: 'Flir_Images'
        }
    })
    
    const thermal_request = axios.get('images/' + props.filename.replace('.jpg','.png') , { 
        responseType: 'blob',
        params: {
            type: 'Thermal_Images'
        }
    })


    useEffect(() => {
        Promise.all([flir_request, visual_request, thermal_request]).then(function ([...responses]) {
            const responseOne = responses[0]
            const responseTwo = responses[1]
            const responesThree = responses[2]

            setFlirPreviewUrl(URL.createObjectURL(responseOne.data))
            setVisualPreviewUrl(URL.createObjectURL(responseTwo.data))
            setThermalPreviewUrl(URL.createObjectURL(responesThree.data))

          }).catch(errors => {
            // react on errors.
          })
    }, [props.filename])

    const  metadataPanel = Object.keys(props.metadata)
        .map(metaKey => {
                return <p key={metaKey}>{metaKey} :  {props.metadata[metaKey]} </p>
            })

    return (
        <div className={classes.container}>
            <p className={classes.imgName}>{props.filename}</p>
            <div className={classes.comparison}>
                <ReactCompareImage aspectRatio="wider"  sliderLineWidth="5" leftImageLabel="Flir" leftImage={FlirPreviewUrl} rightImage={VisualPreviewUrl} rightImageLabel="Visual Spectrum" />
                {/* <img src={FlirPreviewUrl} alt={`Img-flir${props.id}`}/>
                <img src={VisualPreviewUrl} alt={`Img-visual-${props.id}`}/>
                <img src={ThermalPreviewUrl} alt={`Img-thermal${props.id}`}/> */}
            </div>
            {/* {metadataPanel} */}
        </div>
        
    )
}

export default Images

