import React, {useEffect , useState, Fragment } from 'react'
import axios from '../../axios-orders'
import ReactCompareImage from 'react-compare-image';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/src/styles/styles.scss";

import NotFound from '../NotFound/NotFound'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import {Spinner} from 'react-spinners-css';

import {  base, Trash, Download, Technology, Next, Action, Configure, Services } from 'grommet-icons';

import Table from '../Table/Table'

import Button from '../UI/Button/Button'

// import styles from 'react-awesome-button/src/styles/themes/theme-red';

import classes from './ControlPanel.module.scss'


const ControlPanel = props => {

    const [imageName, setImageName] = useState("")
    const [metadata, setMetadata] = useState({})
    const [FlirPreviewUrl, setFlirPreviewUrl] = useState(null);
    const [VisualPreviewUrl, setVisualPreviewUrl] = useState(null);
    const [ThermalPreviewUrl, setThermalPreviewUrl] = useState(null);
    const [PredictionPreviewUrl, setPredictionPreviewUrl] = useState(null);
    const [VisualNoCropPreviewUrl, setVisualNoCropPreviewUrl] = useState(null);

    const [imageNotFound, setImageNotFound] = useState(false)

    // const visual_request = axios.get('images/' + props.match.params['imageName'] , { 
    //     responseType: 'blob',
    //     params: {
    //         type: 'Visual_Images'
    //     }
    // })
    
    // const flir_request = axios.get('images/' + props.match.params['imageName'] , { 
    //     responseType: 'blob',
    //     params: {
    //         type: 'Flir_Images'
    //     }
    // })
    
    // const thermal_request = axios.get('images/' + props.match.params['imageName'].replace('.jpg','.png') , { 
    //     responseType: 'blob',
    //     params: {
    //         type: 'Thermal_Images'
    //     }
    // })

    
    useEffect(() => {

        setImageName(props.match.params['imageName'])

        axios.get('api/file/' + props.match.params['imageName'])
                    .then(res => {
                        console.log(res.data)
                        setMetadata(res.data.metadata)
                        Promise.all([
                            axios.get('mediafiles/flir/' + props.match.params['imageName'] , { 
                                responseType: 'blob'
                            }),
                            axios.get('mediafiles/visual/' + props.match.params['imageName'] , { 
                                responseType: 'blob'
                            }),
                            axios.get('mediafiles/visual_nocrop/' + props.match.params['imageName'] , { 
                                responseType: 'blob'
                            }),
                            axios.get('mediafiles/thermal/' + props.match.params['imageName'].replace('.jpg','.png') , { 
                                responseType: 'blob'
                            })
                        ]).then(function ([...responses]) {
                            const responseOne = responses[0]
                            const responseTwo = responses[1]
                            const responseThree = responses[2]
                            const responseFour = responses[3]
                          
                            setFlirPreviewUrl(URL.createObjectURL(responseOne.data))
                            setVisualPreviewUrl(URL.createObjectURL(responseTwo.data))
                            setVisualNoCropPreviewUrl(URL.createObjectURL(responseThree.data))
                            setThermalPreviewUrl(URL.createObjectURL(responseFour.data))
                
                          }).catch(errors => {
                          })
                    })
                    .catch(errors => {
                        setImageNotFound(true)
                    })
    }, [])

 

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

    const predictHandler = () => {
        axios.get('api/predict/' + imageName)
        .then(res => {
            console.log(res.data.msg)
            axios.get('mediafiles/predictions/' + imageName.replace('.jpg','_pred.png'), {
                responseType: 'blob'
            }).then(res => {
                console.log(res)
                setPredictionPreviewUrl(URL.createObjectURL(res.data))
                
            })
            .catch(error => {
                //The interceptor of the hoc handles the exception
            })
        })
        .catch(error => {
            //The interceptor of the hoc handles the exception
        })
    }


    const downloadCsvHandler = () => {
        axios.get('mediafiles/csv/' + imageName.replace('.jpg','.csv'), {
            responseType: 'blob'
        }).then(res => {
            console.log(res)
            var filename = /[^/]*$/.exec(res.headers['content-disposition'])[0];
            let url = URL.createObjectURL(res.data);
            let a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
        })
        .catch(error => {
            //The interceptor of the hoc handles the exception
        })
    }

    return (
        
        <Fragment>
            {imageNotFound ? <NotFound>Error 404, image not found.</NotFound> : 
                <div className={classes.ControlPanel}>
                    <h1 className={classes.ControlTitle}>Control Panel</h1>

                    <div className={classes.imgNMeta}>
                        <div className={classes.container}>
                
                            <div className={classes.header}>
                                <p className={classes.imgName}>{imageName}</p>
                            </div>
                            
                            {!FlirPreviewUrl || !VisualPreviewUrl ? <Spinner/> : null}
                            <div className={classes.comparison}>
                                {FlirPreviewUrl ? <ReactCompareImage aspectRatio="wider"  sliderLineWidth="5" leftImageLabel="Flir" leftImage={FlirPreviewUrl} rightImage={VisualPreviewUrl} rightImageLabel="Visual Spectrum" />
                                :null}
                            </div>  
                        </div>
                        {metadata? <Table data={metadata}>Image metadata</Table> : null}
                        <div className={classes.buttons}>
                            <Button btnType='Danger' clicked={deleteHandler}> <Trash color="plain" size="small" /><span>Delete</span></Button>
                            <Button btnType='Success' clicked={downloadCsvHandler}> <Download color="plain" size="small" /><span>Download temperature data</span></Button>
                            <Button btnType='Success' clicked={predictHandler}> <Technology color="plain" size="small" /><span>Find sunlit leaves</span></Button>
                        </div>
                    </div>
                    {/* {PredictionPreviewUrl ? <ReactCompareImage aspectRatio="wider"  sliderLineWidth="5" leftImageLabel="Flir" leftImage={PredictionPreviewUrl} rightImage={VisualPreviewUrl} rightImageLabel="Visual Spectrum" />
                                :null} */}
                    

                    
                    
                    
                    {VisualNoCropPreviewUrl ? <img src={VisualNoCropPreviewUrl} alt={`Img-flir${props.id}`}/> : <Spinner/>}
                    {PredictionPreviewUrl ? <img src={PredictionPreviewUrl} alt={`Img-pred${props.id}`}/> : <Spinner/>}
    
                </div>}
        </Fragment>
        
    )
}

export default withErrorHandler(ControlPanel, axios)