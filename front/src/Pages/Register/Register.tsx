import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useWorkout } from '../../Context/WorkoutContext';
import { generateWorkoutPlan } from '../../Logic/PlanGenerator';
import type { RegisterData } from '../../types';
import './Register.css';

const Register = () => {
  const { register } = useAuth();
  const { savePlan, exercises } = useWorkout();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RegisterData>({
    username: '',
    password: '',
    weight: 70,
    birthday: '',
    gender: 'male',
    hasWeights: false,
    goal: 'muscle_growth',
    frequency: 3,
    sessionLength: 30,
  });

  const set = (field: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      const plan = generateWorkoutPlan({ ...form, _id: '' }, exercises);
      await savePlan(plan);
      navigate('/plan');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card reg-card">
        <div className="auth-logo">🏋️</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Tell us about yourself to get your plan</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="reg-grid">
            <div className="field-group">
              <label className="field-label">Username</label>
              <input className="field-input" type="text" value={form.username} onChange={set('username')} placeholder="min 3 characters" required />
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <input className="field-input" type="password" value={form.password} onChange={set('password')} placeholder="min 8 characters" required autoComplete="new-password" />
            </div>
            <div className="field-group">
              <label className="field-label">Weight (kg)</label>
              <input className="field-input" type="number" min={20} max={300} value={form.weight} onChange={set('weight')} required />
            </div>
            <div className="field-group">
              <label className="field-label">Date of Birth</label>
              <input className="field-input" type="date" max={new Date().toISOString().split('T')[0]} value={form.birthday} onChange={set('birthday')} required />
            </div>
            <div className="field-group">
              <label className="field-label">Gender</label>
              <select className="field-input" value={form.gender} onChange={set('gender')}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Goal</label>
              <select className="field-input" value={form.goal} onChange={set('goal')}>
                <option value="muscle_growth">Muscle Growth</option>
                <option value="weight_loss">Weight Loss</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Days per week</label>
              <input className="field-input" type="number" min={1} max={7} value={form.frequency} onChange={set('frequency')} required />
            </div>
            <div className="field-group">
              <label className="field-label">Session length (min)</label>
              <input className="field-input" type="number" min={10} max={120} value={form.sessionLength} onChange={set('sessionLength')} required />
            </div>
          </div>
          <div className="field-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.hasWeights} onChange={set('hasWeights')} />
              <span>I have weights at home</span>
            </label>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating your plan...' : 'Get My Plan'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export { Register };
