import { execSync } from 'node:child_process';

import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils';

describe('Fetch Meals (E2E)', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest');

    await app.ready();
  });

  afterAll(async () => {
    execSync('npm run knex migrate:rollback --all');

    await app.close();
  });

  it("should be able to list users' meals", async () => {
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

    const response = await supertest(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`);

    const { meals } = response.body;

    expect(response.status).toEqual(200);
    expect(meals).toEqual([
      expect.objectContaining({ name: 'Café da manhã' }),
      expect.objectContaining({ name: 'Almoço' }),
    ]);
  });
});
