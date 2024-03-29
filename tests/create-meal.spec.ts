import { execSync } from 'node:child_process';

import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils';

describe('Create Meal (E2E)', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest');

    await app.ready();
  });

  afterAll(async () => {
    execSync('npm run knex migrate:rollback --all');

    await app.close();
  });

  it('should be able to create a meal', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await supertest(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Almoço',
        description: 'Comida caseira',
        date: '2023-01-01',
        hour: '12:00',
        is_on_diet: true,
      });

    expect(response.status).toEqual(201);
  });
});
