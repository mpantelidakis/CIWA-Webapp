import React, {useState, useRef, Fragment, useEffect} from 'react';
import axios from '../../axios-orders'
import { withRouter } from 'react-router-dom'

import ImagePreview from '../ImagePreview/ImagePreview'

import classes from './ImageUploader.module.scss'

import noPreview from "../../assets/images/no-preview.jpg"

import Input from '../../components/UI/Input/Input'
import { updateObject, checkValidity } from '../../shared/utility'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import { AwesomeButton, AwesomeButtonProgress } from "react-awesome-button";
import { Events, Link, animateScroll as scroll } from "react-scroll";

import "react-awesome-button/src/styles/styles.scss";

import "../UI/btn-awsome-style.scss"


const ImageUploader = props => {

    const metadataConfig = {
        AtmosphericTemperature: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Atmospheric Temperature'
            },
            value: '',
            validation: {
                required: false,
                isFloat: true,
                maxValue:70,
                minValue:-70
            },
            valid: true,
            touched: false
        },
        Emissivity: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Emmisivity',
            },
            value: '',
            validation: {
                required: false,
                isFloat: true,
                maxValue:"1",
                minValue:"0"
            },
            valid: true,
            touched: false
        },
        ReflectedApparentTemperature: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Reflected Apparent Temperature'
            },
            value: '',
            validation: {
                required: false,
                isFloat: true,
                maxValue:70,
                minValue:-70
            },
            valid: true,
            touched: false
        },
        RelativeHumidity: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Relative Humidity'
            },
            value: '',
            validation: {
                required: false,
                isFloat: true,
                maxValue:100,
                minValue:"0"
            },
            valid: true,
            touched: false
        },
        SubjectDistance: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Subject Distance'
            },
            value: '',
            validation: {
                required: true,
                isFloat: true,
                maxValue:200,
                minValue:"0"
            },
            valid: true,
            touched: false
        }
        // applyGlobals: {
        //     elementType: 'select',
        //     elementConfig: {
        //         options: [
        //             {
        //                 value: 'fastest',
        //                 displayValue: 'Fastest'
        //             },
        //             {
        //                 value: 'cheapest',
        //                 displayValue: 'Cheapest'
        //             }
        //         ]
        //     },
        //     value: 'fastest',
        //     validation: {},
        //     valid: true
        // },
    }
    


    const [file, setFile] = useState(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState(noPreview);
    const [imageMetadata, setImageMetadata] = useState(null);
    const [metaform, setMetaform] = useState(metadataConfig);
    const [formIsValid, setFormIsValid] = useState(true);
    const [formOpen, setFormOpen] = useState(false);

    const fileSelectedHandler = (event) => {
        if(event.target.files[0]){
            setFile(event.target.files[0]);
            setImageMetadata(null)
            if (props.withPreview)
                setFilePreviewUrl(URL.createObjectURL(event.target.files[0]))
        }
    }

    const syncMetadataFromForm = (event) => {
        if (event && event.preventDefault)
        event.preventDefault();

        const metadata = {}
        for (let formElementIdentifier in metaform){
            metadata[formElementIdentifier] = metaform[formElementIdentifier].value
        }
        setImageMetadata(metadata)
        toggleFormHandler()
    }

    const syncForm = (dict) => {
        for (let key in dict){
            if(metadataConfig[key]){
                let tmp =  dict[key]
                metadataConfig[key].value = tmp
                metadataConfig[key].elementConfig.placeholder = tmp
            }
        }
        // console.log(metadataConfig)
        setMetaform(metadataConfig)
    }
    

    const checkMetadataHandler = () => {
        const fd = new FormData();
        fd.append('file', file)
   
        axios.post('/api/files', fd, {
            onUploadProgress: ProgressEvent => {
                // console.log('Upload Progress: ' + Math.round(ProgressEvent.loaded / ProgressEvent.total *100) + '%')
            }
        })
        .then(res => {

            // console.log(res.data.metadata);
            setImageMetadata(res.data.metadata);
            syncForm(res.data.metadata);
            // console.log(res.data.msg);

        })
        .catch(error => {
            //The interceptor of the hoc handles the exception
        })
    }

    const toggleFormHandler = () => {
        setFormOpen(!formOpen)
    }

    const isDisabled = () => file ? true : false

    const inputEl = useRef(null);

    const generateMetaFormData = () => {
     
        const metadata = {}
        for (let formElementIdentifier in metaform){
            metadata[formElementIdentifier] = String(metaform[formElementIdentifier].value)
        }

        // Convert our dictionary to JSON format so we can parse the request using json.loads
        const json_meta = JSON.stringify(metadata)

        // Create a new FormData object
        const fd = new FormData();

        // Attach the file and the metadata to it
        fd.append('file', file)
        fd.append('metadata', json_meta)

        // The file of the formdata will be available under request.files
        // The metadata of the formdata will be available under request.form.get('metadata)

        return fd
    }

    

    const inputChangedHandler = (event, inputIdentifier) => {
       
        const updatedFormElement = updateObject(metaform[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, metaform[inputIdentifier].validation),
            touched: true
        })
            
        const updatedMetadataForm = updateObject(metaform, {
            [inputIdentifier]: updatedFormElement
        })

        let formValid = true
        for (let inputIdentifier in updatedMetadataForm){
            formValid = updatedMetadataForm[inputIdentifier].valid && formValid
        }
        setMetaform(updatedMetadataForm)
        setFormIsValid(formValid)
    }

    const formElementsArray = []
    for (let key in metaform){
        formElementsArray.push({
            id: key,
            config: metaform[key]
        })
    }

    let form = (
        <div className={classes.MetadataForm} id='#metaForm'>
            <h4 className={classes.MetadataForm__title}>Please edit the incorrect values</h4>
            <form onSubmit={(e) => {
                            syncMetadataFromForm(e)
                          }}>
                {formElementsArray.map(formElement => (
                        <div className={classes.MetadataForm__formField}key={formElement.id}>
                        <p className={classes.MetadataForm__InputFieldName}>{formElement.id}</p>
                        <Input
                            
                            elementType={formElement.config.elementType}
                            valueType={formElement.id}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(event) => inputChangedHandler(event, formElement.id)}
                        />
                        </div>
                ))}
                <div className={classes.Buttons}>
                    <AwesomeButton
                        // cssModule={btnClass}
                        type="secondary"
                        ripple
                        
                        onPress={toggleFormHandler}
                        >
                        Cancel
                    </AwesomeButton>

               
                    <AwesomeButton
                        // cssModule={btnClass}
                        type="primary"
                        ripple
                        disabled={!formIsValid}
                        onPress={(e) => {
                            syncMetadataFromForm(e)
                          }}
                        >
                        Apply changes
                    </AwesomeButton>
                </div>
            </form>
        </div>
    )

    return (
        <Fragment>
        <div className={classes.SectionImageUploader}>
            
        
           
            <div className={classes.ImageUploader}>
                {file ? 
                <Fragment>
                <div className={classes.Message}>
                    <p><strong>Will be uploaded: </strong>{file.name}</p>
                    <p><strong>File size: </strong>{(file.size/(1024)).toFixed(2)} KBs</p>
                </div>
                </Fragment>: 
                <p className={classes.Message}>Please upload a FLIR AX8 image <br/>
                (to test the tool use <a href="https://223886be-4720-4a40-bee2-98c5f71fc084.filesusr.com/archives/e2f6fc_c8e60b3415394b7485390c6dfa405cb3.zip?dn=FLIR%20AX8%20sample%20image.zip"> sample image 1</a>
                or <a href="https://223886be-4720-4a40-bee2-98c5f71fc084.filesusr.com/archives/e2f6fc_9dcf9b06291540c1a5f9538f84c6f05a.zip?dn=FLIR%20AX8%20sample%20image%20II.zip"> sample image 2</a>)</p>}
                <ImagePreview Url={filePreviewUrl}/>

                

                <input style={{display: 'none'}}
                type="file" 
                onChange={fileSelectedHandler}
                ref={inputEl}/>
                <div className={classes.Buttons}>
                    {/* {file ? <button className={classBtnSelect} onClick={() => inputEl.current.click()}>Select another image</button> : 
                    <button className={classBtnSelect} onClick={() => inputEl.current.click()}>Select an image</button>} */}
                    {file ? <AwesomeButton
                            // cssModule={btnClass}
                            type="secondary"
                            ripple
                            size="large"
                            onPress={() => inputEl.current.click()}
                            >
                            Select another image
                    </AwesomeButton>:
                    <AwesomeButton
                            // cssModule={btnClass}
                            type="secondary"
                            ripple
                            size="large"
                            onPress={() => inputEl.current.click()}
                            >
                            Select an image
                    </AwesomeButton>}
                    {/* <button className={classbtnUpload} disabled={!isDisabled()} onClick={checkMetadataHandler}>Extract metadata</button> */}
                    <AwesomeButton
                            // cssModule={btnClass}
                            type="primary"
                            ripple
                            size="large"
                            disabled={!isDisabled()}
                            onPress={checkMetadataHandler}
                            >
                            Extract metadata
                    </AwesomeButton>
                    
                </div>
            </div>
            {imageMetadata ?  
                <div className={classes.MetadataPanel} id="#metaPanel">
                    <h3 className={classes.MetadataPanel__title}>Are these values correct?</h3>
                    <p className={classes.MetadataPanel__element}>Atmospheric Temperature : <span className={classes.metaSpan}>{imageMetadata.AtmosphericTemperature}</span> (&#8451;)</p>
                    <p className={classes.MetadataPanel__element}>Emissivity : <span className={classes.metaSpan}>{imageMetadata.Emissivity}</span> (0.00 &mdash; 1.00)</p>
                    {/* <p>IR Window Temperature: </span>{imageMetadata.IRWindowTemperature}</span> (&#8451;)</p>
                    <p className={classes.MetadataPanel__element}>IR Window Transmission: <span>{imageMetadata.IRWindowTransmission}</span></p>
                    <p className={classes.MetadataPanel__element}>Planck B: <span>{imageMetadata.PlanckB}</span></p>
                    <p className={classes.MetadataPanel__element}>Planck F: <span>{imageMetadata.PlanckF}</span></p>
                    <p className={classes.MetadataPanel__element}>Planck O: <span>{imageMetadata.PlanckO}</span></p>
                    <p className={classes.MetadataPanel__element}>Planck R1: <span>{imageMetadata.PlanckR1}</span></p>
                    <p className={classes.MetadataPanel__element}>Planck R2: <span>{imageMetadata.PlanckR2}</p></span> */}
                    <p className={classes.MetadataPanel__element}>Reflected Apparent Temperature: <span className={classes.metaSpan}>{imageMetadata.ReflectedApparentTemperature}</span> (&#8451;)</p>
                    <p className={classes.MetadataPanel__element}>Relative Humidity: <span className={classes.metaSpan}>{imageMetadata.RelativeHumidity}</span> (&#37;)</p>
                    <p className={classes.MetadataPanel__element}>Subject Distance: <span className={classes.metaSpan}>{imageMetadata.SubjectDistance}</span> (m)</p>
                    <div className={classes.Buttons}>
                        <Link
                            // activeClass="active"
                            to="#metaForm"
                            spy={true}
                            // hashSpy={true}
                            smooth={true}
                            offset={0}
                            duration={1000}
                            // isDynamic

                        >  
                            <AwesomeButton
                                // cssModule={btnClass}
                                type="secondary"
                                ripple
                                disabled={formOpen}
                                onPress={toggleFormHandler}
                                style = {{width: '100%'}}
                                >
                                No, let me edit
                            </AwesomeButton>
                        </Link>
                    
                        {!formOpen ?  <AwesomeButtonProgress
                            // cssModule={AwesomeButtonStyles}
                            type="primary"
                            ripple
                            onPress={(e, next) => {
                                
                                const fd = generateMetaFormData()
                                axios.post('/api/files', fd, {

                                })
                                .then(res => {
                        
                                    console.log(res.data.metadata);
                                    setImageMetadata(res.data.metadata);
                                    console.log(res.data.msg);
                                    next();
                                    // props.history.push('/images');
                                    props.history.push('/images/'+ file.name);
                                })
                                
                            }}
                            >
                            Yes, upload the image
                        </AwesomeButtonProgress>: null}
                    </div>
                    
                </div> 
            : null}
            {formOpen ? form : null}
        </div>
        </Fragment>
    )
}

export default withRouter(withErrorHandler(ImageUploader, axios))