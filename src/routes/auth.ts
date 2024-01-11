import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { validateSchema } from '@/utils';
import { knexInstance } from '@/database';
import { compare } from 'bcrypt';

const loginBodySchema = z.object({
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

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const result = validateSchema(request.body, loginBodySchema);

    if (typeof result === 'string')
      return reply.status(400).send({ error: result });

    const { email, password } = result;

    const user = await knexInstance('users').where({ email }).first();

    if (!user) return reply.status(400).send({ error: 'User not found' });

    const isPasswordCorrect = await compare(password, user.hash);

    if (!isPasswordCorrect)
      return reply.status(400).send({ error: 'Invalid password' });

    const token = app.jwt.sign(
      { id: user.id, name: user.name, email },
      { expiresIn: '7d' }
    );

    return reply.status(200).send({ token });
  });
}
