import React from 'react'
import auLogo from '../../assets/images/AUlogo.png'
import classes from './AULogo.module.scss'

const aulogo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <a href="https://www.eng.auburn.edu/insy/">
            <img src={auLogo} alt="AUlogo" />
        </a>
    </div>
)

export default aulogo