import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Components/Login';
import NavbarGlobal from './Components/Navbar';
import Dashboard from './Dashboard';
import { AuthProvider } from './AuthContext'; // Importez le fournisseur de contexte
import 'bootstrap/dist/css/bootstrap.min.css';
import MonComposant from './Components/MonComposant';
import ForgotPassword from './Components/ForgotPassword';

function App() {
  return (
    <Router>
      <AuthProvider> {/* Ajoutez le fournisseur de contexte ici */}
    <NavbarGlobal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/test/:token" element={<MonComposant />} />
          <Route path="/register/:token" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
       
      </AuthProvider>
    </Router>
  );
}

export default App;
