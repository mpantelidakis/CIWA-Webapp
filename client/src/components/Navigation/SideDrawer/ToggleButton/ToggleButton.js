import React from 'react'
import classes from './ToggleButton.module.scss'

const toggleButton = (props) => (
    <div className={classes.ToggleButton} onClick={props.clicked}>
        <span/>
    </div>
)

export default toggleButton