import { fastify } from 'fastify';
import { usersRoutes } from './routes';

export const app = fastify();

app.register(usersRoutes, { prefix: 'users' });
