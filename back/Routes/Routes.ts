import { Router } from 'express';
import { usersRouter } from './Users';
import { workoutsRouter } from './Workouts';

const router = Router();

router.use('/users', usersRouter);
router.use('/workouts', workoutsRouter);

export { router };
