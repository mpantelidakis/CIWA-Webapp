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

import { Category, ChartComponent, Legend, DataLabel, ColumnSeries, Inject, LineSeries, SeriesCollectionDirective, SeriesDirective, Tooltip } from '@syncfusion/ej2-react-charts';


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
                        console.log(tmpArray)
                        setTemperatureArray([...tmpArray])
                        setMinTemp(res.data['min_temp'])
                        setMaxTemp(res.data['max_temp'])

                        
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

                    <div className={classes.CPnButtons}>
                        <h1 className={classes.ControlTitle}>Control Panel</h1>
                        <div className={classes.Buttons}>
                                <Button btnType='Danger' clicked={deleteHandler}> <Trash color="plain" size="small" /><span>Delete</span></Button>
                                <Button btnType='Success' clicked={downloadCsvHandler}> <Download color="plain" size="small" /><span>Download temperature data</span></Button>
                                <Button btnType='Success' clicked={predictHandler}> <Technology color="plain" size="small" /><span>Find sunlit leaves</span></Button>
                        </div>
                    </div>
                    
                    {/* <img src={VisualPreviewUrl}/> */}

                    <div className={classes.HistogramWrapper}>
                     { FlirPreviewUrl  && temperatureArray ? <Histogram series={temperatureArray} min={minTemp} max={maxTemp}/> : null}
                    </div>
                    
                    <section className={classes.ImgNmeta}>
                        <div className={classes.Container}>
                
                            <div className={classes.Header}>
                                <p className={classes.ImgName}>{imageName}</p>
                            </div>
                            
                            {!FlirPreviewUrl || !VisualPreviewUrl ? <Spinner/> : null}
                            <div className={classes.Comparison}>
                                {FlirPreviewUrl ? <ReactCompareImage aspectRatio="wider"  sliderLineWidth="5" leftImageLabel="Flir" leftImage={FlirPreviewUrl} rightImage={VisualPreviewUrl} rightImageLabel="Visual Spectrum" />
                                :null}
                            </div>  
                        </div>
                        {metadata? <Table data={metadata}>Image metadata</Table> : null}
                      
                    </section>


                   

                    {VisualNoCropPreviewUrl && PredictionPreviewUrl ?
                        <section className={classes.PredictionSection}>
                            <ImageWithOverlay bg={VisualNoCropPreviewUrl} overlay={PredictionPreviewUrl}/> 
                        </section>
                    : null}

                </div>}
        </Fragment>
        
    )
}

export default withErrorHandler(ControlPanel, axios)