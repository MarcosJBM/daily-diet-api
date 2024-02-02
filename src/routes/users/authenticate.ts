import { compare } from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { app } from '@/app';
import { knexInstance } from '@/database';
import { validateSchema } from '@/utils';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
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

  const result = validateSchema(request.body, bodySchema);

  if (typeof result === 'string')
    return reply.status(400).send({ error: result });

  const { email, password } = result;

  const user = await knexInstance('users').where({ email }).first();

  if (!user) return reply.status(400).send({ error: 'User not found.' });

  const isPasswordCorrect = await compare(password, user.hash);

  if (!isPasswordCorrect)
    return reply.status(400).send({ error: 'Invalid password.' });

  const token = app.jwt.sign(
    { id: user.id, name: user.name, email },
    { expiresIn: '7d' },
  );

  return reply.status(200).send({ token });
}
