import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './Context/AuthContext';
import { WorkoutProvider } from './Context/WorkoutContext';
import { App } from './Pages/App/App';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
    </AuthProvider>
  </StrictMode>
);
