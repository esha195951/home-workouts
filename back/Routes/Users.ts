import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../Models/DbModels';
import { authMiddleware } from '../Middleware/Auth';

const usersRouter = Router();

const userResponse = (user: any) => ({
  _id: user._id,
  username: user.username,
  weight: user.weight,
  birthday: user.birthday,
  gender: user.gender,
  hasWeights: user.hasWeights,
  goal: user.goal,
  frequency: user.frequency,
  sessionLength: user.sessionLength,
});

usersRouter.post('/register', async (req, res) => {
  try {
    const { username, password, weight, birthday, gender, hasWeights, goal, frequency, sessionLength } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }
    if (username.length < 3 || username.length > 20) {
      res.status(400).json({ message: 'Username must be 3-20 characters' });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters' });
      return;
    }

    const existing = await User.findOne({ username });
    if (existing) {
      res.status(400).json({ message: 'Username already taken' });
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, weight, birthday, gender, hasWeights, goal, frequency, sessionLength });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(201).json(userResponse(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

usersRouter.post('/details', authMiddleware, async (req, res) => { // to update details like weight, age etc
  try {
    const { weight, birthday, gender, hasWeights, goal, frequency, sessionLength } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as any).user._id,
      { weight, birthday, gender, hasWeights, goal, frequency, sessionLength },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

usersRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json(userResponse(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

usersRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

usersRouter.get('/me', authMiddleware, (req, res) => {
  res.json((req as any).user);
});

usersRouter.put('/me', authMiddleware, async (req, res) => {
  try {
    const { weight, birthday, gender, hasWeights, goal, frequency, sessionLength } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as any).user._id,
      { weight, birthday, gender, hasWeights, goal, frequency, sessionLength },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export { usersRouter };
