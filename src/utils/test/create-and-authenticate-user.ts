import { randomUUID } from 'node:crypto';

import { genSaltSync, hashSync } from 'bcrypt';
import { FastifyInstance } from 'fastify';
import supertest from 'supertest';

import { knexInstance } from '@/database';

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const salt = genSaltSync();

  const hash = hashSync('abc123', salt);

  const user = {
    id: randomUUID(),
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    hash,
    salt,
  };

  await knexInstance('users').insert(user);

  const authResponse = await supertest(app.server)
    .post('/auth/login')
    .send({ email: 'johndoe@gmail.com', password: 'abc123' });

  const { token } = authResponse.body;

  return { token };
}
