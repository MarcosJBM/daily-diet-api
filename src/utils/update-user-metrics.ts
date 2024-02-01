import { knexInstance } from '@/database';

interface UpdateUserMetricsProps {
  best_sequence: number;
  current_sequence: number;
  is_on_diet: boolean;
  off_the_diet: number;
  registered_meals: number;
  user_id: string;
  within_the_diet: number;
}

export async function updateUserMetrics(props: UpdateUserMetricsProps) {
  const {
    best_sequence,
    current_sequence,
    is_on_diet,
    off_the_diet,
    registered_meals,
    user_id,
    within_the_diet,
  } = props;

  const newCurrentSequence = is_on_diet ? current_sequence + 1 : 0;

  const newBestSequence =
    newCurrentSequence > best_sequence ? best_sequence + 1 : best_sequence;

  const newOffTheDiet = is_on_diet ? off_the_diet : off_the_diet + 1;

  const newWithinTheDiet = is_on_diet ? within_the_diet + 1 : within_the_diet;

  await knexInstance('metrics')
    .where({ user_id })
    .update({
      best_sequence: newBestSequence,
      current_sequence: newCurrentSequence,
      off_the_diet: newOffTheDiet,
      registered_meals: registered_meals + 1,
      within_the_diet: newWithinTheDiet,
    });
}
