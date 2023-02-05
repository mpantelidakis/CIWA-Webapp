# CIWA-Webapp

Precision irrigation is vital for a resource-sustainable agriculture future. Many precision irrigation techniques rely on a measurement of the crop water stress index (CWSI). CIWA (crop irrigation web-based agent) is an interactive web-based tool that enables the measurement of the CWSI of pistachio trees with minimum user input. The backbone of CIWA is a convolutional neural network (CNN) model for the semantic segmentation of sunlit-leaf regions in visible spectrum images. The CWSI measurement also relies on infrared thermography and weather parameters. More details on the CIWA methodology are available in a corresponding research publication[^1].

The tool uses a docker environment, running four containers, React for the front end, Nginx as a reverse proxy and file server, Flask web
framework for our REST API, and MongoDB as our database. The tool enables a user to upload a FLIR AX8 image. It provides
the user with a graphical interface to manipulate the metadata of the image. The back-end of the tool receives the image and metadata.
The FRRN-A model is utilized for sunlit-leaf segmentation. The CWSI is returned to the user. Apart from
the CWSI measurement, the tool offers multiple features such as direct comparison between the thermal and visible-spectrum images, temperature histogram analysis, and the option to download temperature data in .csv format. 

-To build the images and start the app in development mode, please use `docker-compose -f docker-compose.dev.yml up --build`.

*To build the images and start the app in production mode, please use `docker-compose -f docker-compose.prod.yml up --build`.














[^1]: https://www.sciencedirect.com/science/article/pii/S095741742201452X
