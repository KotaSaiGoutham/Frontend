// src/redux/store.js (or wherever your store is configured)

import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk'; // Assuming you are using Redux Thunk
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This defaults to localStorage for web
import rootReducer from './rootReducer';
import apiMiddleware from './middleware/apiMiddleware'; // Your custom API middleware
import { resetLoadingState } from './actions';
// 1. Configuration for redux-persist
const persistConfig = {
  key: 'root', // The key for the localStorage entry (e.g., 'root' or 'myAppName')
  storage,    // Which storage to use (localStorage is 'storage', sessionStorage is 'storageSession')
  whitelist: ['auth', 'classes'], // These are the reducers whose states will be saved

};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [thunk, apiMiddleware];

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

export const persistor = persistStore(store, null, () => {
  // This callback is executed after the store has been rehydrated
  store.dispatch(resetLoadingState());
});
