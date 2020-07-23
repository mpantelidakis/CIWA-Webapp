import React, {useEffect , useState, Fragment } from 'react'
import ReactCompareImage from 'react-compare-image';

import { base, Services } from 'grommet-icons';
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
        Promise.all([
            
                axios.get('mediafiles/flir/' + props.filename , { 
                    responseType: 'blob'
                }),
                axios.get('mediafiles/visual/' + props.filename, { 
                    responseType: 'blob'
                })
            ]
            
            ).then(function ([...responses]) {
            const responseOne = responses[0]
            const responseTwo = responses[1]

            setFlirPreviewUrl(URL.createObjectURL(responseOne.data))
            setVisualPreviewUrl(URL.createObjectURL(responseTwo.data))

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
            </div>
        </div>
    )
}

export default Images

