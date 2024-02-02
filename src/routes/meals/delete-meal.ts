import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { knexInstance } from '@/database';
import { validateSchema } from '@/utils';

export async function deleteMeal(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.id;

  const paramsSchema = z.object({
    mealId: z.string({
      invalid_type_error: 'Meal ID has an invalid type',
      required_error: 'Meal ID is required',
    }),
  });

  const paramsSchemaResult = validateSchema(request.params, paramsSchema);

  if (typeof paramsSchemaResult === 'string')
    return reply.status(400).send({ error: paramsSchemaResult });

  const { mealId } = paramsSchemaResult;

  const meal = await knexInstance('meals')
    .where({ user_id: userId, id: mealId })
    .first();

  if (!meal) return reply.status(400).send({ error: 'Meal not found.' });

  await knexInstance('meals').where({ id: mealId }).delete();

  return reply.status(204).send();
}
