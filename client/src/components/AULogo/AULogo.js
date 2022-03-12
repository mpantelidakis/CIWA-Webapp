import React from 'react'
import auLogo from '../../assets/images/AUlogo.png'
import classes from './AULogo.module.scss'

const aulogo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={auLogo} alt="AUlogo" />
    </div>
)

export default aulogo