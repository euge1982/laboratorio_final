//Archivo del componente PrivateRoute

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import Cookies from 'js-cookie';


const PrivateRoute = ({ element }) => {
    const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado para manejar la carga y autenticación

  useEffect(() => {
    // Verificamos si el token existe en las cookies
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true); // Si el token existe, el usuario está autenticado
    } else {
      setIsAuthenticated(false); // Si no hay token, redirigir al login
    }
  }, []);

  if (isAuthenticated === null) {
    // Si aún estamos verificando el estado del token, mostramos un spinner
    return <Spinner />;
  }

  if (!isAuthenticated) {
    // Si no hay token, redirigir al login
    return navigate("/login");
  }

  // Si el token es válido, permitimos que la ruta se cargue
  return element;
};

export default PrivateRoute;