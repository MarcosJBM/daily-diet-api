import { execSync } from 'node:child_process';

import supertest from 'supertest';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { createAndAuthenticateUser } from '@/utils';

import { app } from '../src/app';

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    execSync('npm run knex migrate:latest');
  });

  afterEach(async () => {
    execSync('npm run knex migrate:rollback --all');
  });

  it('should be able to create a new user', async () => {
    const response = await supertest(app.server).post('/users/register').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'abc123',
    });

    expect(response.status).toEqual(201);
  });

  it('should be able to log in', async () => {
    await supertest(app.server).post('/users/register').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'abc123',
    });

    const response = await supertest(app.server)
      .post('/users/authenticate')
      .send({ email: 'johndoe@gmail.com', password: 'abc123' });

    expect(response.status).toEqual(200);
  });

  it('should be able to get user metrics', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await supertest(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Café da manhã',
        description: 'Suco de laranja e panquecas',
        date: '2023-01-01',
        hour: '07:00',
        is_on_diet: true,
      });

    await supertest(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Almoço',
        description: 'Comida caseira',
        date: '2023-01-01',
        hour: '12:00',
        is_on_diet: true,
      });

    await supertest(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Lanche da tarde',
        description: 'Coca-cola lata e pastel de frango',
        date: '2023-01-01',
        hour: '16:00',
        is_on_diet: false,
      });

    const response = await supertest(app.server)
      .get('/users/me/metrics')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.metrics).toEqual(
      expect.objectContaining({
        registered_meals: 3,
        best_sequence: 2,
        current_sequence: 0,
        off_the_diet: 1,
        within_the_diet: 2,
      }),
    );
  });
});
