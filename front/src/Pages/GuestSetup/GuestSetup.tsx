import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import type { GuestSetupData } from "../../Context/AuthContext";
import { useWorkout } from "../../Context/WorkoutContext";
import { generateWorkoutPlan } from "../../Logic/PlanGenerator";
import { SetupForm } from "../../Components/SetupForm/SetupForm";
import "./GuestSetup.css";

const GuestSetup = () => {
  const { continueAsGuest } = useAuth();
  const { savePlan, exercises } = useWorkout();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<GuestSetupData>({
    weight: 70,
    birthday: "",
    gender: "male",
    hasWeights: false,
    goal: "muscle_growth",
    frequency: 3,
    sessionLength: 30,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      continueAsGuest(form);
      const guestProfile = {
        _id: "guest",
        username: "Guest",
        isGuest: true as const,
        ...form,
      };
      const plan = generateWorkoutPlan(guestProfile, exercises);
      await savePlan(plan);
      navigate("/plan");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof GuestSetupData, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card reg-card">
        <div className="auth-logo">🏋️</div>
        <h1 className="auth-title">Quick Setup</h1>
        <p className="auth-subtitle">
          Tell us about yourself to build your plan — no account needed
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <SetupForm values={form} onChange={handleFormChange} />
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Building your plan..." : "Get My Plan"}
          </button>
        </form>
        <p className="auth-switch">
          Want to save your progress?{" "}
          <Link to="/register">Create an account</Link>
        </p>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export { GuestSetup };
