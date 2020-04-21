import React, { useState, Fragment } from 'react'
import classes from './Layout.module.scss'

import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

const Layout = (props) => {

    const [showSideDrawer, setSideDrawer] = useState(false);


    const sideDrawerClosedHandler = () => {
        setSideDrawer(false);
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawer(prevState => !prevState.showSideDrawer)
    }

    return (
        <Fragment>
            <Toolbar
                isAuth = {props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHandler}
            />
            <SideDrawer
                isAuth = {props.isAuthenticated}
                open={showSideDrawer} 
                closed = {sideDrawerClosedHandler}
            />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Fragment>
    )
}

export default Layout