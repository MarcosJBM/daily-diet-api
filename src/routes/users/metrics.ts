import { FastifyReply, FastifyRequest } from 'fastify';

import { knexInstance } from '@/database';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.id;

  const metrics = await knexInstance('metrics')
    .where({ user_id: userId })
    .first();

  if (!metrics) return reply.status(400).send({ error: 'Metrics not found.' });

  return reply.status(200).send({ metrics });
}
