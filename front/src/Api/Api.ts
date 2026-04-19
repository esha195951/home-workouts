import type { UserProfile, WorkoutPlan, WorkoutLogEntry, RegisterData, WorkoutExercise } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json() as Promise<T>;
};

const apiLogin = (username: string, password: string) =>
  apiFetch<UserProfile>('/users/login', { method: 'POST', body: JSON.stringify({ username, password }) });

const apiRegister = (data: RegisterData) =>
  apiFetch<UserProfile>('/users/register', { method: 'POST', body: JSON.stringify(data) });

const apiLogout = () =>
  apiFetch<{ message: string }>('/users/logout', { method: 'POST' });

const apiGetMe = () =>
  apiFetch<UserProfile>('/users/me');

const apiUpdateMe = (data: Partial<UserProfile>) =>
  apiFetch<UserProfile>('/users/me', { method: 'PUT', body: JSON.stringify(data) });

const apiGetPlan = () =>
  apiFetch<WorkoutPlan>('/workouts/plan');

const apiSavePlan = (days: WorkoutPlan['days']) =>
  apiFetch<WorkoutPlan>('/workouts/plan', { method: 'POST', body: JSON.stringify({ days }) });

const apiUpdatePlan = (days: WorkoutPlan['days']) =>
  apiFetch<WorkoutPlan>('/workouts/plan', { method: 'PUT', body: JSON.stringify({ days }) });

const apiLogWorkout = (log: Omit<WorkoutLogEntry, '_id' | 'synced'>) =>
  apiFetch<WorkoutLogEntry>('/workouts/log', { method: 'POST', body: JSON.stringify(log) });

const apiGetLogs = () =>
  apiFetch<WorkoutLogEntry[]>('/workouts/logs');

const apiGetExercises = () =>
  apiFetch<WorkoutExercise[]>('/workouts/exercises');

export { apiLogin, apiRegister, apiLogout, apiGetMe, apiUpdateMe, apiGetPlan, apiSavePlan, apiUpdatePlan, apiLogWorkout, apiGetLogs, apiGetExercises };
