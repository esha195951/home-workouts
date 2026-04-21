import type { UserProfile, WorkoutExercise, WorkoutDay } from '../types';

const getWeightCategory = (kg: number) => kg > 85 ? 'high' : kg < 65 ? 'low' : 'medium';

const getAgeFromBirthday = (birthday: string | undefined): number => {
  if (!birthday) return 30;
  const dob = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age;
};

interface InternalProfile {
  body_weight_kg: number;
  body_weight_category: string;
  age: number;
  gender: string;
  goal: string;
  has_weights: boolean;
  frequency: number;
  session_length: number;
}

const buildUserProfile = (user: UserProfile): InternalProfile => ({
  body_weight_kg: user.weight || 70,
  body_weight_category: getWeightCategory(user.weight || 70),
  age: user.birthday ? getAgeFromBirthday(user.birthday) : (user.age || 30),
  gender: user.gender || 'male',
  goal: user.goal || 'muscle_growth',
  has_weights: user.hasWeights || false,
  frequency: Math.max(1, Math.min(user.frequency || 3, 7)),
  session_length: user.sessionLength || 30,
});

const isWorkoutAvailable = (workout: WorkoutExercise, user: InternalProfile): boolean => {
  if (workout.requires_weight && !user.has_weights) return false;
  if (workout.age_recommendation) {
    const { min, max } = workout.age_recommendation;
    if (user.age < min || user.age > max) return false;
  }
  return true;
};

const calculateWorkoutScore = (workout: WorkoutExercise, user: InternalProfile): number => {
  const genderScore = (workout.gender_recommendation as Record<string, number>)[user.gender] ?? 70;
  const goalScore = user.goal === 'muscle_growth'
    ? workout.muscle_growth_recommended
    : workout.weight_loss_recommended;

  let score = genderScore * 0.25 + goalScore * 0.55;
  if (!workout.requires_weight && !user.has_weights) score += 10;
  if (workout.requires_weight && !user.has_weights) score -= 40;
  if (user.body_weight_category === 'high' && !workout.requires_weight) score += 5;
  if (user.body_weight_category === 'low' && workout.requires_weight) score += 5;
  return Math.max(0, Math.min(100, Math.round(score)));
};

interface ScoredExercise {
  name: string;
  description: string;
  score: number;
  focus_group: string;
  muscles: string[];
  requires_weight: boolean;
  age_recommendation: { min: number; max: number };
  demonstration_url?: string;
}

const recommendWorkouts = (exercises: WorkoutExercise[], user: InternalProfile, limit = 20): ScoredExercise[] =>
  exercises
    .filter(w => isWorkoutAvailable(w, user))
    .map(w => ({
      name: w.name,
      description: w.description,
      score: calculateWorkoutScore(w, user),
      focus_group: w.focus_group,
      muscles: w.muscles || [],
      requires_weight: w.requires_weight,
      age_recommendation: w.age_recommendation,
      demonstration_url: w.demonstration_url,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

const groupByFocusGroup = (recommendations: ScoredExercise[]): Record<string, ScoredExercise[]> =>
  recommendations.reduce<Record<string, ScoredExercise[]>>((groups, w) => {
    const key = w.focus_group || 'general';
    if (!groups[key]) groups[key] = [];
    groups[key].push(w);
    return groups;
  }, {});

const buildWorkoutPlan = (user: InternalProfile, recommendations: ScoredExercise[]): WorkoutDay[] => {
  if (!recommendations.length) return [];

  const planDays = user.frequency;
  const grouped = groupByFocusGroup(recommendations);

  if (user.goal === 'weight_loss') {
    const weightLossGroup = grouped['weight_loss'] || [];
    const allOther = recommendations.filter(w => w.focus_group !== 'weight_loss');
    return Array.from({ length: planDays }, (_, i) => {
      const dayWorkouts: ScoredExercise[] = [];
      if (weightLossGroup.length) dayWorkouts.push(weightLossGroup[i % weightLossGroup.length]);
      while (dayWorkouts.length < 4 && allOther.length) {
        dayWorkouts.push(allOther[(i + dayWorkouts.length) % allOther.length]);
      }
      return {
        day: i + 1,
        focus: 'Weight loss',
        workouts: dayWorkouts.map(w => ({
          name: w.name,
          description: w.description,
          muscle_group: w.focus_group,
          muscles: w.muscles,
          score: w.score,
          can_use_weight: w.requires_weight,
          durationMinutes: Math.max(1, Math.round(user.session_length / Math.max(1, dayWorkouts.length))),
          demonstration_url: w.demonstration_url,
          uid: w.name,
        })),
      };
    });
  }

  const prioritizedGroups = Object.keys(grouped)
    .filter(g => g !== 'weight_loss')
    .sort((a, b) => grouped[b].length - grouped[a].length);

  if (!prioritizedGroups.length) prioritizedGroups.push('weight_loss');

  return Array.from({ length: planDays }, (_, i) => {
    const group = prioritizedGroups[i % prioritizedGroups.length];
    const dayWorkouts = (grouped[group] || recommendations).slice(0, 4);
    const minutesEach = Math.max(1, Math.round(user.session_length / Math.max(1, dayWorkouts.length)));
    return {
      day: i + 1,
      focus: group,
      workouts: dayWorkouts.map(w => ({
        name: w.name,
        description: w.description,
        muscle_group: w.focus_group,
        muscles: w.muscles,
        score: w.score,
        can_use_weight: w.requires_weight,
        durationMinutes: minutesEach,
        demonstration_url: w.demonstration_url,
        uid: w.name,
      })),
    };
  });
};

export { buildUserProfile, recommendWorkouts, buildWorkoutPlan };

