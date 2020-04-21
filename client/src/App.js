import React from "react"
import { Route, Switch, withRouter, Redirect} from 'react-router-dom'

import './App.css';

import Layout from './containers/Layout/Layout'
import ImageUploader from "./components/ImageUploader/ImageUploader";




function App() {
    
  let routes = (
    <Switch>
      <Route path="/upload" exact component={() => <ImageUploader withPreview/>} />
      <Redirect to="/"/>
    </Switch>
  )

  // const fetchData = async () => {
    
  //       axios.get('http://localhost:5000/api/files', {
          
  //       })
  //       .then(function (response) {
  //         console.log(response);
  //         setFiles(response.data)
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       })
  //       .then(function () {
  //         // always executed
  //       });  
  // }

  return (
    <div>
      <Layout>
          {routes}
      </Layout>
    </div>
  );
}

export default withRouter(App);
