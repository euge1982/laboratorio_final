//Archivo del componente Home

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';  
import '../css/home.css';  


const Home = () => {
  return (
    <div className="home-container">
      <div className="home-overlay">
        <h1 className="home-title">GuarderíaDePagos.com</h1>
        <p className="home-description">Gestiona tus pagos de forma fácil y segura.</p>
        <div className="home-actions">
          <Link to="/login">
            <Button label="Iniciar sesión" icon="pi pi-sign-in" className="p-button-success p-button-rounded" />
          </Link>
          <Link to="/register">
            <Button label="Registrarse" icon="pi pi-user-plus" className="p-button-primary p-button-rounded" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;