import supertest from 'supertest';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { app } from '../src/app';
import { execSync } from 'child_process';

describe('Auth routes', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest');

    await app.ready();
  });

  afterAll(async () => {
    execSync('npm run knex migrate:rollback --all');

    await app.close();
  });

  it('should be able to log in', async () => {
    await supertest(app.server)
      .post('/users/create')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '1mdas09k1p2j8f0aks42',
      })
      .expect(201);

    await supertest(app.server)
      .post('/auth/login')
      .send({ email: 'johndoe@gmail.com', password: '1mdas09k1p2j8f0aks42' })
      .expect(200);
  });
});