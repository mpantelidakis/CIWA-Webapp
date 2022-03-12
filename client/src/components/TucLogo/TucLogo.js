import React from 'react'
import TucLogo from '../../assets/images/tuc_logo.png'
import classes from './TucLogo.module.scss'

const tuclogo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={TucLogo} alt="TucLogo" />
    </div>
)

export default tuclogo