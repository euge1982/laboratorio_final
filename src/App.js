import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PaymentList from './components/PaymentList';
import Home from './components/Home';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import SessionExpired from './components/SesionExpired';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/payments" element={<PrivateRoute element={<PaymentList/>} />} />
        <Route path="/session-expired" element={<SessionExpired/>} />
      </Routes>
    </Router>
  );
};

export default App;
