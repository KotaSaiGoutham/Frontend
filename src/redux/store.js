// src/redux/store.js (or wherever your store is configured)

import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk'; // Assuming you are using Redux Thunk
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This defaults to localStorage for web
import rootReducer from './rootReducer';
// Import your combined reducers
import apiMiddleware from './middleware/apiMiddleware'; // Your custom API middleware

// 1. Configuration for redux-persist
const persistConfig = {
  key: 'root', // The key for the localStorage entry (e.g., 'root' or 'myAppName')
  storage,    // Which storage to use (localStorage is 'storage', sessionStorage is 'storageSession')
  // Specify which parts of your Redux state you want to persist.
  // It's generally better to whitelist (only save these) than blacklist (save all except these).
  whitelist: ['auth', 'classes'], // These are the reducers whose states will be saved
  // If you wanted to exclude parts of a specific reducer's state:
  // For example, if your 'auth' reducer has 'loading' and 'error' properties you don't want to save:
  // auth: {
  //   blacklist: ['loading', 'error']
  // }
  // Note: More granular control like the above often requires `createTransform` or using `createPersistoid`
  // For simplicity, whitelisting entire reducers is usually sufficient.
};

// 2. Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Setup Redux DevTools Extension (if you use it)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Configure your middleware
const middleware = [thunk, apiMiddleware];

// 3. Create the Redux store with the persisted reducer
export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

// 4. Create a persistor
export const persistor = persistStore(store);

// Optional: To clear persisted state during development (e.g., if schema changes)
// persistor.purge();