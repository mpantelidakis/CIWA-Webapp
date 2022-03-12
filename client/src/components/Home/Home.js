import React from 'react'
import classes from './Home.module.scss'
import Logo from '../Logo/Logo'
import Aulogo from '../AULogo/AULogo'
import Citlogo from '../FresnoLogo/FresnoLogo'
import Tuclogo from '../TucLogo/TucLogo'

const Home = () =>{
    return (
        <section className={classes.SectionHome}>
            <div className={classes.Details}>
                <div className={classes.Logo}>
                    <Logo/>
                </div>
                <h1 className={`${classes.WelcomeText} ${classes.WelcomeText__Title}`}>CIWA</h1>
                <h2 className={`${classes.WelcomeText} ${classes.WelcomeText__TitleSecondary}`}>Crop Irrigation Web Agent</h2>

                <p className={`${classes.WelcomeText} ${classes.WelcomeText__DevelopedBy}`}>
                    developed by
                </p>
                <p className={`${classes.WelcomeText} ${classes.WelcomeText__TheRealOG}`}>
                    Minas Pantelidakis
                </p>
                <p className={`${classes.WelcomeText} ${classes.WelcomeText__SupportedBy}`}>
                    supported by
                </p>
                <p className={classes.SupportedByContainer}>
                    <Tuclogo/> 
                    <Citlogo/>
                    <Aulogo/> 
            </p>
            </div>
            
        </section>
    )
}

export default Home