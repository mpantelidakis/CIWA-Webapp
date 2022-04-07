import React from 'react'
import classes from './About.module.scss'

const About = () =>{
    return (
        <section className={classes.SectionAbout}>
            <div className={classes.Details}>
                <div className={classes.Details__Abstract}>
                <b>About</b>
                <br />
                <br />
                <p>Precision irrigation is vital for a resource-sustainable agriculture future. Many precision irrigation techniques rely on a measurement 
                of the crop water stress index (CWSI). CIWA (crop irrigation web-based agent) is an interactive web-based tool that enables the measurement of the 
                CWSI of pistachio trees with minimum user input. The backbone of CIWA is a convolutional neural network (CNN) model for the semantic segmentation of sunlit-leaf regions 
                in visible spectrum images. The CWSI measurement also relies on infrared thermography and weather parameters.
                More details on the CIWA methodology will become available in a corresponding research document in the near future. 
                
                The CIWA tool was designed and developed in the context of a thesis project submitted by Minas Pantelidakis (Ph.D. student, Auburn University, AL, U.S.) 
                , under the supervision of Associate Professor Georgios Chalkiadakis (Technical University of Crete, Chania, Greece) and Assistant Professor Athanasios Aris Panagopoulos 
                (California State University Fresno, CA, U.S.), in partial fulfillment of the requirements for the degree of Master of Engineering (MEng.) 
                to the Department of Electrical and Computer Engineering, Technical University of Crete, Chania, Greece. The CIWA methodology was deveoped in the contex of
                a collaborative interdisciplinary research endeavor funded by the Agriculture Research Institute (ARI), including Shawn Ashkan (Center for Irrigation Technology, California State University Fresno, CA, U.S.)
                , Dr. Konstantinos Mykoniatis (Auburn University, AL, U.S.), Rajeswari Cherupillil Eravi (California State University, Fresno, CA, U.S.), 
                Vishnu Pamula, Enrique Cruz Verduzco III (California State University Fresno, CA, U.S.), Oleksandr Babich (California State University Fresno, CA, U.S.), 
                , and Orestis Panagopoulos (California State University Stanislaus, CA, U.S.).</p>
                <br />
                <p>
                CIWA is not a commercial product, but publicly available, for free. We envisage that CIWA will be used 
                by growers and researchers worldwide, for activities ranging from data collection and analysis, to precision irrigation scheduling.
                </p>
                
                </div>
            </div>
        
       
        </section>
    )
}

export default About