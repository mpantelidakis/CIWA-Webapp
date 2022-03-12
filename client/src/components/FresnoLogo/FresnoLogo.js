import React from 'react'
import CIT_logo from '../../assets/images/CIT_logo.png'
import classes from './FresnoLogo.module.scss'

const citlogo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={CIT_logo} alt="CITLogo" />
    </div>
)

export default citlogo