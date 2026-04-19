import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useWorkout } from '../../Context/WorkoutContext';
import { generateWorkoutPlan } from '../../Logic/PlanGenerator';
import { SetupForm } from '../../Components/SetupForm/SetupForm';
import type { ProfileSetupData } from '../../types';
import './EditProfile.css';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const { savePlan, exercises } = useWorkout();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [regenerate, setRegenerate] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<ProfileSetupData>({
    weight: user?.weight ?? 70,
    birthday: user?.birthday ?? '',
    gender: user?.gender ?? 'male',
    hasWeights: user?.hasWeights ?? false,
    goal: user?.goal ?? 'muscle_growth',
    frequency: user?.frequency ?? 3,
    sessionLength: user?.sessionLength ?? 30,
  });

  const handleFormChange = (field: keyof ProfileSetupData, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile(form);
      if (regenerate && user) {
        const updatedUser = { ...user, ...form };
        const newPlan = generateWorkoutPlan(updatedUser, exercises);
        await savePlan(newPlan);
      }
      navigate('/plan');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card reg-card">
        <div className="auth-logo">✏️</div>
        <h1 className="auth-title">Edit Profile</h1>
        <p className="auth-subtitle">Update your info — your plan will reflect the changes</p>
        {error && <p className="auth-error">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <SetupForm values={form} onChange={handleFormChange} />
          <label className="edit-profile-regen">
            <input
              type="checkbox"
              checked={regenerate}
              onChange={e => setRegenerate(e.target.checked)}
            />
            Regenerate my workout plan with updated info
          </label>
          <div className="edit-profile-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate('/plan')}
              disabled={saving}
            >
              Cancel
            </button>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { EditProfile };
