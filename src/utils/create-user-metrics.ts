import { randomUUID } from 'node:crypto';

import { knexInstance } from '@/database';

export async function createUserMetrics(userId: string) {
  await knexInstance('metrics').insert({
    best_sequence: 0,
    current_sequence: 0,
    id: randomUUID(),
    off_the_diet: 0,
    registered_meals: 0,
    user_id: userId,
    within_the_diet: 0,
  });
}
