import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { Index } from '../Index/Index';
import { Register } from '../Register/Register';
import { GuestSetup } from '../GuestSetup/GuestSetup';
import { WorkoutPlan } from '../WorkoutPlan/WorkoutPlan';
import { WorkoutSession } from '../WorkoutSession/WorkoutSession';
import { EditProfile } from '../EditProfile/EditProfile';
import './App.css';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Index /> : <Navigate to="/plan" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/plan" />} />
        <Route path="/guest-setup" element={!user ? <GuestSetup /> : <Navigate to="/plan" />} />
        <Route path="/plan" element={user ? <WorkoutPlan /> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/session/:day" element={user ? <WorkoutSession /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? '/plan' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
};

export { App };