import React, {useEffect , useState, Fragment } from 'react'
import axios from '../../axios-orders'
import ReactCompareImage from 'react-compare-image';
// import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/src/styles/styles.scss";
import  sunlitImg from '../../assets/images/findSunlitBtn.png'


import NotFound from '../NotFound/NotFound'



import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import {Spinner} from 'react-spinners-css';

import { ThemeProvider }  from 'styled-components';
import {  base, Trash, Download, Technology, Solaris, Cloudlinux, Debian, Services } from 'grommet-icons';
import { deepMerge } from "grommet-icons/utils";

import Table from '../Table/Table'

import Button from '../UI/Button/Button'

import ImageWithOverlay from '../UI/ImageWithOverlay/ImageWithOverlay'
import classes from './ControlPanel.module.scss'

import { BrowserView,MobileView,isMobile } from 'react-device-detect';

import { Histogram } from '../Visualization/Histogram/Histogram'

import ParticleImg from '../ParticleImg/ParticleImg'

import Modal from '../UI/Modal/Modal'

const sunTheme = deepMerge(base, {
    global: {
      colors: {
        primary: '#ffad33',
        secondary: '#ffb84d',
        tertiary: '#39e600',
        fourth: '#ffc800',
        blue: '#00a2ff'
      },
    },
    icon: {
        size: {
            small: '12px',
            medium: '24px',
            large: '48px',
            xlarge: '96px',
            xxlarge: '220px'
        }
    }
  });
 

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

    const [CWSI, setCWSI] = useState(null)

    const [predActive, setpredActive] = useState(false)

    const [hasMask, setHasMask] = useState(false)

    const [isMobile1,setIsMobile] = useState(false)

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
                        setIsMobile(isMobile)
                        if(res.data['CWSI'])
                            setCWSI(res.data['CWSI'])

                        
                    })
                    .catch(errors => {
                        setImageNotFound(true)
                    })
    }, [])

 

    const deleteHandler = () => {
        axios.delete('api/file/' + imageName)
        .then(res => {
            console.log(res.data.msg)
            props.history.push('/');
            // props.history.push('/images');
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
            setCWSI(res.data['CWSI'])
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
        
        <><Fragment>
            {imageNotFound ? <NotFound>Error 404, image not found.</NotFound> :
                <div className={classes.ControlPanel}>
                    <BrowserView>
                        <div className={classes.CPnButtonsDesktop}>
                            <h1 className={classes.ControlTitle}>Control Panel</h1>
                            <div className={classes.Buttons}>
                                <Button btnType='Danger' clicked={deleteHandler}> <Trash color="plain" size="medium" /><span>Delete</span></Button>
                                <Button btnType='Success' clicked={downloadCsvHandler}> <Download color="plain" size="medium" /><span>Download temperature data</span></Button>
                                <Button btnType='Success' clicked={predictHandler} disabled={hasMask}> <Technology color="plain" size="medium" />
                                    <span class={classes.FindSunlitBtn}>Find sunlit leaves</span><div className={classes.FindSunlitImg}><img src={sunlitImg} alt="findSunlit" /></div>
                                </Button>
                            </div>
                        </div>
                    </BrowserView>
                    {/* <img src={VisualPreviewUrl}/> */}


                    {FlirPreviewUrl && temperatureArray ?
                        <div className={classes.HistogramWrapper}>
                            <p className={classes.Hint_no_margin}>The true thermal image is 60x80, so 4800 pixels in total.</p>
                            <Histogram series={temperatureArray} min={minTemp} max={maxTemp} />
                        </div>
                        : null}



                    <section className={classes.ImgNmeta}>
                        <div className={classes.Container}>
                            <p className={classes.Hint}>Left: Flir image 640x480.<br />Right: Generated Visible Spectrum Image <br />Use the slider in the middle to compare the images.</p>

                            <div className={classes.Header}>
                                <p className={classes.ImgName}>{imageName}</p>
                            </div>

                            {!FlirPreviewUrl || !VisualPreviewUrl ? <Spinner /> : null}
                            <div className={classes.Comparison}>
                                {FlirPreviewUrl ? <ReactCompareImage aspectRatio="wider" sliderLineWidth="5" leftImageLabel="Flir" leftImage={FlirPreviewUrl} rightImage={VisualPreviewUrl} rightImageLabel="Visible Spectrum" />
                                    : null}
                            </div>
                        </div>
                        {VisualPreviewUrl && PredictionPreviewUrl ?
                            <div className={classes.Prediction}>
                                <p className={classes.Hint}>Leaves are painted with yellow color. Use the slider on the right to adjust the opacity of the generated mask.</p>
                                <ImageWithOverlay bg={VisualPreviewUrl} overlay={PredictionPreviewUrl} />
                            </div>
                            : null}
                        {metadata ? <div className={classes.TableWrapper}>
                            <p className={classes.Hint}>Metadata found in the Flir image.</p>
                            <Table data={metadata}>Image metadata</Table>
                        </div> : null}
                    </section>


                    {meanLeafTemp && CWSI ?
                        <section className={classes.Analytics}>
                            <div className={classes.MeanLeafTempWrapper}>
                                <p className={classes.MeanLeafTempParagraph}>Sunlit leaves mean temperature</p>
                                <ThemeProvider theme={sunTheme}>
                                    <Solaris className={classes.MeanLeafTempIcon} size="xxlarge" color="fourth" />
                                </ThemeProvider>
                                <p className={classes.MeanLeafTemp}>{meanLeafTemp.toFixed(2)}</p>
                                <span>&#8451;</span>
                            </div>
                            <div className={classes.MeanLeafTempWrapper}>
                                <p className={classes.MeanLeafTempParagraph}>Crop Water Stress Index</p>
                                <ThemeProvider theme={sunTheme}>
                                    <Debian className={classes.CWSIcon} size="xxlarge" color="blue" />
                                </ThemeProvider>
                                <p className={classes.CWSI}>{CWSI.toFixed(3)}</p>
                                {/* <span>&#8451;</span> */}
                            </div>
                        </section>
                        : null}

                    <Modal show={predActive}> <p className={classes.ModalText}>Detecting sunlit leaves. Please wait...</p>
                        {predActive ? <ParticleImg img={VisualPreviewUrl} /> : null}</Modal>


                    <BrowserView>
                        {VisualPreviewUrl && PredictionPreviewUrl ? null :
                            <section className={classes.FindSunlitSection}>
                                <div className={classes.FindSunlitActionItem}>
                                    <Button style="margin: 0 auto;" btnType='Success' clicked={predictHandler} disabled={hasMask}> <Technology color="plain" size="medium" />
                                        <span>Find sunlit leaves</span><div className={classes.FindSunlitImg}><img src={sunlitImg} alt="findSunlit" /></div>
                                    </Button>
                                </div>
                            </section>}
                    </BrowserView>



                </div>}
        </Fragment><MobileView>
                <div className={classes.Spacer}></div>
                <div className={classes.CPnButtonsMobile}>
                    <h1 className={classes.ControlTitle}>Control Panel</h1>
                    <div className={classes.Buttons}>
                        <Button btnType='Danger' clicked={deleteHandler}> <Trash color="white" size="medium" /><span className={classes.CPnButtonTxt}>Delete</span></Button>
                        <Button btnType='Success' clicked={downloadCsvHandler}> <Download color="white" size="medium" /><span className={classes.CPnButtonTxt}>Download temperature data</span></Button>
                        <Button btnType='Success' clicked={predictHandler} disabled={hasMask}> <Technology color="white" size="medium" />
                            <span class={classes.CPnButtonTxt}>Find sunlit leaves</span><div className={classes.FindSunlitImg}><img src={sunlitImg} alt="findSunlit" /></div>
                        </Button>
                    </div>
                </div>
            </MobileView></>
        
        
    )
}

export default withErrorHandler(ControlPanel, axios)