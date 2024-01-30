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
    const response = await supertest(app.server).post('/users/create').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'abc123',
    });

    expect(response.status).toEqual(201);
  });
});
