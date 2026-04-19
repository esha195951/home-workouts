import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Exercise } from '../../types';
import './ExerciseCard.css';

interface ExerciseCardProps {
  exercise: Exercise;
  overlay?: boolean;
}

const ExerciseCard = ({ exercise, overlay = false }: ExerciseCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: exercise.uid,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`exercise-card ${isDragging ? 'exercise-card--dragging' : ''} ${overlay ? 'exercise-card--overlay' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="ec-drag-handle">⠿</div>
      <div className="ec-body">
        <span className="ec-name">{exercise.name.replace(/_/g, ' ')}</span>
        <div className="ec-meta">
          <span className="ec-group">{exercise.muscle_group.replace(/_/g, ' ')}</span>
          <span className="ec-dur">{exercise.durationMinutes} min</span>
        </div>
        {exercise.muscles && exercise.muscles.length > 0 && (
          <div className="ec-muscles">
            {exercise.muscles.map(m => (
              <span key={m} className="ec-muscle-chip">{m}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { ExerciseCard };
