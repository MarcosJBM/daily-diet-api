import { execSync } from 'node:child_process';

import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';

describe('User Authentication (E2E)', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest');

    await app.ready();
  });

  afterAll(async () => {
    execSync('npm run knex migrate:rollback --all');

    await app.close();
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
});
