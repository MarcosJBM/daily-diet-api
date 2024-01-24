import { genSaltSync, hashSync } from 'bcrypt';
import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knexInstance } from '@/database';
import { validateSchema } from '@/utils';

const createUserBodySchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name has an invalid type',
      required_error: 'Name is required',
    })
    .min(1, 'Name is required')
    .max(36, 'Name must have a maximum of 36 characters'),
  email: z
    .string({
      invalid_type_error: 'Email has an invalid type',
      required_error: 'Email is required',
    })
    .min(1, 'Email is required')
    .email('Email must be valid'),
  password: z
    .string({
      invalid_type_error: 'Password has an invalid type',
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export async function usersRoutes(app: FastifyInstance) {
  app.post('/create', async (request, reply) => {
    const result = validateSchema(request.body, createUserBodySchema);

    if (typeof result === 'string')
      return reply.status(400).send({ error: result });

    const { email, name, password } = result;

    const existingUser = await knexInstance('users').where({ email }).first();

    if (existingUser)
      return reply.status(400).send({ error: 'E-mail already in use' });

    const salt = genSaltSync();

    const hash = hashSync(password, salt);

    const user = { id: randomUUID(), name, email, hash, salt };

    await knexInstance('users').insert(user);

    return reply.status(201).send();
  });
}
