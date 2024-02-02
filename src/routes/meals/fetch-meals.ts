import { FastifyReply, FastifyRequest } from 'fastify';

import { knexInstance } from '@/database';

export async function fetchMeals(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.id;

  const meals = await knexInstance('meals').where({ user_id: userId });

  return reply.status(200).send({ meals });
}
