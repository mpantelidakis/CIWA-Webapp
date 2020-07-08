import React, { useState, Fragment } from 'react'
import classes from './Layout.module.scss'

import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../components/UI/toastify.modules.scss'

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
                <ToastContainer className="responsive-toast" />
                {props.children}
            </main>
        </Fragment>
    )
}

export default Layout