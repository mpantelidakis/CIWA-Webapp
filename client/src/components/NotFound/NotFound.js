import React, { Fragment } from 'react';
import sadLeaf from '../../assets/images/sad-leaf.png';

import classes from './NotFound.module.scss'

const NotFound = props => {
    return (
        <div className={classes.NotFound}>
            <img  className={classes.SadLeaf} src={sadLeaf} alt={'Sad-Leaf-Logo'}></img>
            <p className={classes.Message}>{props.children}</p>
        </div>
    )
}

export default NotFound