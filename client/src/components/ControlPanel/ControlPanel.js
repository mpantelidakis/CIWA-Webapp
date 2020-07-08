import React, {useEffect , useState, Fragment } from 'react'
import axios from '../../axios-orders'
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/src/styles/styles.scss";

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import { Circle, Heart, Orbitals, Ouroboro, Roller, Spinner, Ripple, Ring } from 'react-spinners-css';

// import styles from 'react-awesome-button/src/styles/themes/theme-red';

import classes from './ControlPanel.module.scss'


const ControlPanel = props => {

    const [imageName, setImageName] = useState("")
    const [metadata, setMetadata] = useState({})
    const [FlirPreviewUrl, setFlirPreviewUrl] = useState(null);
    const [VisualPreviewUrl, setVisualPreviewUrl] = useState(null);
    const [ThermalPreviewUrl, setThermalPreviewUrl] = useState(null);

    const visual_request = axios.get('images/' + props.match.params['imageName'] , { 
        responseType: 'blob',
        params: {
            type: 'Visual_Images'
        }
    })
    
    const flir_request = axios.get('images/' + props.match.params['imageName'] , { 
        responseType: 'blob',
        params: {
            type: 'Flir_Images'
        }
    })
    
    const thermal_request = axios.get('images/' + props.match.params['imageName'].replace('.jpg','.png') , { 
        responseType: 'blob',
        params: {
            type: 'Thermal_Images'
        }
    })

    const getImage = axios.get('api/file/' + props.match.params['imageName'])

    useEffect(() => {

        setImageName(props.match.params['imageName'])

        Promise.all([flir_request, visual_request, thermal_request, getImage]).then(function ([...responses]) {
            const responseOne = responses[0]
            const responseTwo = responses[1]
            const responseThree = responses[2]
            const responseFour = responses[3]

            setFlirPreviewUrl(URL.createObjectURL(responseOne.data))
            setVisualPreviewUrl(URL.createObjectURL(responseTwo.data))
            setThermalPreviewUrl(URL.createObjectURL(responseThree.data))
            setMetadata(responseFour.data.metadata)

          }).catch(errors => {
            // react on errors.
          })
    }, [])

    const  metadataPanel = Object.keys(metadata)
                            .map(metaKey => {
                                if(metaKey!="SourceFile")
                                return <p key={metaKey}>{metaKey} :  {metadata[metaKey]} </p>
                            })

    const deleteHandler = () => {
        axios.delete('api/file/' + imageName) 
        .then(res => {
            console.log(res.data.msg)
            props.history.push('/images');
        })
        .catch(error => {
            //The interceptor of the hoc handles the exception
        })
    }

    return (
        <div className={classes.ControlPanel}>
           <h1 className={classes.ControlTitle}>Image Control Panel</h1>
           {FlirPreviewUrl ? <img src={FlirPreviewUrl} alt={`Img-flir${props.id}`}/> : <Spinner/>}
           {VisualPreviewUrl ? <img src={VisualPreviewUrl} alt={`Img-flir${props.id}`}/> : <Spinner/>}
           {ThermalPreviewUrl ? <img src={ThermalPreviewUrl} alt={`Img-flir${props.id}`}/> : <Spinner/>}
            {metadata? metadataPanel : null}
            <AwesomeButton
                // cssModule={btnClass}
                type="secondary"
                ripple
                onPress={deleteHandler}
                >
                Delete
            </AwesomeButton>
            <AwesomeButton
                // cssModule={btnClass}
                type="primary"
                ripple
                onPress={()=>{}}
                >
                Find Sunlit leaves
            </AwesomeButton>
            <AwesomeButton
                // cssModule={btnClass}
                type="primary"
                ripple
                onPress={()=>{}}
                >
                Download Temperature csv
            </AwesomeButton>


           
        </div>
        
     

        
    )
}

export default withErrorHandler(ControlPanel, axios)