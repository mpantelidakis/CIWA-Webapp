import React from "react"
import { Route, Switch, withRouter, Redirect} from 'react-router-dom'

import './App.scss';

import Layout from './containers/Layout/Layout'
import ImageUploader from "./components/ImageUploader/ImageUploader";
import About from "./components/About/About";

import asyncComponent from './hoc/asyncComponent/asyncComponent'
import Home from './components/Home/Home'


const asyncImageList = asyncComponent(() => {
  return import('./components/ImageList/ImageList')
})

const asyncControlPanel = asyncComponent(() => {
  return import('./components/ControlPanel/ControlPanel')
})



function App() {
    
  let routes = (
    <Switch>
      <Route path="/upload" component={() => <ImageUploader withPreview/>} />
      <Route path="/images/:imageName" component={asyncControlPanel}/>
      <Route path="/images" component={asyncImageList}/>
      <Route path="/about" component={About}/>
      <Route path="/" exact component={Home} />
      <Redirect to="/"/>
    </Switch>
  )
  return (
    <div>
      <Layout>
          {routes}
      </Layout>
    </div>
  );
}

export default withRouter(App);
