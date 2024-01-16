import { FastifyInstance } from 'fastify';

import { authenticate } from '@/plugins';
import { z } from 'zod';
import { validateSchema } from '@/utils';
import { randomUUID } from 'crypto';
import { knexInstance } from '@/database';

const createMealBodySchema = z.object({
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
  isOnDiet: z.boolean({
    invalid_type_error: 'IsOnDiet has an invalid type',
    required_error: 'IsOnDiet is required',
  }),
});

type CreateMealBodySchema = z.infer<typeof createMealBodySchema>;

export async function mealsRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateMealBodySchema }>(
    '/create',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const userId = request.user.id;

      const result = validateSchema(request.body, createMealBodySchema);

      if (typeof result === 'string')
        return reply.status(400).send({ error: result });

      const { date, description, hour, isOnDiet, name } = result;

      const meal = {
        id: randomUUID(),
        name,
        description,
        date,
        hour,
        is_on_diet: isOnDiet,
        user_id: userId,
      };

      await knexInstance('meals').insert(meal);

      return reply.status(201).send();
    }
  );
}
