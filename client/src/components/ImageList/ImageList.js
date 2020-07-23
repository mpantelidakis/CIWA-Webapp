import React, {useEffect , useState, Fragment } from 'react'
import axios from '../../axios-orders'
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/src/styles/styles.scss";

import { Spinner } from 'react-spinners-css';

import "../UI/btn-awsome-style.scss"

import Images from './Images/Images'
import classes from './ImageList.module.scss'


const ImageList = props => {

    const [imageList, setImageList] = useState([]);
    const [prevUrl, setPrevUrl] = useState({limit:'', offset: 'None'})
    const [nextUrl, setNextUrl] = useState({limit:'', offset:''})
    // console.log(props.history);

    useEffect(() => {
        axios.get('/api/files', {
            params: {
                limit: '6',
                offset: '0'
            }
        })
        .then(res => {
            setImageList(res.data.result);
            setPrevUrl({...res.data.prev_url});
            setNextUrl({...res.data.next_url});  
        })
        .catch(error => {
            //The interceptor of the hoc handles the exception
        })
    }, [])

    const loader =  <Spinner style={{marginTop:"20%"}}color="#0fa35e"/>

    const prevBtnDisabled = () => {
        if (prevUrl['offset'] === 'None' ){
            return true
        }

        return false
        
    }
    const nextBtnDisabled = () => {
        if (nextUrl['offset'] === 'None' ){
            return true
        }

        return false
        
    }

    
    const LoadMore = url => axios.get('/api/files', {
        params: {
            limit: url.limit,
            offset: url.offset
        }
    })
    .then(res => {
        // console.log(res)
        setPrevUrl({...res.data.prev_url});
        setNextUrl({...res.data.next_url});
        setImageList(res.data.result);
    })
    .catch(error => {
        //The interceptor of the hoc handles the exception
    })

    let images = []
    if(imageList.length === 0){
        images = <p>No images uploaded</p>
    }else{
        images = imageList.map((file, idx) => {
            return (
                <Images loader={loader} filename={file.file_name}  key={idx + 1}/>
            )
        })
    }

    return (
        <Fragment>
            {/* <Ouroboro color="#0fa35e" />
            <Roller color="#0fa35e" />
            <Spinner color="#0fa35e" />
            <Ring color="#0fa35e" />
            <Ripple color="#0fa35e" /> */}
            <div className={classes.ImageList}>
            {/* <h1>Uploaded Images</h1> */}
                {images}
            </div>
            <div className={classes.Pagination}>
            <AwesomeButton
                // cssModule={btnClass}
                type="primary"
                ripple
                disabled = {prevBtnDisabled()}
                onPress={() => {
                    LoadMore(prevUrl);
                }}
                >
                Previous
            </AwesomeButton>
            <AwesomeButton
                // cssModule={btnClass}
                type="secondary"
                ripple
                disabled = {nextBtnDisabled()}
                onPress={() => {
                    LoadMore(nextUrl);
                }}
                >
                Next
            </AwesomeButton>
            </div>
        </Fragment>
     

        
    )
}

export default ImageList