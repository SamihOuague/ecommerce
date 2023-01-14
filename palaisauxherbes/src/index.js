import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Checkout } from "./app/checkout/Checkout";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="*" element={<App />}/>
        <Route path="/checkout" element={<Checkout/>}/>
      </Routes>
    </Provider>
  </BrowserRouter>
);
