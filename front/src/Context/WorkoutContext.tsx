import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { WorkoutPlan, WorkoutLogEntry, WorkoutExercise } from '../types';
import { apiGetPlan, apiSavePlan, apiUpdatePlan, apiLogWorkout, apiGetLogs, apiGetExercises } from '../Api/Api';
import { useAuth } from './AuthContext';
import { ExerciseData } from './SeedWorkoutsData';

const LOCAL_PLAN_KEY = 'hw_plan';
const LOCAL_LOGS_KEY = 'hw_logs';
const LOCAL_EXERCISES_KEY = 'hw_exercises';

interface WorkoutContextType {
  plan: WorkoutPlan | null;
  logs: WorkoutLogEntry[];
  exercises: WorkoutExercise[];
  planLoading: boolean;
  exercisesLoading: boolean;
  savePlan: (plan: WorkoutPlan) => Promise<void>;
  updatePlan: (plan: WorkoutPlan) => Promise<void>;
  logWorkout: (log: Omit<WorkoutLogEntry, '_id'>) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [logs, setLogs] = useState<WorkoutLogEntry[]>([]);
  const [exercises, setExercises] = useState<WorkoutExercise[]>(() => {
    const saved = localStorage.getItem(LOCAL_EXERCISES_KEY);
    return saved ? JSON.parse(saved) : (ExerciseData as WorkoutExercise[]);
  });
  const [planLoading, setPlanLoading] = useState(false);
  const [exercisesLoading, setExercisesLoading] = useState(false);

  useEffect(() => {
    const localPlan = localStorage.getItem(LOCAL_PLAN_KEY);
    const localLogs = localStorage.getItem(LOCAL_LOGS_KEY);
    const localExercises = localStorage.getItem(LOCAL_EXERCISES_KEY);
    if (localPlan) setPlan(JSON.parse(localPlan));
    if (localLogs) setLogs(JSON.parse(localLogs));
    if (localExercises) setExercises(JSON.parse(localExercises));

    setExercisesLoading(true);
    apiGetExercises()
      .then(ex => {
        setExercises(ex);
        localStorage.setItem(LOCAL_EXERCISES_KEY, JSON.stringify(ex));
      })
      .catch(() => {
        setExercises(ExerciseData as WorkoutExercise[]);
        localStorage.setItem(LOCAL_EXERCISES_KEY, JSON.stringify(ExerciseData));
      })
      .finally(() => setExercisesLoading(false));
  }, []);

  useEffect(() => {
    if (!user || user.isGuest) return;

    setPlanLoading(true);
    apiGetPlan()
      .then(p => {
        setPlan(p);
        localStorage.setItem(LOCAL_PLAN_KEY, JSON.stringify(p));
      })
      .catch(() => {
      })
      .finally(() => setPlanLoading(false));

    apiGetLogs()
      .then(l => {
        setLogs(l);
        localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(l));
      })
      .catch(() => {});
  }, [user]);

  const savePlan = async (newPlan: WorkoutPlan) => {
    localStorage.setItem(LOCAL_PLAN_KEY, JSON.stringify(newPlan));
    setPlan(newPlan);
    if (user) {
      try {
        const saved = await apiSavePlan(newPlan.days);
        setPlan(saved);
        localStorage.setItem(LOCAL_PLAN_KEY, JSON.stringify(saved));
      } catch {}
    }
  };

  const updatePlan = async (newPlan: WorkoutPlan) => {
    localStorage.setItem(LOCAL_PLAN_KEY, JSON.stringify(newPlan));
    setPlan(newPlan);
    if (user) {
      try {
        const updated = await apiUpdatePlan(newPlan.days);
        setPlan(updated);
        localStorage.setItem(LOCAL_PLAN_KEY, JSON.stringify(updated));
      } catch {}
    }
  };

  const logWorkout = async (log: Omit<WorkoutLogEntry, '_id'>) => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY) || '[]') as WorkoutLogEntry[];
    const newLog = { ...log, synced: false };
    const updated = [newLog, ...stored];
    localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(updated));
    setLogs(updated);
    if (user) {
      try {
        const saved = await apiLogWorkout(log);
        const synced = updated.map(l =>
          l.date === log.date && l.planDay === log.planDay ? { ...saved, synced: true } : l
        );
        localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(synced));
        setLogs(synced);
      } catch {}
    }
  };

  return (
    <WorkoutContext.Provider value={{ plan, logs, exercises, planLoading, exercisesLoading, savePlan, updatePlan, logWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

const useWorkout = () => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider');
  return ctx;
};

export { WorkoutProvider, useWorkout };
