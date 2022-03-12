import React from 'react'
import classes from './About.module.scss'

const About = () =>{
    return (
        <section className={classes.About}>
        
        Precision irrigation is a vital component for a resource-sustainable agriculture future. 
        CIWA (Crop Irrigation Web-based Agent) is an interactive web-based tool that enables measurement of the 
        Crop water stress index (CWSI) of pistachio trees.
        It achieves this by utilizing infrared thermography to calculate the mean canopy temperature of the sunlit-leaf region of an image.
        Sunlit-leaf regions are identified by employing the power of Convolutional Neural Networks (CNNs), and specifically FRRN-A to identify sunlit leaves.
        CIWA is not a commercial product, but available to all, free of charge. We envisage that CIWA will be used 
        by growers and researchers worldwide, for activities ranging from data collection and analysis, to precision irrigation scheduling.
        {/* To this end, we also provide a web-based application program interface (API), thus enabling the user to fully utlize the tool's capabilities. */}
        CIWA is an integral part of a thesis project submitted by Minas Pantelidakis to the Department of Electrical and Computer Engineering 
        (and completed under the supervision of Associate Professor Georgios Chalkiadakis), 
        in partial fulfillment of the requirements for the degree of Master of Engineering (MEng.). 
        The CIWA web app was also designed and developed by Minas Pantelidakis.
        </section>
    )
}

export default About