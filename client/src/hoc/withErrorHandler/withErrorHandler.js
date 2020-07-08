import React, {Component, Fragment} from 'react'
import Modal from '../../components/UI/Modal/Modal'

import { toast } from 'react-toastify';
import '../../components/UI/toastify.modules.scss'
// import { css } from 'glamor';


const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {

        executeToastError = (errorMsg) => {
            toast.error("🦄  " + errorMsg,
                {
                    autoClose: 2000,
                    // progressClassName: css({
                    //     background: "repeating-radial-gradient(red, yellow 10%, green 15%)"
                    //   }),
                    position: toast.POSITION.BOTTOM_RIGHT,
                    bodyClassName: 'toastify-body'
            })
        }

        executeToastSuccess = (successMsg) => {
            toast.success("🚀  " + successMsg,
                {
                    autoClose: 2000,
                    // progressClassName: css({
                    //     background: "repeating-radial-gradient(red, yellow 10%, green 15%)"
                    //   }),
                    position: toast.POSITION.BOTTOM_RIGHT,
                    className: 'green-toast',
                    bodyClassName: 'toast-body'
            })
        }

        executeToastError = (errorMsg) => {
            toast.error("🦄  " + errorMsg,
                {
                    autoClose: 2500,
                    // progressClassName: css({
                    //     background: "repeating-radial-gradient(red, yellow 10%, green 15%)"
                    //   }),
                    position: toast.POSITION.BOTTOM_RIGHT,
                    bodyClassName: 'toast-body'
            })
        }

        componentDidMount() {

            this.reqInterceptor = axios.interceptors.request.use(req => {
                return req
            })

            this.respInterceptor = axios.interceptors.response.use(res => {
                if(res.data.msg)
                    this.executeToastSuccess(res.data.msg)
                return res;
            }, error => {
                this.executeToastError(error.response.data.error)
                return Promise.reject(error);
            })
            
        }

        componentWillUnmount() {
            // console.log('[withErrorHandler.js] will unmount!', this.reqInterceptor, this.respInterceptor)
            // Remove interceptors from unmounted components
            // to prevent potential memory leaks
            axios.interceptors.request.eject(this.reqInterceptor)
            axios.interceptors.response.eject(this.respInterceptor)
        }


        
        render() {
            return (
                <WrappedComponent {...this.props} />
            )
        }
    };
}

export default withErrorHandler