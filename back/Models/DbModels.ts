import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  weight: { type: Number },
  birthday: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  hasWeights: { type: Boolean, default: false },
  goal: { type: String, enum: ['weight_loss', 'muscle_growth'] },
  frequency: { type: Number, min: 1, max: 7, default: 3 },
  sessionLength: { type: Number, default: 30 },
}, { timestamps: true });

const exerciseSchema = new mongoose.Schema({
  name: String,
  description: String,
  muscle_group: String,
  muscles: [String],
  score: Number,
  can_use_weight: Boolean,
  durationMinutes: Number,
  gifUrl: { type: String, default: '' },
  uid: String,
}, { _id: false });

const workoutDaySchema = new mongoose.Schema({
  day: Number,
  focus: String,
  workouts: [exerciseSchema],
}, { _id: false });

const workoutPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  days: [workoutDaySchema],
}, { timestamps: true });

const workoutExerciseLogSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
}, { _id: false });

const workoutLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planDay: { type: Number, required: true },
  focus: String,
  workouts: [workoutExerciseLogSchema],
  status: { type: String, enum: ['completed', 'skipped'], required: true },
  timeTakenSeconds: Number,
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const workoutExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  gender_recommendation: {
    male: { type: Number, default: 70 },
    female: { type: Number, default: 70 },
    other: { type: Number, default: 70 },
  },
  requires_weight: { type: Boolean, required: true },
  weight_loss_recommended: { type: Number, required: true },
  muscle_growth_recommended: { type: Number, required: true },
  age_recommendation: {
    min: { type: Number, default: 12 },
    max: { type: Number, default: 80 },
  },
  focus_group: { type: String, default: 'other' },
  muscles: { type: [String], default: [] },
  gifUrl: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
const WorkoutExercise = mongoose.model('WorkoutExercise', workoutExerciseSchema);

export { User, WorkoutPlan, WorkoutLog, WorkoutExercise };