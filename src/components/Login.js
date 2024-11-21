//Archivo del componente Login

import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Toast } from 'primereact/toast';
import Spinner from './Spinner';
import Cookies from 'js-cookie';
import '../css/login.css';


const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = React.useRef(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!correo || !contraseña) {
      setError('Por favor, ingresa tu correo y contraseña');
      return;
    }

    try {
      setLoading(true);   
      const response = await api.post('/users/login', { correo, contraseña });
      Cookies.set('token', response.data.token);
      navigate('/payments'); // Redirige a la página de pagos
    } 
    catch (error) {
      setError('Credenciales inválidas');
      toast.current?.show({ severity: 'error', summary: 'Error', 
        detail: 'Credenciales inválidas', life: 3000 });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <InputText 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
              placeholder="Correo"
              autoFocus
              className="p-inputtext p-component"
            />
          </div>
          <div className="input-group">
            <InputText 
              value={contraseña} 
              onChange={(e) => setContraseña(e.target.value)} 
              type="password" 
              placeholder="Contraseña"
              className="p-inputtext p-component"
            />
          </div>
          <Button 
            label={loading ? <Spinner /> : "Iniciar sesión"} 
            type="submit"
            disabled={loading} 
            className="login-button" />
        </form>

        <p className="register-link">
          ¿No tienes una cuenta? <a href="/register">Registrarse</a>
        </p>

        <Toast ref={toast} />

      </div>
    </div>
  );
};

export default Login;
