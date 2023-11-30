// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const checkToken = () => {
    const token = Cookies.get('token');
    const isValidToken = !!token; // Ajoutez ici la logique pour vérifier la validité du token

    setIsAuthenticated(isValidToken);

    if (isValidToken) {
      const decodedToken = jwtDecode(token);
      setUserData({
        id: decodedToken.id,
        username: decodedToken.username,
        createdAt: decodedToken.createdAt,
        email: decodedToken.email,
        role: decodedToken.role,
      });
      console.log('L\'utilisateur a un token valide.');
      // Vous pouvez également ajouter des informations supplémentaires ici si nécessaire.
    } else {
      console.log("pas de token valide")
    }
  };


  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:1313/refreshAccessToken', {}, {
        withCredentials: true, // Pour envoyer les cookies avec la requête
      });

      // Gérer la réponse de la requête ici
      console.log(response.data);
    } catch (error) {
      // Gérer les erreurs ici
      console.error(error);
    }
  };

  useEffect(() => {
    // Vérifiez le token lors de la création du contexte
    checkToken();
  
    // Vérifiez le token toutes les 5 secondes
    const interval = setInterval(() => {
      checkToken();
  
      // Vérifiez s'il y a un cookie avec le refresh token avant d'appeler refreshToken
      const hasRefreshToken = !!Cookies.get('refreshToken');
      if (hasRefreshToken) {
        refreshToken();
      } else {
        console.log('Pas de cookie avec un refresh token. Ne tentez pas de rafraîchir le token.');
      }
    }, 5000);
  
    // Nettoyez l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []);

  const value = {
    isAuthenticated,
    userData,
    checkToken,
    refreshToken,
    // Ajoutez d'autres fonctions ou données nécessaires
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};