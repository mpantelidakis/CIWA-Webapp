import React from 'react'

import { Github, Facebook, Linkedin } from 'grommet-icons';

import classes from './Footer.module.scss'

const Footer = () => {
    return(
        <section className={classes.Footer}>
            <div className={classes.Group_createdBy_name}>
                <p>&copy; 2020 by <span className={classes.Self}>Minas Pantelidakis</span>. All rights reserved.</p>
            </div>
            
            <div className={classes.Icons}>
                <a className={classes.Link} href="https://www.linkedin.com/in/minas-pantelidakis-441b5012a/"><Linkedin color="plain" size="medium" /></a>
                <a className={classes.Link} href="https://github.com/Citywalk3r"><Github color="plain" size="medium" /></a>
                <a className={classes.Link} href="https://www.facebook.com/minas.pantelidakis"><Facebook color="plain" size="medium" /></a>
            </div>
        </section>
    )
}

export default Footer