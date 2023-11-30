import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';



const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:1313/forgot-password', { email });

      // Si la demande est réussie, afficher le message de succès à l'utilisateur
      setSuccessMessage(response.data.message);
      setError(null);
    } catch (error) {
      // En cas d'erreur, afficher le message d'erreur à l'utilisateur
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('Erreur inattendue');
      }
      setSuccessMessage(null);
    }
  };

  return (
   
<div>

<Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh'}}>
      <Row className="w-100">
        <Col  md={6} className="mx-auto" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' , backgroundColor: 'grey'}}>
          <h2 className="text-center mb-4">Password reset</h2>
          <Form className="text-center" onSubmit={handleSubmit}>
            <Form.Group className="mb-3 text-center">
              <Form.Label>Email</Form.Label>
              <Form.Control
              className="text-center"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>
        
            {error && <p className="text-danger">{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <Button variant="primary"  >
              Send
            </Button>
          </Form>
          <p className="mt-3 text-center" >
            Missing password? 
          </p>
          
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default ForgotPassword;
