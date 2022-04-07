import React from 'react'
import classes from './NavigationItems.module.scss'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        {/* <NavigationItem link="/images" exact>Images</NavigationItem> */}
        <NavigationItem link="/upload" exact>Home</NavigationItem>
        <NavigationItem link="/about" exact>About</NavigationItem>
        {/* {props.isAuthenticated ? <NavigationItem link="/lol">Test</NavigationItem> : null}
        {!props.isAuthenticated
            ?<NavigationItem link="/auth">Authenticate</NavigationItem>
            :<NavigationItem link="/logout">Logout</NavigationItem>
        } */}
    </ul>
)

export default navigationItems