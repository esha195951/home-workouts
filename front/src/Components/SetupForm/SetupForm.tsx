import type { ChangeEvent } from 'react';
import type { ProfileSetupData } from '../../types';

type Props = {
  values: ProfileSetupData;
  onChange: (field: keyof ProfileSetupData, value: string | number | boolean) => void;
};

const handleFormChange = (field: keyof ProfileSetupData, onChange: Props['onChange']) =>
  (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.value;
    onChange(field, value);
  };

const SetupForm = ({ values, onChange }: Props) => {
  return (
    <>
      <div className="reg-grid">
        <div className="field-group">
          <label className="field-label">Weight (kg)</label>
          <input
            className="field-input"
            type="number"
            min={20}
            max={300}
            value={values.weight}
            onChange={handleFormChange('weight', onChange)}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label">Date of Birth</label>
          <input
            className="field-input"
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={values.birthday}
            onChange={handleFormChange('birthday', onChange)}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label">Gender</label>
          <select className="field-input" value={values.gender} onChange={handleFormChange('gender', onChange)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Goal</label>
          <select className="field-input" value={values.goal} onChange={handleFormChange('goal', onChange)}>
            <option value="muscle_growth">Muscle Growth</option>
            <option value="weight_loss">Weight Loss</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Days per week</label>
          <input
            className="field-input"
            type="number"
            min={1}
            max={7}
            value={values.frequency}
            onChange={handleFormChange('frequency', onChange)}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label">Session length (min)</label>
          <input
            className="field-input"
            type="number"
            min={10}
            max={120}
            value={values.sessionLength}
            onChange={handleFormChange('sessionLength', onChange)}
            required
          />
        </div>
      </div>
      <div className="field-group checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" checked={values.hasWeights} onChange={handleFormChange('hasWeights', onChange)} />
          <span>I have weights at home</span>
        </label>
      </div>
    </>
  );
};

export { SetupForm };
