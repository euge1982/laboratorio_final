//Archivo del componente SessionExpired

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/sessionexpired.css'; 


const SessionExpired = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

  return (
    <div className="session-expired-container">
      <h2 className="session-expired-message">Tu sesión ha expirado.</h2>
      <p>Sino eres redirigido en 5 segundos, puedes hacer clic en el siguiente enlace.</p>
      <Link to="/login" className="session-expired-link">Inicia sesión de nuevo</Link>
    </div>
  );
};

export default SessionExpired;

