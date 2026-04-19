export interface WorkoutExercise {
  _id?: string;
  name: string;
  description: string;
  gender_recommendation: { male: number; female: number; other: number };
  requires_weight: boolean;
  weight_loss_recommended: number;
  muscle_growth_recommended: number;
  age_recommendation: { min: number; max: number };
  focus_group: string;
  muscles: string[];
  gifUrl: string;
}

export interface Exercise {
  name: string;
  description: string;
  muscle_group: string;
  muscles: string[];
  score?: number;
  can_use_weight: boolean;
  durationMinutes: number;
  gifUrl: string;
  uid: string;
}

export interface WorkoutDay {
  day: number;
  focus: string;
  workouts: Exercise[];
}

export interface WorkoutPlan {
  _id?: string;
  days: WorkoutDay[];
}

export interface UserProfile {
  _id: string;
  username: string;
  weight?: number;
  birthday?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  hasWeights?: boolean;
  goal?: 'weight_loss' | 'muscle_growth';
  frequency?: number;
  sessionLength?: number;
}

export interface WorkoutLogEntry {
  _id?: string;
  date: string;
  planDay: number;
  focus: string;
  workouts: {
    name: string;
    completed: boolean;
  }[];
  status: 'completed' | 'skipped';
  timeTakenSeconds: number;
  synced?: boolean;
}

export interface RegisterData {
  username: string;
  password: string;
  weight: number;
  birthday: string;
  gender: 'male' | 'female' | 'other';
  hasWeights: boolean;
  goal: 'weight_loss' | 'muscle_growth';
  frequency: number;
  sessionLength: number;
}
