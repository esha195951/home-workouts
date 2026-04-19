import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useAuth } from '../../Context/AuthContext';
import { useWorkout } from '../../Context/WorkoutContext';
import { generateWorkoutPlan } from '../../Logic/PlanGenerator';
import { ExerciseCard } from '../../Components/ExerciseCard/ExerciseCard';
import type { Exercise, WorkoutDay } from '../../types';
import './WorkoutPlan.css';

const DroppableDay = ({ day, children }: { day: WorkoutDay; children: ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `container-${day.day}` });
  return (
    <div ref={setNodeRef} className={`day-column ${isOver ? 'day-column--over' : ''}`}>
      {children}
    </div>
  );
};

const WorkoutPlan = () => {
  const { user, logout } = useAuth();
  const { plan, planLoading, updatePlan, savePlan, exercises } = useWorkout();
  const navigate = useNavigate();
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const findContainer = (id: string) =>
    plan?.days.find(d => d.workouts.some(w => w.uid === id));

  const handleDragStart = (event: DragStartEvent) => {
    const sourceDay = findContainer(event.active.id as string);
    const exercise = sourceDay?.workouts.find(w => w.uid === event.active.id);
    setActiveExercise(exercise || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !plan) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceDay = findContainer(activeId);
    const isOverContainer = overId.startsWith('container-');
    const targetDay = isOverContainer
      ? plan.days.find(d => `container-${d.day}` === overId)
      : findContainer(overId);

    if (!sourceDay || !targetDay || sourceDay.day === targetDay.day) return;

    const exercise = sourceDay.workouts.find(w => w.uid === activeId)!;
    const insertIndex = isOverContainer
      ? targetDay.workouts.length
      : targetDay.workouts.findIndex(w => w.uid === overId);

    const newDays = plan.days.map(d => {
      if (d.day === sourceDay.day) {
        const newWorkouts = d.workouts.filter(w => w.uid !== activeId);
        const dur = newWorkouts.length ? Math.max(1, Math.round((user?.sessionLength || 30) / newWorkouts.length)) : (user?.sessionLength || 30);
        return { ...d, workouts: newWorkouts.map(w => ({ ...w, durationMinutes: dur })) };
      }
      if (d.day === targetDay.day) {
        const newWorkouts = [...d.workouts];
        newWorkouts.splice(insertIndex < 0 ? newWorkouts.length : insertIndex, 0, exercise);
        const dur = Math.max(1, Math.round((user?.sessionLength || 30) / newWorkouts.length));
        return { ...d, workouts: newWorkouts.map(w => ({ ...w, durationMinutes: dur })) };
      }
      return d;
    });

    updatePlan({ ...plan, days: newDays });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveExercise(null);
    if (!over || !plan) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceDay = findContainer(activeId);
    if (!sourceDay || overId.startsWith('container-')) return;

    const targetDay = findContainer(overId);
    if (!targetDay || sourceDay.day !== targetDay.day) return;

    const oldIndex = sourceDay.workouts.findIndex(w => w.uid === activeId);
    const newIndex = targetDay.workouts.findIndex(w => w.uid === overId);
    if (oldIndex === newIndex) return;

    const reordered = arrayMove(sourceDay.workouts, oldIndex, newIndex);
    const newDays = plan.days.map(d =>
      d.day === sourceDay.day ? { ...d, workouts: reordered } : d
    );
    updatePlan({ ...plan, days: newDays });
  };

  const handleSave = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      await savePlan(plan);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!user) return;
    setRegenerating(true);
    try {
      const newPlan = generateWorkoutPlan(user, exercises);
      await savePlan(newPlan);
    } finally {
      setRegenerating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (planLoading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="plan-page">
      <header className="plan-header">
        <div className="plan-header-left">
          <div>
            <h1 className="plan-title">Your Plan</h1>
            <p className="plan-meta">
              {user?.goal?.replace('_', ' ')} · {user?.frequency} days/week · {user?.sessionLength} min
            </p>
          </div>
        </div>
        <div className="plan-header-right">
          <button className="btn-secondary" onClick={handleRegenerate} disabled={regenerating}>
            {regenerating ? 'Regenerating...' : '↺ Regenerate'}
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '✓ Save'}
          </button>
          <button className="btn-ghost" onClick={handleLogout}>
            {user?.isGuest ? 'Exit Guest' : 'Sign out'}
          </button>
        </div>
      </header>

      {!plan || plan.days.length === 0 ? (
        <div className="plan-empty">
          <p>No workout plan yet.</p>
          <button className="btn-primary" onClick={handleRegenerate}>
            Generate My Plan
          </button>
        </div>
      ) : (
        <>
          <p className="plan-hint">Drag exercises between days to customise your plan</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="plan-grid">
              {plan.days.map(day => (
                <DroppableDay key={day.day} day={day}>
                  <div className="day-header">
                    <div>
                      <span className="day-number">Day {day.day}</span>
                      <span className="day-focus">{day.focus}</span>
                    </div>
                    <button
                      className="btn-start"
                      onClick={() => navigate(`/session/${day.day}`)}
                    >
                      ▶ Start
                    </button>
                  </div>
                  <SortableContext
                    items={day.workouts.map(w => w.uid)}
                    strategy={verticalListSortingStrategy}
                  >
                    {day.workouts.map(exercise => (
                      <ExerciseCard key={exercise.uid} exercise={exercise} />
                    ))}
                  </SortableContext>
                  {day.workouts.length === 0 && (
                    <p className="day-empty">Drop exercises here</p>
                  )}
                </DroppableDay>
              ))}
            </div>
            <DragOverlay>
              {activeExercise && (
                <ExerciseCard exercise={activeExercise} overlay />
              )}
            </DragOverlay>
          </DndContext>
        </>
      )}
    </div>
  );
};

export { WorkoutPlan };
