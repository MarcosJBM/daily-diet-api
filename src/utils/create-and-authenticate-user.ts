import { FastifyInstance } from 'fastify';
import supertest from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await supertest(app.server).post('/users/create').send({
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'abc123',
  });

  const response = await supertest(app.server)
    .post('/auth/login')
    .send({ email: 'johndoe@gmail.com', password: 'abc123' });

  const { token } = response.body;

  return { token };
}
