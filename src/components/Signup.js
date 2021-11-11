import React, { useState } from "react"
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { useHistory, Link } from 'react-router-dom'
import Axios from 'axios'

const serverURL = 'http://localhost:3001/registration';

export default function Signup() {

    const history = useHistory();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [phonenumber, setPhonenumber] = useState(0);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [signupError, setSignupError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log("yo!", email, username, phonenumber);
        if (password !== passwordConfirm) {
          window.alert("passwords dont match!")
        }
        else{
          Axios.post(serverURL , {
            email: email,
            username: username,
            password: password,
            phonenumber: phonenumber
          }).then((res) => {
            setSignupError(res.data.error);
            if (res.data.signup) {
              history.push('/')
            }
          }).catch((err) => {
            console.log(err);
            setSignupError(err);
          })
        }
        
    }
    

    return (
        <>
          <div className='d-flex flex-column justify-content-center'>
            <Row><Col>
            <Card  style={{ maxWidth: "400px", marginLeft: "auto", marginRight: "auto", marginTop: "150px"}}>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              {signupError && <Alert variant="danger">{signupError}</Alert>}
              <Form>
              {/* onClick={addEmployee} */}
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" onChange={(event) => setEmail(event.target.value)} required />
                </Form.Group>
    
                <Form.Group id="username" className="mt-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" onChange={(event) => setUsername(event.target.value.toLowerCase())} required />
                </Form.Group>
    
                <Form.Group id="phonenumber" className="mt-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="text" onChange={(event) => setPhonenumber(event.target.value)} required />
                </Form.Group>
    
                <Form.Group id="password" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" onChange={(event) => setPassword(event.target.value)} required />
                </Form.Group>
    
                <Form.Group id="password-confirm" className="mt-3">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control type="password" onChange={(event) => setPasswordConfirm(event.target.value)} required />
                </Form.Group>
    
    
                <Button /*disabled={loading}*/ className="w-100 mt-4" type="submit" onClick={handleSubmit}>
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          </ Col></ Row>
          <div className="w-100 text-center mt-2">
             Already have an account? <Link to='/' > Log In </ Link> { /*<Link to="/login">Log In</Link> */}
          </div>
          </div>
        </>
      )

}