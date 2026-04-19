export {Workouts};

type workoutType = {
  description: string;
  gender_recommendation: { male: number; female: number };
  requires_weight: boolean;
  weight_loss_recommended: number;
  muscle_growth_recommended: number;
  age_recommendation: { min: number; max: number };
  focus_group?: string;
  muscles?: string[];
}

const Workouts: { [key: string]: workoutType } = {
  bodyweight_squats: {
    description: "Bodyweight squats",
    gender_recommendation: { male: 90, female: 90 },
    requires_weight: false,
    weight_loss_recommended: 40,
    muscle_growth_recommended: 80,
    age_recommendation: { min: 16, max: 80 },
    focus_group: "legs",
    muscles: ["quads", "glutes", "hamstrings"]
  },
  weighted_squats: {
    description: "Weighted squats",
    gender_recommendation: { male: 90, female: 90 },
    requires_weight: true,
    weight_loss_recommended: 40,
    muscle_growth_recommended: 80,
    age_recommendation: { min: 16, max: 80 },
    focus_group: "legs",
    muscles: ["quads", "glutes", "hamstrings"]
  },
  jumping_jacks: {
    description: "Cardio bodyweight exercise",
    gender_recommendation: { male: 80, female: 80 },
    requires_weight: false,
    weight_loss_recommended: 90,
    muscle_growth_recommended: 30,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "weight_loss"
  },
  push_ups: {
    description: "Upper-body bodyweight strength exercise",
    gender_recommendation: { male: 85, female: 90 },
    requires_weight: false,
    weight_loss_recommended: 65,
    muscle_growth_recommended: 80,
    age_recommendation: { min: 14, max: 80 },
    focus_group: "upper_body",
    muscles: ["chest", "triceps", "shoulders"]
  },
  dumbbell_rows: {
    description: "Weighted back exercise with dumbbells",
    gender_recommendation: { male: 80, female: 75 },
    requires_weight: true,
    weight_loss_recommended: 35,
    muscle_growth_recommended: 85,
    age_recommendation: { min: 16, max: 70 },
    focus_group: "back",
    muscles: ["lats", "biceps", "upper back"]
  },
  burpees: {
    description: "Full-body high-intensity bodyweight exercise",
    gender_recommendation: { male: 85, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 95,
    muscle_growth_recommended: 60,
    age_recommendation: { min: 14, max: 70 },
    focus_group: "weight_loss"
  },
  bodyweight_lunges: {
    description: "Leg strength exercise using bodyweight for resistance",
    gender_recommendation: { male: 85, female: 90 },
    requires_weight: false,
    weight_loss_recommended: 70,
    muscle_growth_recommended: 75,
    age_recommendation: { min: 14, max: 80 },
    focus_group: "legs",
    muscles: ["quads", "glutes", "hamstrings"]
  },
  weighted_lunges: {
    description: "Leg strength exercise using dumbbells for resistance",
    gender_recommendation: { male: 85, female: 90 },
    requires_weight: true,
    weight_loss_recommended: 70,
    muscle_growth_recommended: 75,
    age_recommendation: { min: 14, max: 80 },
    focus_group: "legs",
    muscles: ["quads", "glutes", "hamstrings"]
  },
  plank: {
    description: "Core stability bodyweight exercise",
    gender_recommendation: { male: 80, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 50,
    muscle_growth_recommended: 55,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "core",
    muscles: ["abs", "obliques", "lower back"]
  },
  mountain_climbers: {
    description: "High-intensity cardio and core bodyweight movement",
    gender_recommendation: { male: 85, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 92,
    muscle_growth_recommended: 45,
    age_recommendation: { min: 14, max: 75 },
    focus_group: "weight_loss"
  },
  kettlebell_swings: {
    description: "Explosive hip hinge movement with kettlebell",
    gender_recommendation: { male: 75, female: 80 },
    requires_weight: true,
    weight_loss_recommended: 88,
    muscle_growth_recommended: 70,
    age_recommendation: { min: 18, max: 65 },
    focus_group: "posterior_chain",
    muscles: ["glutes", "hamstrings", "lower back"]
  },
  bench_press: {
    description: "Chest and triceps strength exercise with barbell or dumbbells",
    gender_recommendation: { male: 85, female: 80 },
    requires_weight: true,
    weight_loss_recommended: 30,
    muscle_growth_recommended: 90,
    age_recommendation: { min: 16, max: 70 },
    focus_group: "chest",
    muscles: ["chest", "triceps", "front delts"]
  },
  deadlifts: {
    description: "Full-body strength exercise using a barbell or dumbbells",
    gender_recommendation: { male: 90, female: 85 },
    requires_weight: true,
    weight_loss_recommended: 55,
    muscle_growth_recommended: 95,
    age_recommendation: { min: 16, max: 70 },
    focus_group: "posterior_chain",
    muscles: ["glutes", "hamstrings", "lower back"]
  },
  overhead_press: {
    description: "Shoulder strength exercise with barbell or dumbbells",
    gender_recommendation: { male: 80, female: 80 },
    requires_weight: true,
    weight_loss_recommended: 30,
    muscle_growth_recommended: 85,
    age_recommendation: { min: 16, max: 70 },
    focus_group: "shoulders",
    muscles: ["delts", "triceps", "upper chest"]
  },
  bicycle_crunches: {
    description: "Core exercise for abdominal strength and endurance",
    gender_recommendation: { male: 80, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 75,
    muscle_growth_recommended: 45,
    age_recommendation: { min: 12, max: 75 },
    focus_group: "core",
    muscles: ["abs", "obliques"]
  },
  jump_rope: {
    description: "Cardio conditioning exercise with a jump rope",
    gender_recommendation: { male: 85, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 95,
    muscle_growth_recommended: 25,
    age_recommendation: { min: 12, max: 75 },
    focus_group: "weight_loss"
  },
  wall_sit: {
    description: "Static quad endurance bodyweight exercise",
    gender_recommendation: { male: 80, female: 80 },
    requires_weight: false,
    weight_loss_recommended: 45,
    muscle_growth_recommended: 50,
    age_recommendation: { min: 12, max: 75 },
    focus_group: "legs",
    muscles: ["quads", "glutes"]
  },
  step_ups: {
    description: "Leg power exercise using a bench or step",
    gender_recommendation: { male: 85, female: 90 },
    requires_weight: true,
    weight_loss_recommended: 75,
    muscle_growth_recommended: 70,
    age_recommendation: { min: 14, max: 80 },
    focus_group: "legs",
    muscles: ["quads", "glutes", "calves"]
  },
  tricep_dips: {
    description: "Bodyweight upper-body exercise for triceps and chest",
    gender_recommendation: { male: 80, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 60,
    muscle_growth_recommended: 70,
    age_recommendation: { min: 14, max: 75 },
    focus_group: "upper_body",
    muscles: ["triceps", "chest", "shoulders"]
  },
  high_knees: {
    description: "Bodyweight cardio sprinting motion to boost heart rate",
    gender_recommendation: { male: 85, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 90,
    muscle_growth_recommended: 35,
    age_recommendation: { min: 12, max: 70 },
    focus_group: "weight_loss"
  },
  glute_bridges: {
    description: "Glute and hamstring bodyweight strength exercise",
    gender_recommendation: { male: 75, female: 90 },
    requires_weight: false,
    weight_loss_recommended: 55,
    muscle_growth_recommended: 65,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "legs",
    muscles: ["glutes", "hamstrings"]
  },
  side_plank: {
    description: "Oblique core stability exercise",
    gender_recommendation: { male: 75, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 50,
    muscle_growth_recommended: 50,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "core",
    muscles: ["obliques", "abs"]
  },
  bodyweight_hip_thrusts: {
    description: "Bodyweight glute bridge variation for hip strength",
    gender_recommendation: { male: 80, female: 90 },
    requires_weight: false,
    weight_loss_recommended: 50,
    muscle_growth_recommended: 70,
    age_recommendation: { min: 16, max: 75 },
    focus_group: "legs",
    muscles: ["glutes", "hamstrings"]
  },
  weighted_hip_thrusts: {
    description: "Weighted glute bridge variation using dumbbells or a barbell",
    gender_recommendation: { male: 80, female: 90 },
    requires_weight: true,
    weight_loss_recommended: 55,
    muscle_growth_recommended: 80,
    age_recommendation: { min: 16, max: 75 },
    focus_group: "legs",
    muscles: ["glutes", "hamstrings"]
  },
  lat_pull_downs: {
    description: "Back strength exercise with cable or bands",
    gender_recommendation: { male: 80, female: 80 },
    requires_weight: true,
    weight_loss_recommended: 40,
    muscle_growth_recommended: 85,
    age_recommendation: { min: 14, max: 75 },
    focus_group: "back",
    muscles: ["lats", "biceps", "upper back"]
  },
  tricep_extensions: {
    description: "Isolated triceps exercise with dumbbell or cable",
    gender_recommendation: { male: 80, female: 80 },
    requires_weight: true,
    weight_loss_recommended: 30,
    muscle_growth_recommended: 75,
    age_recommendation: { min: 14, max: 75 },
    focus_group: "upper_body",
    muscles: ["triceps"]
  },
  chair_squats: {
    description: "Bodyweight squat variation using a chair for support",
    gender_recommendation: { male: 45, female: 90 },
    requires_weight: false,
    weight_loss_recommended: 55,
    muscle_growth_recommended: 65,
    age_recommendation: { min: 14, max: 80 },
    focus_group: "legs",
    muscles: ["quads", "glutes", "hamstrings"]
  },
  wall_push_ups: {
    description: "Upper-body push exercise using a wall for low-impact strength",
    gender_recommendation: { male: 45, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 35,
    muscle_growth_recommended: 55,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "upper_body",
    muscles: ["chest", "triceps", "shoulders"]
  },
  resistance_band_rows: {
    description: "Back exercise using a resistance band anchored at home",
    gender_recommendation: { male: 75, female: 85 },
    requires_weight: true,
    weight_loss_recommended: 45,
    muscle_growth_recommended: 75,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "back",
    muscles: ["lats", "biceps", "upper back"]
  },
  reverse_lunges: {
    description: "Leg exercise stepping backward into a lunge for stability",
    gender_recommendation: { male: 45, female: 90 },
    requires_weight: true,
    weight_loss_recommended: 70,
    muscle_growth_recommended: 75,
    age_recommendation: { min: 14, max: 80 },
    focus_group: "legs",
    muscles: ["quads", "glutes", "hamstrings"]
  },
  seated_dumbbell_curls: {
    description: "Arm strength exercise sitting and curling dumbbells",
    gender_recommendation: { male: 80, female: 85 },
    requires_weight: true,
    weight_loss_recommended: 25,
    muscle_growth_recommended: 70,
    age_recommendation: { min: 14, max: 75 },
    focus_group: "upper_body",
    muscles: ["biceps"]
  },
  bird_dogs: {
    description: "Low-impact core and back stability exercise on hands and knees",
    gender_recommendation: { male: 75, female: 80 },
    requires_weight: false,
    weight_loss_recommended: 40,
    muscle_growth_recommended: 45,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "core",
    muscles: ["lower back", "abs", "glutes"]
  },
  russian_twists: {
    description: "Core rotational exercise for obliques and abs",
    gender_recommendation: { male: 80, female: 85 },
    requires_weight: true,
    weight_loss_recommended: 55,
    muscle_growth_recommended: 60,
    age_recommendation: { min: 14, max: 75 },
    focus_group: "core",
    muscles: ["obliques", "abs"]
  },
  bodyweight_calf_raises: {
    description: "Calf strengthening exercise using bodyweight only",
    gender_recommendation: { male: 80, female: 80 },
    requires_weight: false,
    weight_loss_recommended: 25,
    muscle_growth_recommended: 45,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "legs",
    muscles: ["calves"]
  },
  weighted_calf_raises: {
    description: "Calf strengthening exercise using dumbbells or other added weight",
    gender_recommendation: { male: 80, female: 80 },
    requires_weight: true,
    weight_loss_recommended: 30,
    muscle_growth_recommended: 55,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "legs",
    muscles: ["calves"]
  },
  bodyweight_glute_kickbacks: {
    description: "Glute isolation movement using bodyweight only",
    gender_recommendation: { male: 75, female: 90 },
    requires_weight: false,
    weight_loss_recommended: 40,
    muscle_growth_recommended: 60,
    age_recommendation: { min: 14, max: 80 },
    focus_group: "legs",
    muscles: ["glutes", "hamstrings"]
  },
  weighted_glute_kickbacks: {
    description: "Glute isolation movement using ankle weights or dumbbells",
    gender_recommendation: { male: 75, female: 90 },
    requires_weight: true,
    weight_loss_recommended: 45,
    muscle_growth_recommended: 65,
    age_recommendation: { min: 14, max: 80 },
    focus_group: "legs",
    muscles: ["glutes", "hamstrings"]
  },
  band_pull_aparts: {
    description: "Upper-back and shoulder exercise using a resistance band",
    gender_recommendation: { male: 80, female: 80 },
    requires_weight: true,
    weight_loss_recommended: 25,
    muscle_growth_recommended: 60,
    age_recommendation: { min: 12, max: 80 },
    focus_group: "shoulders",
    muscles: ["rear delts", "upper back", "traps"]
  },
  seated_shoulder_press: {
    description: "Shoulder exercise performed seated with dumbbells or cans",
    gender_recommendation: { male: 80, female: 85 },
    requires_weight: true,
    weight_loss_recommended: 25,
    muscle_growth_recommended: 80,
    age_recommendation: { min: 14, max: 75 },
    focus_group: "shoulders",
    muscles: ["delts", "triceps"]
  },
  squat_thrusts: {
    description: "Full-body bodyweight movement with a quick squat to plank transition",
    gender_recommendation: { male: 85, female: 85 },
    requires_weight: false,
    weight_loss_recommended: 90,
    muscle_growth_recommended: 50,
    age_recommendation: { min: 14, max: 75 },
    focus_group: "weight_loss"
  }
}
