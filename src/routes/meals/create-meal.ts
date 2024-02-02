import { randomUUID } from 'node:crypto';

import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { knexInstance } from '@/database';
import { findUserMetrics, updateUserMetrics, validateSchema } from '@/utils';

export async function createMeal(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z
      .string({
        invalid_type_error: 'Name has an invalid type',
        required_error: 'Name is required',
      })
      .min(1, 'Name is required')
      .max(36, 'Name must have a maximum of 36 characters'),
    description: z
      .string({
        invalid_type_error: 'Description has an invalid type',
        required_error: 'Description is required',
      })
      .min(1, 'Description in required')
      .max(256, 'Description must have a maximum of 256 characters'),
    date: z.coerce.date({
      invalid_type_error: 'Date has an invalid type',
      required_error: 'Date is required',
    }),
    hour: z.string({
      invalid_type_error: 'Hour has an invalid type',
      required_error: 'Hour is required',
    }),
    is_on_diet: z.boolean({
      invalid_type_error: 'IsOnDiet has an invalid type',
      required_error: 'IsOnDiet is required',
    }),
  });

  const userId = request.user.id;

  const bodySchemaResult = validateSchema(request.body, bodySchema);

  if (typeof bodySchemaResult === 'string')
    return reply.status(400).send({ error: bodySchemaResult });

  const { date, description, hour, is_on_diet, name } = bodySchemaResult;

  await knexInstance('meals').insert({
    id: randomUUID(),
    name,
    description,
    date,
    hour,
    is_on_diet,
    user_id: userId,
  });

  const metrics = await findUserMetrics(userId);

  if (metrics) await updateUserMetrics({ is_on_diet, ...metrics });

  return reply.status(201).send();
}
