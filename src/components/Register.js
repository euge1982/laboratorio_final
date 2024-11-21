// Archivo del componente Register

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';  // Importamos InputText de PrimeReact
import { Password } from 'primereact/password';  // Importamos Password de PrimeReact
import { Button } from 'primereact/button';      // Importamos Button de PrimeReact
import { Message } from 'primereact/message';    // Para mostrar mensajes de error
import api from '../api/axios'; // Instancia de axios
import '../css/register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    contraseña2: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const { nombre, correo, contraseña, contraseña2 } = formData;

  // Manejador de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejador del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (contraseña !== contraseña2) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await api.post('/users/register', { nombre, correo, contraseña });
      
      // Registro exitoso, redirigir al login o a la página principal
      if (response.status === 201) {
        navigate('/login');
      }
    } 
    catch (error) {
      setErrorMessage(error.response?.data?.message || 'Hubo un error al registrar el usuario.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <h2 className="auth-title">Registro</h2>
        <form onSubmit={handleSubmit} className="auth-form">

          <div className="input-group">
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              required
              className="p-inputtext p-component"
            />
          </div>

          <div className="input-group">
            <label htmlFor="correo">Correo electrónico</label>
            <InputText
              id="correo"
              name="correo"
              value={correo}
              onChange={handleChange}
              placeholder="Ingresa tu correo electrónico"
              required
              className="p-inputtext p-component"
            />
          </div>

          <div className="input-group">
            <label htmlFor="contraseña">Contraseña</label>
            <Password
              id="contraseña"
              name="contraseña"
              value={contraseña}
              onChange={handleChange}
              feedback={false}
              placeholder="Ingresa tu contraseña"
              required
              className="p-password p-component"
            />
          </div>

          <div className="input-group">
            <label htmlFor="contraseña2">Confirmar contraseña</label>
            <Password
              id="contraseña2"
              name="contraseña2"
              value={contraseña2}
              onChange={handleChange}
              feedback={false}
              placeholder="Confirma tu contraseña"
              required
              className="p-password p-component"
            />
          </div>

          {errorMessage && (
            <Message severity="error" text={errorMessage} />
          )}

          <Button type="submit" label="Registrar" className="auth-button" />
        </form>
      </div>
    </div>
  );
};

export default Register;