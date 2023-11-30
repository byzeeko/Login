import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:1313/login', {
        email,
        password,
      }, { withCredentials: true });

      console.log('Login successful', response.data);
      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
      setError('Invalid email or password');
    }
  };

  return (
<Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh'}}>
      <Row className="w-100">
        <Col  md={6} className="mx-auto" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' , backgroundColor: 'grey'}}>
          <h2 className="text-center mb-4">Login</h2>
          <Form className="text-center">
            <Form.Group className="mb-3 text-center">
              <Form.Label>Email</Form.Label>
              <Form.Control
              className="text-center"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 text-center">
              <Form.Label  >Password</Form.Label>
              <Form.Control
              className="text-center"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {error && <p className="text-danger">{error}</p>}
            <Button variant="primary" onClick={handleLogin}>
              Login
            </Button>
          </Form>
          <p className="mt-3 text-center" >
            Missing password? 
          </p>
          <p className="mt-3 text-center" >
            Click <Link to="/forgot_password">here</Link>.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
