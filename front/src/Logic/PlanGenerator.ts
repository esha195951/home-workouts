import type { UserProfile, WorkoutPlan, WorkoutExercise } from '../types';
import { buildUserProfile, recommendWorkouts, buildWorkoutPlan } from './DecisionEngine';

const generateWorkoutPlan = (user: UserProfile, exercises: WorkoutExercise[]): WorkoutPlan => {
  const profile = buildUserProfile(user);
  const recommended = recommendWorkouts(exercises, profile);
  const days = buildWorkoutPlan(profile, recommended);
  return { days };
};

export { generateWorkoutPlan };
