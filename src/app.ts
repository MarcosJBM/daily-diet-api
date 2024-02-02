import { fastifyJwt } from '@fastify/jwt';
import { fastify } from 'fastify';

import { mealsRoutes, usersRoutes } from '@/routes';

import { env } from './env';

export const app = fastify();

app.register(fastifyJwt, { secret: env.FASTIFY_JWT_SECRET });

app.register(usersRoutes, { prefix: 'users' });
app.register(mealsRoutes, { prefix: 'meals' });
