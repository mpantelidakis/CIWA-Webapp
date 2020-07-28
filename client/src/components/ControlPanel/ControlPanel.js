import React, {useEffect , useState, Fragment } from 'react'
import axios from '../../axios-orders'
import ReactCompareImage from 'react-compare-image';
// import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/src/styles/styles.scss";

import NotFound from '../NotFound/NotFound'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import {Spinner} from 'react-spinners-css';

import {  base, Trash, Download, Technology, Next, Action, Configure, Services } from 'grommet-icons';

import Table from '../Table/Table'

import Button from '../UI/Button/Button'

// import styles from 'react-awesome-button/src/styles/themes/theme-red';

import ImageWithOverlay from '../UI/ImageWithOverlay/ImageWithOverlay'
import classes from './ControlPanel.module.scss'

import { Histogram } from '../Visualization/Histogram/Histogram'

import ParticleImg from '../ParticleImg/ParticleImg'

import Modal from '../UI/Modal/Modal'


const ControlPanel = props => {

    const [imageName, setImageName] = useState("")
    const [metadata, setMetadata] = useState({})
    const [FlirPreviewUrl, setFlirPreviewUrl] = useState(null);
    const [VisualPreviewUrl, setVisualPreviewUrl] = useState(null);
    const [ThermalPreviewUrl, setThermalPreviewUrl] = useState(null);
    const [PredictionPreviewUrl, setPredictionPreviewUrl] = useState(null);
    const [VisualNoCropPreviewUrl, setVisualNoCropPreviewUrl] = useState(null);

    const [imageNotFound, setImageNotFound] = useState(false)

    const [temperatureArray, setTemperatureArray] = useState([])
    const [minTemp, setMinTemp] = useState(0)
    const [maxTemp, setMaxTemp] = useState(0)

    const [meanLeafTemp, setMeanLeafTemp] = useState(null)

    const [predActive, setpredActive] = useState(false)

    const [hasMask, setHasMask] = useState(false)

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
                        if(res.data['has_mask']){
                            Promise.all([
                                axios.get('mediafiles/predictions/' + props.match.params['imageName'].replace('.jpg','_pred.png') , { 
                                    responseType: 'blob'
                                }),
                                axios.get('mediafiles/visual_nocrop/' + props.match.params['imageName'] , { 
                                    responseType: 'blob'
                                })
                            ]).then(function ([...responses]) {
                                const responsePred = responses[0]
                                const responseVisualNoCrop = responses[1]
                                
                                setPredictionPreviewUrl(URL.createObjectURL(responsePred.data))
                                setVisualNoCropPreviewUrl(URL.createObjectURL(responseVisualNoCrop.data))
                            })
                        }
                        setMetadata(res.data.metadata)
                        Promise.all([
                            axios.get('mediafiles/flir/' + props.match.params['imageName'] , { 
                                responseType: 'blob'
                            }),
                            axios.get('mediafiles/visual/' + props.match.params['imageName'] , { 
                                responseType: 'blob'
                            }),
                            axios.get('mediafiles/thermal/' + props.match.params['imageName'].replace('.jpg','.png') , { 
                                responseType: 'blob'
                            }),
                        ]).then(function ([...responses]) {
                            const responseFlir = responses[0]
                            const responseVisual = responses[1]
                            const responseThermal = responses[2]
                    
                            setFlirPreviewUrl(URL.createObjectURL(responseFlir.data))
                            setVisualPreviewUrl(URL.createObjectURL(responseVisual.data))
                            setThermalPreviewUrl(URL.createObjectURL(responseThermal.data))
                        })

                        let hugeString = res.data['temps'].replace(/[\[\]]/g, '')
                        let tmpArray = hugeString.match(/[+-]?((\d+\.?\d*)|(\.\d+))/g).map(Number)
                        // console.log(tmpArray)
                        setTemperatureArray([...tmpArray])
                        setMinTemp(res.data['min_temp'])
                        setMaxTemp(res.data['max_temp'])
                        setMeanLeafTemp(res.data['mean_sunlit_temp'])
                        setHasMask(res.data['has_mask'])

                        
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
        setpredActive(true)
        axios.get('api/predict/' + imageName)
        .then(res => {
            console.log(res.data)
            Promise.all([
                axios.get('mediafiles/predictions/' + props.match.params['imageName'].replace('.jpg','_pred.png') , { 
                    responseType: 'blob'
                }),
                axios.get('mediafiles/visual_nocrop/' + props.match.params['imageName'] , { 
                    responseType: 'blob'
                })
            ]).then(function ([...responses]) {
                const responsePred = responses[0]
                const responseVisualNoCrop = responses[1]
                
                setPredictionPreviewUrl(URL.createObjectURL(responsePred.data))
                setVisualNoCropPreviewUrl(URL.createObjectURL(responseVisualNoCrop.data))
            })
            setMeanLeafTemp(res.data['mean_sunlit_temp'])
            setpredActive(false)
            setHasMask(true)
        })
        .catch(error => {
            //The interceptor of the hoc handles the exception
        })
    }


    const downloadCsvHandler = () => {
        axios.get('mediafiles/csv/' + imageName.replace('.jpg','.csv'), {
            responseType: 'blob'
        }).then(res => {
            // console.log(res)
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

                    <div className={classes.CPnButtons}>
                        <h1 className={classes.ControlTitle}>Control Panel</h1>
                        <div className={classes.Buttons}>
                                <Button btnType='Danger' clicked={deleteHandler}> <Trash color="plain" size="medium" /><span>Delete</span></Button>
                                <Button btnType='Success' clicked={downloadCsvHandler}> <Download color="plain" size="medium" /><span>Download temperature data</span></Button>
                                <Button btnType='Success' clicked={predictHandler} disabled={hasMask}> <Technology color="plain" size="medium" /><span>Find sunlit leaves</span></Button>
                        </div>
                    </div>
                    
                    {/* <img src={VisualPreviewUrl}/> */}

                   
                     { FlirPreviewUrl  && temperatureArray ? 
                        <div className={classes.HistogramWrapper}>
                            <p className={classes.Hint_no_margin}>The true thermal image is 60x80, so 4800 pixels in total.</p>
                            <Histogram series={temperatureArray} min={minTemp} max={maxTemp}/>
                        </div> 
                    : null}
                    
                    
                    <section className={classes.ImgNmeta}>
                        <div className={classes.Container}>
                            <p className={classes.Hint}>Left: Flir image 640x480.<br/>Right: Generated Visual Spectrum Image (without the black surrounding box)<br/>Use the slider in the middle to compare the images.</p>
                
                            <div className={classes.Header}>
                                <p className={classes.ImgName}>{imageName}</p>
                            </div>
                            
                            {!FlirPreviewUrl || !VisualPreviewUrl ? <Spinner/> : null}
                            <div className={classes.Comparison}>
                                {FlirPreviewUrl ? <ReactCompareImage aspectRatio="wider"  sliderLineWidth="5" leftImageLabel="Flir" leftImage={FlirPreviewUrl} rightImage={VisualPreviewUrl} rightImageLabel="Visual Spectrum" />
                                :null}
                            </div>  
                        </div>
                        {VisualPreviewUrl && PredictionPreviewUrl ?
                        <div className={classes.Prediction}>
                            <p className={classes.Hint}>Leaves are painted with yellow color. Use the slider on the right to adjust the opacity of the generated mask.</p>
                            <ImageWithOverlay bg={VisualPreviewUrl} overlay={PredictionPreviewUrl}/> 
                        </div>
                         : null}
                        {metadata? <div className={classes.TableWrapper}>
                            <p className={classes.Hint}>Metadata found in the Flir image.</p>
                            <Table data={metadata}>Image metadata</Table>
                        </div> : null}
                        
                      
                    </section>
                    <section className={classes.Analytics}>
                        {meanLeafTemp ? <p classname={classes.MeanLeafTempParagraph}>Sunlit leaves mean temperature: <span className={classes.MeanLeafTempSpan}>{meanLeafTemp}</span></p> : null}
                    </section>
                    
                    <Modal show={predActive}> <p className={classes.ModalText}>Detecting sunlit leaves. Please wait...</p>
                    {predActive ? <ParticleImg img={VisualPreviewUrl}/> : null}</Modal>
                   


                   

                   

                </div>}
        </Fragment>
        
    )
}

export default withErrorHandler(ControlPanel, axios)