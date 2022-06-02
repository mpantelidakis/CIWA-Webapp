import React from 'react'
import CIT_logo from '../../assets/images/CIT_logo.png'
import classes from './FresnoLogo.module.scss'

const citlogo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
         <a href="https://www.fresnostate.edu/jcast/cit/">
            <img src={CIT_logo} alt="CITLogo" />
        </a>
        
    </div>
)

export default citlogo