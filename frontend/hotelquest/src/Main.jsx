import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css'; // Assuming you have a global CSS file
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);