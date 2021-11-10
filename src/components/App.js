// import './App.css';
import { Container } from "react-bootstrap"
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { useState } from "react";

import Login from './Login';
import Signup from "./Signup";
import FileUpload from "./FileUpload";

import {LoginContext} from "../Contexts/LoginContext"

function App() {

  const [USERNAME, setUSERNAME] = useState("");

  return (
    <div className="App">
      <Container
      className="d-flex justify-content-center"
      style={{ minHeight: "100vh" }}
      >
        <Router>
          <div className="w-100">
              <LoginContext.Provider value={{USERNAME, setUSERNAME}}>
              <Route exact path="/"><Login /></Route>   
              <Route exact path="/signup"> <Signup />  </Route>   
              <Route exact path="/upload">
                <Link to='/' style={{color:"violet"}} className="d-flex justify-content-end mt-2">Logout</Link>
                <h4 className='display-4 text-center mt-4'>
                <i className='fab fa-cloud' />Azure Cloud
                </h4> 
                <FileUpload />  
              </Route>
              </ LoginContext.Provider>
            
            
            
          </div>
        </ Router>
      </Container>
      
    </div>
  );
}

export default App;