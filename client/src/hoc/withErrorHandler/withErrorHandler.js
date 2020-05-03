import React, {Component, Fragment} from 'react'
import Modal from '../../components/UI/Modal/Modal'

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {

        state = {
            error: null
        }

        componentWillMount() {

            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null})
                return req
            })

            this.respInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error})
            })
        }

        componentWillUnmount() {
            // console.log('[withErrorHandler.js] will unmount!', this.reqInterceptor, this.respInterceptor)
            // Remove interceptors from unmounted components
            // to prevent potential memory leaks
            axios.interceptors.request.eject(this.reqInterceptor)
            axios.interceptors.response.eject(this.respInterceptor)
        }

        errorConfirmedHandler = () => {
            this.setState({error: null})
        }

        render() {
            return (
                <Fragment>
                    {/* Distribute any props the wrappedComponent may receive */}
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Fragment>
            )
        }
    }
}

export default withErrorHandler