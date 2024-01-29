import { execSync } from 'node:child_process';

import supertest from 'supertest';
import { afterAll, beforeAll, describe, it } from 'vitest';

import { app } from '../src/app';

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
        password: 'abc123',
      })
      .expect(201);

    await supertest(app.server)
      .post('/auth/login')
      .send({ email: 'johndoe@gmail.com', password: 'abc123' })
      .expect(200);
  });
});
