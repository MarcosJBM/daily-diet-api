import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/plugins';

import { authenticate } from './authenticate';
import { metrics } from './metrics';
import { register } from './register';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', register);
  app.post('/authenticate', authenticate);

  app.get('/me/metrics', { onRequest: [verifyJwt] }, metrics);
}
