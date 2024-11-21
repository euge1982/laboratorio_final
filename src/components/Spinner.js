// Archivo del componente Spinner

import React from 'react';
import  { ColorRing }  from 'react-loader-spinner'; // Importa el spinner de react-loader-spinner
import { Dialog } from 'primereact/dialog'; // Importa el Dialog de PrimeReact
import 'primeicons/primeicons.css'; // Estilos de PrimeIcons
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos básicos de PrimeReact


const Spinner = ({ visible }) => {
  return (
    <Dialog visible={visible} modal closable={false}>
      <div className="flex justify-content-center align-items-center">
        <ColorRing
          height={80}
          width={80}
          color="#007bff"
          ariaLabel="circle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={visible}
        />
      </div>
    </Dialog>
  );
};

export default Spinner;