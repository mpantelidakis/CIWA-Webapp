import React, {useEffect , useState, Fragment } from 'react'
import classes from './ImageWithOverlay.module.scss'

const ImageWithOverlay = props => {

    const [opacity, setOpacity] = useState(0.5)
    
    const opacityChangedHandler = (event) => {
        setOpacity(event.target.value)
    }

    return (
        <Fragment>
        <input type="float" label="opacity" value={opacity} onChange={(event) => opacityChangedHandler(event)}/>
        <div className={classes.Overlay} >
            <img src={props.bg} alt={`Img-bg`}/> 
            <img className={classes.Leaves} style={{opacity: opacity}} src={props.overlay} alt={`Img-overlay`}/>
        </div>
        </Fragment>
    )

    // useEffect(() => {

    // }, [props.opacity])
}

export default ImageWithOverlay
