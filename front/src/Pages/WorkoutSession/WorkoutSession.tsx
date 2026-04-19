import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkout } from '../../Context/WorkoutContext';
import type { Exercise } from '../../types';
import './WorkoutSession.css';

type ExerciseState = { exercise: Exercise; completed: boolean | null };

const CIRCUMFERENCE = 2 * Math.PI * 54;

const WorkoutSession = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const { plan, logWorkout } = useWorkout();

  const dayNum = Number(day);
  const dayPlan = plan?.days.find(d => d.day === dayNum);

  const [exerciseStates] = useState<ExerciseState[]>(() =>
    (dayPlan?.workouts || []).map(ex => ({ exercise: ex, completed: null }))
  );
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statesRef = useRef<ExerciseState[]>(exerciseStates);

  const currentExercise = exerciseStates[current]?.exercise;
  const totalSeconds = (currentExercise?.durationMinutes || 1) * 60;

  useEffect(() => {
    if (!sessionStarted || showSummary) return;
    setTimeLeft(totalSeconds);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [current, sessionStarted, showSummary]);

  const markAndAdvance = (completed: boolean) => {
    statesRef.current[current] = { ...statesRef.current[current], completed };
    clearInterval(timerRef.current!);
    if (current + 1 < exerciseStates.length) {
      setCurrent(c => c + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setSessionStarted(true);
  };

  const handleFinish = async (status: 'completed' | 'skipped') => {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    await logWorkout({
      date: new Date().toISOString(),
      planDay: dayNum,
      focus: dayPlan?.focus || '',
      workouts: statesRef.current.map(s => ({
        name: s.exercise.name,
        completed: s.completed === true,
      })),
      status,
      timeTakenSeconds: elapsed,
    });
    navigate('/plan');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  if (!dayPlan) {
    return (
      <div className="session-page">
        <p className="session-no-plan">Day {dayNum} not found in your plan.</p>
        <button className="btn-secondary" onClick={() => navigate('/plan')}>← Back</button>
      </div>
    );
  }

  if (!sessionStarted) {
    return (
      <div className="session-page session-pregame">
        <button className="btn-ghost session-back" onClick={() => navigate('/plan')}>← Back to plan</button>
        <div className="pregame-card">
          <p className="pregame-day">Day {dayNum}</p>
          <h2 className="pregame-focus">{dayPlan.focus}</h2>
          <ul className="pregame-list">
            {dayPlan.workouts.map(ex => (
              <li key={ex.uid}>
                <span className="pregame-name">{ex.name.replace(/_/g, ' ')}</span>
                <span className="pregame-dur">{ex.durationMinutes} min</span>
              </li>
            ))}
          </ul>
          <button className="btn-primary pregame-btn" onClick={handleStart}>
            Start Workout
          </button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    const doneCount = statesRef.current.filter(s => s.completed).length;
    return (
      <div className="session-page session-summary">
        <div className="summary-card">
          <div className="summary-icon">🎉</div>
          <h2 className="summary-title">Workout Complete</h2>
          <p className="summary-stats">{doneCount} / {statesRef.current.length} exercises done</p>
          <ul className="summary-list">
            {statesRef.current.map(s => (
              <li key={s.exercise.uid} className={`summary-item ${s.completed ? 'done' : 'skipped'}`}>
                <span className="summary-icon-small">{s.completed ? '✓' : '✗'}</span>
                <span>{s.exercise.name.replace(/_/g, ' ')}</span>
              </li>
            ))}
          </ul>
          <div className="summary-actions">
            <button className="btn-primary" onClick={() => handleFinish('completed')}>
              ✓ Save as Completed
            </button>
            <button className="btn-danger" onClick={() => handleFinish('skipped')}>
              ✗ Save as Skipped
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="session-page">
      <div className="session-header">
        <span className="session-progress-text">
          {current + 1} / {exerciseStates.length}
        </span>
        <div className="session-progress-bar">
          <div
            className="session-progress-fill"
            style={{ width: `${((current) / exerciseStates.length) * 100}%` }}
          />
        </div>
        <button className="btn-ghost session-end" onClick={() => setShowSummary(true)}>
          End early
        </button>
      </div>

      <div className="session-body">
        <div className="session-gif-wrap">
          {currentExercise?.gifUrl ? (
            <img className="session-gif" src={currentExercise.gifUrl} alt={currentExercise.name} />
          ) : (
            <div className="session-gif-placeholder">
              <span className="gif-placeholder-icon">🏃</span>
              <span className="gif-placeholder-text">GIF coming soon</span>
            </div>
          )}
        </div>

        <h2 className="session-exercise-name">
          {currentExercise?.name.replace(/_/g, ' ')}
        </h2>
        <p className="session-exercise-desc">{currentExercise?.description}</p>

        {currentExercise?.muscles && currentExercise.muscles.length > 0 && (
          <div className="session-muscles">
            {currentExercise.muscles.map(m => (
              <span key={m} className="muscle-chip">{m}</span>
            ))}
          </div>
        )}

        <div className="timer-wrap">
          <svg className="timer-svg" viewBox="0 0 120 120">
            <circle className="timer-track" cx="60" cy="60" r="54" />
            <circle
              className="timer-ring"
              cx="60"
              cy="60"
              r="54"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>

        <div className="session-actions">
          <button className="btn-danger" onClick={() => markAndAdvance(false)}>
            ✗ Skip
          </button>
          <button className="btn-success" onClick={() => markAndAdvance(true)}>
            ✓ Done
          </button>
        </div>
      </div>
    </div>
  );
};

export { WorkoutSession };
