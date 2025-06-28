// src/redux/middleware/index.js
import { thunk } from 'redux-thunk';
import apiMiddleware from './apiMiddleware'; // Just imports the middleware function itself

const middleware = [
  thunk,
  apiMiddleware, // Your custom API middleware is listed here
];

export default middleware;