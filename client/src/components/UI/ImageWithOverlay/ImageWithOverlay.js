import React, { useState } from 'react'
import classes from './ImageWithOverlay.module.scss'

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';



const ImageWithOverlay = props => {

    const [opacity, setOpacity] = useState(0.5)
    

    // const createSliderWithTooltip = Slider.createSliderWithTooltip;

    return (
        
        <div className={classes.ImageWithOverlay}>
           
            <img className={classes.Bg} src={props.bg} alt={`Img-bg`}/> 
            <img className={classes.Leaves} style={{opacity: opacity}} src={props.overlay} alt={`Img-overlay`}/>
            <Slider className={classes.Slider} marks={{0:0,0.5:0.5,1:1} } min={0} max={1}  step={0.001} defaultValue={0.5} onChange={(value) => setOpacity(value)} vertical/>
        </div>
       
    )

    // useEffect(() => {

    // }, [props.opacity])
}

export default ImageWithOverlay
