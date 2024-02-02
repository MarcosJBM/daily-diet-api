import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/plugins';

import { createMeal } from './create-meal';
import { deleteMeal } from './delete-meal';
import { fetchMeal } from './fetch-meal';
import { fetchMeals } from './fetch-meals';
import { updateMeal } from './update-meal';

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post('/create', createMeal);
  app.put('/update/:mealId', updateMeal);
  app.delete('/delete/:mealId', deleteMeal);
  app.get('/', fetchMeals);
  app.get('/:mealId', fetchMeal);
}
