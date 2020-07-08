import React, {useEffect , useState, Fragment } from 'react'
import ReactCompareImage from 'react-compare-image';

import { base, Technology, Next, Action, Configure, Services } from 'grommet-icons';
import { ThemeProvider }  from 'styled-components';
import { deepMerge } from "grommet-icons/utils";
 

import { Link } from 'react-router-dom'

import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/src/styles/styles.scss";
import "../../UI/btn-awsome-style.scss"

import axios from '../../../axios-orders'

import classes from "./Images.module.scss";





const Images = props => {

    const [FlirPreviewUrl, setFlirPreviewUrl] = useState(null);
    const [VisualPreviewUrl, setVisualPreviewUrl] = useState(null);
    const [ThermalPreviewUrl, setThermalPreviewUrl] = useState(null);

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

//     const Container = styled.div`
//   > * {
//     margin-right: 6px;
//     margin-top: 6px;
//     font-family: "Work Sans", Arial, sans-serif;
//   }
// `;
    const customColorTheme = deepMerge(base, {
        global: {
            colors: {
            icons: "#333333"
            }
        },
        icon: {
            size: {
                fit: '100%',
            }
        }
        });


    useEffect(() => {
        Promise.all([flir_request, visual_request]).then(function ([...responses]) {
            const responseOne = responses[0]
            const responseTwo = responses[1]
            // const responesThree = responses[2]

            setFlirPreviewUrl(URL.createObjectURL(responseOne.data))
            setVisualPreviewUrl(URL.createObjectURL(responseTwo.data))
            // setThermalPreviewUrl(URL.createObjectURL(responesThree.data))

          }).catch(errors => {
            // react on errors.
          })
    }, [props.filename])

    return (
        
        <div className={classes.container}>
            
            <div className={classes.header}>
                <p className={classes.imgName}>{props.filename}</p>

                <Link className={classes.btn} to={"images/" + props.filename}>
                    <ThemeProvider theme={customColorTheme}>
                            <Services color="white" size="fit" />
                    </ThemeProvider>
                </Link>
            </div>
            
            {!FlirPreviewUrl || !VisualPreviewUrl ? props.loader : null}
            <div className={classes.comparison}>
                {FlirPreviewUrl ? <ReactCompareImage aspectRatio="wider"  sliderLineWidth="5" leftImageLabel="Flir" leftImage={FlirPreviewUrl} rightImage={VisualPreviewUrl} rightImageLabel="Visual Spectrum" />
                :null}
                
                {/* <img src={FlirPreviewUrl} alt={`Img-flir${props.id}`}/>
                <img src={VisualPreviewUrl} alt={`Img-visual-${props.id}`}/>
                <img src={ThermalPreviewUrl} alt={`Img-thermal${props.id}`}/> */}
            </div>
            {/* {metadataPanel} */}
        </div>
        
    )
}

export default Images

