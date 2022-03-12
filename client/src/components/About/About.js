import React from 'react'
import classes from './About.module.scss'

const About = () =>{
    return (
        <section className={classes.SectionAbout}>
            <div className={classes.Details}>
                <div className={classes.Details__Abstract}>
                
                <p>Precision irrigation is vital for a resource-sustainable agriculture future. 
                CIWA (Crop Irrigation Web-based Agent) is an interactive web-based tool that enables measurement of the 
                Crop water stress index (CWSI) of pistachio trees.
                It achieves this by utilizing infrared thermography to calculate the mean canopy temperature of sunlit-leaf regions in an image.
                Sunlit-leaf regions are identified by employing the power of Convolutional Neural Networks (CNNs), and specifically FRRN-A [1].
                More details on the CIWA methodology can be found in the respective research publication [2]. The CIWA application
                was designed and developed in the context of a thesis project submitted by Minas Pantelidakis 
                (under the supervision of Associate Professor Georgios Chalkiadakis)
                to the Department of Electrical and Computer Engineering, Technical University of Crete, in partial fulfillment of the requirements for 
                the degree of Master of Engineering (MEng.). The CIWA methodology was deveoped in collaboration with Dr. Shawn Ashkan, Center for Irrigation 
                Technology, Jordan College of Agriculutal Sciences and Technology, and Assistant Professor Athanasios Aris Panagopoulos, department of Computer 
                Science, California State University, Fresno. </p>
                <br />
                <p>
                CIWA is not a commercial product, but publicly available, for free. We envisage that CIWA will be used 
                by growers and researchers worldwide, for activities ranging from data collection and analysis, to precision irrigation scheduling.
                </p>
                
                {/* To this end, we also provide a web-based application program interface (API), thus enabling the user to fully utlize the tool's capabilities. */}
                
                </div>
            </div>
        
       
        </section>
    )
}

export default About