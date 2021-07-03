
import axios from 'axios'

// docker-toolbox
// const instance = axios.create({
//     baseURL: 'http://192.168.99.100:5000/'
// })

// localhost
const instance = axios.create({
    baseURL: '0.0.0.0:5000/'
})

export default instance