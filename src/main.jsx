// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { store, persistor } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>

      <App />
            </PersistGate>

    </Provider>
  </StrictMode>,
);