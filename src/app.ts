import { fastify } from 'fastify';
import { fastifyJwt } from '@fastify/jwt';
import { authRoutes, usersRoutes } from './routes';
import { env } from './env';

export const app = fastify();

app.register(fastifyJwt, { secret: env.FASTIFY_JWT_SECRET });

app.register(usersRoutes, { prefix: 'users' });
app.register(authRoutes, { prefix: 'auth' });
