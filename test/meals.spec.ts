import { execSync } from 'node:child_process';

import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { knexInstance } from '@/database';
import { createAndAuthenticateUser } from '@/utils';

describe('Meals Routes', () => {
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

    await supertest(app.server)
      .post('/meals/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Almoço',
        description: 'Comida caseira',
        date: '2023-01-01',
        hour: '12:00',
        is_on_diet: true,
      })
      .expect(201);
  });

  it('should be able to update a meal', async () => {
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
      .put(`/meals/update/${meal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Café da manhã',
        description: 'Pão com doce de leite',
        date: '2023-01-02',
        hour: '07:00',
        is_on_diet: false,
      });

    const [updatedMeal] = await knexInstance('meals');

    expect(response.status).toEqual(200);
    expect(updatedMeal).toEqual(
      expect.objectContaining({
        name: 'Café da manhã',
        description: 'Pão com doce de leite',
      }),
    );
  });
});
