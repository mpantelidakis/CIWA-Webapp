import React from 'react'
import classes from './Toolbar.module.scss'
import Logo from '../../Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'
import ToggleButton from '../SideDrawer/ToggleButton/ToggleButton'

import { NavLink } from 'react-router-dom'

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <ToggleButton clicked={props.drawerToggleClicked}/>
        <div className={classes.Logo}>
        <NavLink to="/" exact><Logo/></NavLink>
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuth}/>
        </nav>
    </header>
)

export default toolbar