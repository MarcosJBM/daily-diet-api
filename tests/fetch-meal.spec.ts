import { execSync } from 'node:child_process';

import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { knexInstance } from '@/database';
import { createAndAuthenticateUser } from '@/utils';

describe('Fetch Meal (E2E)', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest');

    await app.ready();
  });

  afterAll(async () => {
    execSync('npm run knex migrate:rollback --all');

    await app.close();
  });

  it('should be able to get a unique meal', async () => {
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

    const [meal] = await knexInstance('meals');

    const response = await supertest(app.server)
      .get(`/meals/${meal.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.meal).toEqual(
      expect.objectContaining({ name: 'Café da manhã' }),
    );
  });
});
