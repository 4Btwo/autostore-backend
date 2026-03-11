// src/middlewares/error.middleware.js

import { errorResponse } from '../utils/response.js';

export default function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message =
    error.message || 'Erro interno do servidor';

  return errorResponse(res, message, code, statusCode);
}