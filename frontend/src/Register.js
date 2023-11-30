import React, { useState } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword , setRepeatPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      // Check if repeatPassword is equal to password
      if (repeatPassword !== password) {
        setError('Passwords do not match');
        return;
      }


   
      // Assuming your backend API endpoint for registration is at http://localhost:1313/register
      const response = await axios.post('http://localhost:1313/register', {
        email,
        password,
        username
      }, { withCredentials: true });
  
      // Handle the response as needed (e.g., set authentication token, redirect to dashboard)
      console.log('Registration successful', response.data);
      navigate('/')
    } catch (err) {
      // Handle registration failure (e.g., show error message)
      console.error('Registration failed', err);
  
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    }
  };
  

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={6} className="mx-auto" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' , backgroundColor: 'grey'}}>
          <h2 className="text-center mb-4">Register</h2>
          <Form className="text-center">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
              className="text-center"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
              className="text-center"
                type="text"
                
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
              className="text-center"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Repeat password</Form.Label>
              <Form.Control
              className="text-center"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </Form.Group>
            {error && <p className="text-danger">{error}</p>}
            <Button variant="primary" onClick={handleRegister}>
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;