import React, { useState } from "react"
import axios from 'axios';
import logo from './logo.svg';
import './App.css';



function App() {
    
  const [files, setFiles] = useState(null);

  const fetchData = async () => {
    
        axios.get('http://localhost:5000/api/files', {
          
        })
        .then(function (response) {
          console.log(response);
          setFiles(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          // always executed
        });  
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button className="fetch-button" onClick={fetchData}>
          Fetch Data
        </button>

        {files ? <span>cool</span> : <span>no files</span>}
   
        
        <hr />
      </header>
    </div>
  );
}

export default App;
