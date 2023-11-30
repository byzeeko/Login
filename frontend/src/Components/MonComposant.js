
import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect  } from 'react';
import { Container, Row, Col,                                   } from 'react-bootstrap';


function MonComposant() {
    const { token } = useParams();
    const [resetMessage, setResetMessage] = useState('');
  
    useEffect(() => {
      // Effectuer une requête pour réinitialiser le mot de passe
      axios.post(`http://localhost:1313/reset-password?token=${token}`, { })
        .then(response => {
          setResetMessage(response.data.message);
        })
        .catch(error => {
          console.error('Erreur lors de la réinitialisation du mot de passe :', error);
          setResetMessage('Erreur lors de la réinitialisation du mot de passe.');
        });
    }, [token]);
  
    return (
      <div>
  
    

        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh'}}>
      <Row className="w-100">
        <Col  md={6} className="mx-auto" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' , backgroundColor: 'grey'}}>
          <h2 className="text-center mb-4">Réinitialisation du mot de passe</h2>
          <p className="text-center"> {resetMessage}</p>
        </Col>
        </Row>
        </Container>
      </div>
    );
  };
  
  export default MonComposant;