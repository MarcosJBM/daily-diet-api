import { execSync } from 'node:child_process';

import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { knexInstance } from '@/database';
import { createAndAuthenticateUser } from '@/utils';

describe('Delete Meal (E2E)', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest');

    await app.ready();
  });

  afterAll(async () => {
    execSync('npm run knex migrate:rollback --all');

    await app.close();
  });

  it('should be able to delete a meal', async () => {
    const { token } = await createAndAuthenticateUser(app);

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

    const [meal] = await knexInstance('meals');

    const response = await supertest(app.server)
      .delete(`/meals/delete/${meal.id}`)
      .set('Authorization', `Bearer ${token}`);

    const [deletedMeal] = await knexInstance('meals');

    expect(response.status).toEqual(204);
    expect(deletedMeal).toBeUndefined();
  });
});
