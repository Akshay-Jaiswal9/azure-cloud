import React, { useState, useContext } from 'react'
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { Link, useHistory } from 'react-router-dom'
import Axios from 'axios'
import { LoginContext } from '../Contexts/LoginContext'

// const navigate = useNavigate();



const serverURL = 'http://localhost:3001/login';


function Login() {
  const {USERNAME, setUSERNAME} = useContext(LoginContext);
  const history = useHistory();
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  

  const HandleSubmit = (event) => {
    event.preventDefault();
    // let navigate = useNavigate();
    // const n1 = () =>{navigate('signup')}

      Axios.post(serverURL , {
        username: username,
        password: password,
      }).then((res) => {
        // setLoginError(res.data.error);
        if (res.data.login) {
          setUSERNAME(username)
          // console.log(username);
          // console.log(USERNAME);
          history.push('/upload')
        }
      }).catch((err) => {
        console.log(err);
        // setUSERNAME("");
        setLoginError(err);
      })
  }

    return (
        <>
          <div className='d-flex flex-column justify-content-center'>
            <Row><Col>
            <Card  style={{ maxWidth: "400px", marginLeft: "auto", marginRight: "auto", marginTop: "9.375rem" }}>
              <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
                {loginError && <Alert variant="danger">{loginError}</Alert>}
                <Form onSubmit={HandleSubmit}>

                  <Form.Group id="email">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" onChange={(event) => setUsername(event.target.value.toLowerCase())} required />
                  </Form.Group>

                  <Form.Group id="password" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={(event) => setPassword(event.target.value)} required />
                  </Form.Group>

                  <Button className="w-100 mt-4" type="submit">
                    Log In
                  </Button>

                </Form>
                <div className="w-100 text-center mt-3 text-secondary ">
                  Forgot Password?
                </div>
              </Card.Body>
            </Card>
            </ Col></ Row>
            <div className="w-100 text-center mt-2">
              Need an account? <Link to='/signup' >Sign Up</ Link>
            </div>
          </div>
        </>
      )
}

export default Login
