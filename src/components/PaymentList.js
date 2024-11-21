//Archivo del componente PaymentList, que tiene las acciones de los pagos
//Actualizar un pago solo se puede hacer desde ver pagos, porque se pueden actualizar
//los pagos que existen

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import api from '../api/axios';
import '../css/paymentList.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [newPayment, setNewPayment] = useState({
    fechaPago: null,
    monto: '',
    formaPago: '',
    descripcion: '',
  });

  const [paymentToEdit, setPaymentToEdit] = useState(null);   //Estado para manejar el pago a editar
  const [loading, setLoading] = useState(false);   //Estado para manejar el momento de la carga
  const [error, setError] = useState(null);          //Estado para manejar el error

  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    // Elimina el token o datos de sesión (según cómo lo manejes)
    Cookies.remove('authToken');
    // Redirige al home
    navigate('/');
  };

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await api.get('/payments');
        setPayments(response.data);
        setError('');
      } 
      catch (error) {
        setError('Error al obtener los pagos');
        console.error('Error fetching payments:', error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const deletePayment = async (id, userId) => {
    setLoading(true);
    try {
      await api.delete(`/payments/${id}`);
      setPayments(payments.filter((payment) => payment.id !== id));
    } 
    catch (error) {
      setError('Error al eliminar el pago');
      console.error('Error deleting payment:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id, updatedPayment) => {
    setLoading(true);
    try {
      console.log('paymentToEdit:', updatedPayment);
      await api.patch(`/payments/${id}`, updatedPayment);
      setPayments(payments.map((payment) => (payment.id === id ? { ...payment, ...updatedPayment } : payment)));
      setSelectedAction(null);   // Volver a las cards luego de actualizar el pago
      setPaymentToEdit(null);
      setError('');
    } 
    catch (error) {
      setError('Error al actualizar el pago');
      console.error('Error updating payment:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const addPayment = async () => {
    setLoading(true);
    try {
      console.log('newPayment:', newPayment);
      const response = await api.post('/payments', newPayment);
      setPayments([...payments, response.data]);
      setSelectedAction(null); // Volver a las cards después de agregar el pago
      setNewPayment({ fechaPago: null, monto: '', formaPago: '', descripcion: '' }); // Resetear el formulario
      setError(''); 
    } 
    catch (error) {
      setError('Error al agregar el pago');
      console.error('Error adding payment:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { label: 'Tarjeta', value: 'Tarjeta' },
    { label: 'Efectivo', value: 'Efectivo' },
    { label: 'Transferencia', value: 'Transferencia' },
  ];

  return (
    <div className="payment-list-container">
      <h2 className="page-title">Gestión de Pagos</h2>

      {error && <p className='error-message'>{error}</p>}   

      {loading && <div className="loading-message">Cargando...</div>}   

      {selectedAction === null ? (
        <div className="action-buttons">

          <Card title="Agregar Pago" className="action-card">
            <p>Crear un nuevo pago.</p>
            <Button 
              label="Agregar" 
              icon="pi pi-plus" 
              onClick={() => setSelectedAction('add')} 
              className="p-button-rounded p-button-success" 
            />
          </Card>

          <Card title="Ver Pagos" className="action-card">
            <p>Ver la lista de pagos.</p>
            <Button 
              label="Ver" 
              icon="pi pi-eye" 
              onClick={() => setSelectedAction('view')} 
              className="p-button-rounded p-button-info" 
            />
          </Card>
         
          <Card title="Eliminar Pago" className="action-card">
            <p>Eliminar un pago existente.</p>
            <Button label="Eliminar" icon="pi pi-trash" onClick={() => setSelectedAction('delete')} className="p-button-rounded p-button-danger" />
          </Card>
        </div>

      ) : selectedAction === 'view' ? (
        <div> 
          <div className="data-table-container">
            <DataTable value={payments} className="p-datatable-striped">
              <Column 
                field="fechaPago" 
                header="Fecha de Pago"
                body={(rowData) => rowData.fechaPago ? new Date(rowData.fechaPago).toLocaleDateString() : ''} 
              />
              <Column field="monto" header="Monto" />
              <Column field="formaPago" header="Forma de Pago" />
              <Column field="descripcion" header="Descripción" />
              <Column
                header="Acciones"
                body={(rowData) => (
                  <div className='botones'>
                    <Button 
                      label="Eliminar" 
                      icon="pi pi-trash" 
                      onClick={() => deletePayment(rowData.id)}
                      className="p-button-rounded p-button-danger" 
                    />
                    <Button 
                      label="Actualizar" 
                      icon="pi pi-pencil" 
                      onClick={() => { setSelectedAction('edit'); setPaymentToEdit(rowData); }}
                      className="p-button-rounded p-button-warning" 
                    />
                  </div>
                )}
              />
            </DataTable>
          </div>
          <Button 
            label="Volver" 
            icon="pi pi-arrow-left" 
            onClick={() => setSelectedAction(null)} 
            className="p-button-rounded p-button-secondary" 
            style={{ marginTop: '30px' }} 
          />
        </div>
      ) : selectedAction === 'add' ? (
        <div className='add-payment-form'>
          <div className="payment-container">
            <h3>Agregar Nuevo Pago</h3>
            <div className="p-fluid">
              <div className="p-field input-container">
                <label htmlFor="fechaPago">Fecha de Pago</label>
                <Calendar 
                  id="fechaPago" 
                  value={newPayment.fechaPago} 
                  onChange={(e) => setNewPayment({ ...newPayment, fechaPago: e.value })}
                  showIcon
                />
              </div>
              <div className="p-field">
                <label htmlFor="monto">Monto</label>
                <InputNumber 
                  id="monto" 
                  value={newPayment.monto} 
                  onValueChange={(e) => setNewPayment({ ...newPayment, monto: e.value })} 
                  mode="currency" currency="USD" 
                />
              </div>
              <div className="p-field">
                <label htmlFor="formaPago">Forma de Pago</label>
                <Dropdown 
                  id="formaPago" 
                  value={newPayment.formaPago} 
                  options={paymentMethods} 
                  onChange={(e) => setNewPayment({ ...newPayment, formaPago: e.value })} 
                  placeholder="Selecciona un método" 
                />
              </div>
              <div className="p-field">
                <label htmlFor="descripcion">Descripción</label>
                <InputText 
                  id="descripcion" 
                  value={newPayment.descripcion} 
                  onChange={(e) => setNewPayment({ ...newPayment, descripcion: e.target.value })} 
                />
              </div>
              <Button 
                label="Agregar Pago" 
                icon="pi pi-check" 
                onClick={addPayment} 
                className="p-button-rounded p-button-success" 
              />
            </div>
          </div>
          <Button 
            label="Volver" 
            icon="pi pi-arrow-left" 
            onClick={() => setSelectedAction(null)} 
            className="p-button-rounded p-button-secondary" 
            style={{ marginTop: '30px' }} 
          />
        </div>
      ) : selectedAction === 'edit' && paymentToEdit ? (
        <div className='add-payment-form'>
          <div className="payment-container">
            <Button label="Volver" 
              icon="pi pi-arrow-left" 
              onClick={() => setSelectedAction(null)} 
              className="p-button-rounded p-button-secondary" 
              style={{ marginBottom: '20px' }} 
            />
            <h3>Actualizar Pago</h3>
            <div className="p-fluid">
              <div className="p-field">
                <label htmlFor="fechaPago">Fecha de Pago</label>
                <Calendar 
                  id="fechaPago" 
                  value={paymentToEdit.fechaPago ? new Date(paymentToEdit.fechaPago) : null} 
                  onChange={(e) => setPaymentToEdit({ ...paymentToEdit, fechaPago: e.value })} 
                  showIcon 
                />
              </div>
              <div className="p-field">
                <label htmlFor="monto">Monto</label>
                <InputNumber 
                  id="monto" 
                  value={paymentToEdit.monto} 
                  onValueChange={(e) => setPaymentToEdit({ ...paymentToEdit, monto: e.value })} 
                  mode="currency" currency="USD" 
                />
              </div>
              <div className="p-field">
                <label htmlFor="formaPago">Forma de Pago</label>
                <Dropdown 
                  id="formaPago" 
                  value={paymentToEdit.formaPago} 
                  options={paymentMethods} onChange={(e) => setPaymentToEdit({ ...paymentToEdit, formaPago: e.value })} placeholder="Selecciona un método" 
                />
              </div>
              <div className="p-field">
                <label htmlFor="descripcion">Descripción</label>
                <InputText 
                  id="descripcion" 
                  value={paymentToEdit.descripcion} 
                  onChange={(e) => setPaymentToEdit({ ...paymentToEdit, descripcion: e.target.value })} 
                />
              </div>
              <Button 
                label="Actualizar Pago" 
                icon="pi pi-check" 
                onClick={() => updatePayment(paymentToEdit.id, paymentToEdit)} 
                className="p-button-rounded p-button-warning" 
              />
            </div>
          </div>
        </div>
      ) : null }

      <div className='espacio'></div>

      <Button 
        label="Cerrar sesión" 
        icon="pi pi-sign-out" 
        onClick={handleLogout} 
        className="p-button-rounded p-button-danger" 
      />
      
    </div>
  );
};

export default PaymentList;
  