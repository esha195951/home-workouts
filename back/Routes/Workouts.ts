import { Router } from 'express';
import { WorkoutPlan, WorkoutLog, WorkoutExercise } from '../Models/DbModels';
import { authMiddleware } from '../Middleware/Auth';

const workoutsRouter = Router();

workoutsRouter.use(authMiddleware);

workoutsRouter.get('/exercises', async (_req, res) => {
  try {
    const exercises = await WorkoutExercise.find({}, { __v: 0 });
    res.json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

workoutsRouter.get('/plan', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ userId: (req as any).user._id });
    if (!plan) {
      res.status(404).json({ message: 'No plan found' });
      return;
    }
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

workoutsRouter.post('/plan', async (req, res) => {
  try {
    const { days } = req.body;
    const plan = await WorkoutPlan.findOneAndUpdate(
      { userId: (req as any).user._id },
      { userId: (req as any).user._id, days },
      { upsert: true, new: true }
    );
    res.status(201).json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

workoutsRouter.put('/plan', async (req, res) => {
  try {
    const { days } = req.body;
    const plan = await WorkoutPlan.findOneAndUpdate(
      { userId: (req as any).user._id },
      { days },
      { new: true }
    );
    if (!plan) {
      res.status(404).json({ message: 'No plan found' });
      return;
    }
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

workoutsRouter.post('/log', async (req, res) => {
  try {
    const { planDay, focus, workouts, status, timeTakenSeconds, date } = req.body;
    const log = await WorkoutLog.create({
      userId: (req as any).user._id,
      planDay,
      focus,
      workouts,
      status,
      timeTakenSeconds,
      date: date || new Date(),
    });
    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

workoutsRouter.get('/logs', async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ userId: (req as any).user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export { workoutsRouter };
