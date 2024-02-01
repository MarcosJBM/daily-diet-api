import { knexInstance } from '@/database';

export async function findUserMetrics(userId: string) {
  const metrics = await knexInstance('metrics')
    .where({ user_id: userId })
    .first();

  return metrics;
}
