import React, {useState, useRef, Fragment} from 'react';
import axios from 'axios'

import ImagePreview from '../ImagePreview/ImagePreview'

import classes from './ImageUploader.module.scss'

import noPreview from "../../assets/images/no-preview.jpg"

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import { updateObject, checkValidity } from '../../shared/utility'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'


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
        console.log(event.target.files[0]);
        setFile(event.target.files[0]);
        setImageMetadata(null)
        if (props.withPreview)
            setFilePreviewUrl(URL.createObjectURL(event.target.files[0]))
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
   
        axios.post('http://localhost:5000/api/files', fd, {
            onUploadProgress: ProgressEvent => {
                // console.log('Upload Progress: ' + Math.round(ProgressEvent.loaded / ProgressEvent.total *100) + '%')
            }
        })
        .then(res => {

            console.log(res.data.metadata);
            setImageMetadata(res.data.metadata);
            syncForm(res.data.metadata);
            console.log(res.data.msg);

        })
        .catch(error => {
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
    }

    // const fileUploadHandler = () => {
    //     const fd = new FormData();
    //     fd.append('file', file)
    //     fd.append('metadata', imageMetadata)
        
 
    //     axios.post('http://localhost:5000/api/files', fd, {
    //         onUploadProgress: ProgressEvent => {
    //             console.log('Upload Progress: ' + Math.round(ProgressEvent.loaded / ProgressEvent.total *100) + '%')
    //         }
    //     })
    //     .then(res => {

    //         console.log(res.data.metadata)
    //         setImageMetadata(res.data.metadata)
    //         console.log(res.data.msg)

    //     })
    // }


    const toggleFormHandler = () => {
        setFormOpen(!formOpen)
    }

    const isDisabled = () => file ? true : false

    const inputEl = useRef(null);

    const classBtnSelect = [classes.Btn, classes.Btn__Select].join(' ');
    const classbtnUpload = [classes.Btn, classes.Btn__Upload].join(' ');
    const classBtnApply = [classes.Btn, classes.Btn__Apply].join(' ');
    const classBtnCancel = [classes.Btn, classes.Btn__Cancel].join(' ');

    const metaDataSubmitHandler = (event) => {
        // The default is to send out a request
        // which in turn reloads the form
        event.preventDefault()

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
        axios.post('http://localhost:5000/api/files', fd, {

        })
        .then(res => {

            // console.log(res.data.metadata)
            setImageMetadata(res.data.metadata)
            console.log(res.data.msg)

        })
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
        <div>
            <h4>Please edit the incorrect values and hit Apply</h4>
            <form onSubmit={metaDataSubmitHandler}>
                {formElementsArray.map(formElement => (
                        <div key={formElement.id}>{formElement.id}
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
                <Button 
                    btnType="Danger"
                    clicked={toggleFormHandler}>
                        Cancel
                </Button>
                <Button 
                    btnType="Success"
                    disabled={!formIsValid}
                    clicked={metaDataSubmitHandler}>
                        Apply changes and upload!
                </Button>
            </form>
        </div>
    )

    return (
        <Fragment>
        <div className={classes.ImageUploader}>
            {file ? 
            <Fragment>
            <p className={classes.Message}><strong>Will be uploaded: &nbsp; </strong>{file.name}</p>
            <p className={classes.Message}><strong>File size: &nbsp; </strong>{(file.size/(1024)).toFixed(2)} KBs</p>
            </Fragment>: 
            <p className={classes.Message}>Please select an image to upload</p>}
            <ImagePreview Url={filePreviewUrl}/>

            

            <input style={{display: 'none'}}
            type="file" 
            onChange={fileSelectedHandler}
            ref={inputEl}/>
            <div className={classes.Buttons}>
                {file ? <button className={classBtnSelect} onClick={() => inputEl.current.click()}>Select another image</button> : 
                <button className={classBtnSelect} onClick={() => inputEl.current.click()}>Select an image</button>}
                <button className={classbtnUpload} disabled={!isDisabled()} onClick={checkMetadataHandler}>Extract metadata</button>
                
            </div>
        </div>
        {imageMetadata ?  
            <div className={classes.MetadataPanel}>
                <h3>Are these values correct?</h3>
                <p>Atmospheric Temperature :{imageMetadata.AtmosphericTemperature} (&#8451;)</p>
                <p>Emissivity : {imageMetadata.Emissivity} (0-1)</p>
                {/* <p>IR Window Temperature: {imageMetadata.IRWindowTemperature} (&#8451;)</p>
                <p>IR Window Transmission: {imageMetadata.IRWindowTransmission}</p>
                <p>Planck B: {imageMetadata.PlanckB}</p>
                <p>Planck F: {imageMetadata.PlanckF}</p>
                <p>Planck O: {imageMetadata.PlanckO}</p>
                <p>Planck R1: {imageMetadata.PlanckR1}</p>
                <p>Planck R2: {imageMetadata.PlanckR2}</p> */}
                <p>Reflected Apparent Temperature: {imageMetadata.ReflectedApparentTemperature} (&#8451;)</p>
                <p>Relative Humidity: {imageMetadata.RelativeHumidity} (&#37;)</p>
                <p>Subject Distance: {imageMetadata.SubjectDistance} (m)</p>
                <Button  btnType="Danger" clicked={toggleFormHandler}>Nope, lemme edit.</Button>
                {!formOpen ? <Button  btnType="Success" clicked={metaDataSubmitHandler}>Yes, upload the image!</Button> : null}
            </div> 
        : null}
        {formOpen ? form : null}
        </Fragment>
    )
}

export default withErrorHandler(ImageUploader, axios)