import { execSync } from 'node:child_process';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import supertest from 'supertest';
import { app } from '../src/app';

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to create a new user', async () => {
    await supertest(app.server)
      .post('/users/create')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '1mdas09k1p2j8f0aks42',
      })
      .expect(201);
  });
});
