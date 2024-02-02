import { randomUUID } from 'node:crypto';

import { genSaltSync, hashSync } from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { knexInstance } from '@/database';
import { createUserMetrics, validateSchema } from '@/utils';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
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

  const bodySchemaResult = validateSchema(request.body, bodySchema);

  if (typeof bodySchemaResult === 'string')
    return reply.status(400).send({ error: bodySchemaResult });

  const { email, name, password } = bodySchemaResult;

  const existingUser = await knexInstance('users').where({ email }).first();

  if (existingUser)
    return reply.status(400).send({ error: 'E-mail already in use.' });

  const salt = genSaltSync();

  const hash = hashSync(password, salt);

  const user = { id: randomUUID(), name, email, hash, salt };

  await knexInstance('users').insert(user);

  await createUserMetrics(user.id);

  return reply.status(201).send();
}
