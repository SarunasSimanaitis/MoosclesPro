import type { Exercise } from "../types/Exercise";

export const exercises: Exercise[] = [
  // ─────────────────────────────
  // CHEST
  // ─────────────────────────────

  {
    id: "barbell-bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: [
      "Anterior Deltoid",
      "Triceps",
    ],
    instructions: [
      "Lie flat on the bench with your eyes under the bar.",
      "Grip the bar slightly wider than shoulder width.",
      "Unrack the bar and position it above your chest.",
      "Lower the bar with control toward the lower chest.",
      "Press the bar upward until your arms are extended.",
    ],
  },

  {
    id: "incline-barbell-bench-press",
    name: "Incline Barbell Bench Press",
    muscleGroup: "Chest",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: [
      "Upper Pectoralis Major",
    ],
    secondaryMuscles: [
      "Anterior Deltoid",
      "Triceps",
    ],
    instructions: [
      "Set the bench to a moderate incline.",
      "Lie back and grip the bar slightly wider than shoulder width.",
      "Lower the bar toward your upper chest.",
      "Press the bar upward while maintaining control.",
    ],
  },

  {
    id: "dumbbell-bench-press",
    name: "Dumbbell Bench Press",
    muscleGroup: "Chest",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: [
      "Anterior Deltoid",
      "Triceps",
    ],
    instructions: [
      "Lie on a flat bench holding a dumbbell in each hand.",
      "Start with the dumbbells above your chest.",
      "Lower them under control.",
      "Press them back upward.",
    ],
  },

  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: [
      "Upper Pectoralis Major",
    ],
    secondaryMuscles: [
      "Anterior Deltoid",
      "Triceps",
    ],
    instructions: [
      "Set a bench to an incline.",
      "Hold dumbbells at chest level.",
      "Press them upward while keeping your shoulders stable.",
      "Lower them slowly back to the starting position.",
    ],
  },

  {
    id: "cable-chest-fly",
    name: "Cable Chest Fly",
    muscleGroup: "Chest",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Anterior Deltoid"],
    instructions: [
      "Set the cable handles around chest height.",
      "Take a stable stance and hold one handle in each hand.",
      "Bring your hands together in front of your chest.",
      "Slowly return to the starting position.",
    ],
  },

  // ─────────────────────────────
  // BACK
  // ─────────────────────────────

  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "Back",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: [
      "Biceps",
      "Teres Major",
    ],
    instructions: [
      "Grip the bar slightly wider than shoulder width.",
      "Sit down and brace your torso.",
      "Pull the bar toward your upper chest.",
      "Squeeze your back at the bottom.",
      "Return the bar under control.",
    ],
  },

  {
    id: "barbell-bent-over-row",
    name: "Barbell Bent-Over Row",
    muscleGroup: "Back",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: [
      "Latissimus Dorsi",
      "Rhomboids",
    ],
    secondaryMuscles: [
      "Biceps",
      "Rear Deltoid",
      "Trapezius",
    ],
    instructions: [
      "Stand with your feet around hip width apart.",
      "Hinge forward while keeping your back stable.",
      "Pull the bar toward your lower ribs.",
      "Lower the bar under control.",
    ],
  },

  {
    id: "seated-cable-row",
    name: "Seated Cable Row",
    muscleGroup: "Back",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: [
      "Latissimus Dorsi",
      "Rhomboids",
    ],
    secondaryMuscles: [
      "Biceps",
      "Trapezius",
    ],
    instructions: [
      "Sit upright with your feet supported.",
      "Grab the cable handle.",
      "Pull the handle toward your torso.",
      "Squeeze your shoulder blades together.",
      "Return the handle slowly.",
    ],
  },

  {
    id: "one-arm-dumbbell-row",
    name: "One-Arm Dumbbell Row",
    muscleGroup: "Back",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: [
      "Rhomboids",
      "Biceps",
      "Rear Deltoid",
    ],
    instructions: [
      "Support one hand and knee on a bench.",
      "Hold the dumbbell with the opposite hand.",
      "Pull the dumbbell toward your hip.",
      "Lower it under control.",
    ],
  },

  // ─────────────────────────────
  // SHOULDERS
  // ─────────────────────────────

  {
    id: "dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    muscleGroup: "Shoulders",
    equipment: "Dumbbell",
    category: "Strength",
    primaryMuscles: [
      "Anterior Deltoid",
      "Lateral Deltoid",
    ],
    secondaryMuscles: ["Triceps"],
    instructions: [
      "Sit upright with a dumbbell in each hand.",
      "Start with the dumbbells at shoulder height.",
      "Press them overhead.",
      "Lower them under control.",
    ],
  },

  {
    id: "barbell-overhead-press",
    name: "Barbell Overhead Press",
    muscleGroup: "Shoulders",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: [
      "Anterior Deltoid",
      "Lateral Deltoid",
    ],
    secondaryMuscles: [
      "Triceps",
      "Upper Chest",
    ],
    instructions: [
      "Stand with the bar at shoulder height.",
      "Brace your core.",
      "Press the bar overhead.",
      "Lower it back to your shoulders under control.",
    ],
  },

  {
    id: "dumbbell-lateral-raise",
    name: "Dumbbell Lateral Raise",
    muscleGroup: "Shoulders",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: [
      "Lateral Deltoid",
    ],
    secondaryMuscles: [
      "Supraspinatus",
    ],
    instructions: [
      "Stand holding dumbbells at your sides.",
      "Raise your arms outward.",
      "Stop around shoulder height.",
      "Lower the dumbbells slowly.",
    ],
  },

  {
    id: "cable-lateral-raise",
    name: "Cable Lateral Raise",
    muscleGroup: "Shoulders",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: [
      "Lateral Deltoid",
    ],
    secondaryMuscles: [],
    instructions: [
      "Stand beside a low cable pulley.",
      "Hold the handle with the opposite hand.",
      "Raise your arm outward.",
      "Lower it slowly.",
    ],
  },

  // ─────────────────────────────
  // BICEPS
  // ─────────────────────────────

  {
    id: "dumbbell-bicep-curl",
    name: "Dumbbell Bicep Curl",
    muscleGroup: "Biceps",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Biceps Brachii"],
    secondaryMuscles: [
      "Brachialis",
      "Brachioradialis",
    ],
    instructions: [
      "Stand with your arms at your sides.",
      "Curl the dumbbells toward your shoulders.",
      "Keep your elbows close to your torso.",
      "Lower the weights slowly.",
    ],
  },

  {
    id: "barbell-curl",
    name: "Barbell Curl",
    muscleGroup: "Biceps",
    equipment: "Barbell",
    category: "Hypertrophy",
    primaryMuscles: ["Biceps Brachii"],
    secondaryMuscles: [
      "Brachialis",
      "Brachioradialis",
    ],
    instructions: [
      "Stand holding the bar with an underhand grip.",
      "Keep your elbows near your sides.",
      "Curl the bar toward your shoulders.",
      "Lower it slowly.",
    ],
  },

  {
    id: "hammer-curl",
    name: "Hammer Curl",
    muscleGroup: "Biceps",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: [
      "Brachialis",
      "Brachioradialis",
    ],
    secondaryMuscles: [
      "Biceps Brachii",
    ],
    instructions: [
      "Hold dumbbells with a neutral grip.",
      "Keep your elbows close to your torso.",
      "Curl the dumbbells upward.",
      "Lower them under control.",
    ],
  },

  // ─────────────────────────────
  // TRICEPS
  // ─────────────────────────────

  {
    id: "cable-tricep-pushdown",
    name: "Cable Tricep Pushdown",
    muscleGroup: "Triceps",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Triceps"],
    secondaryMuscles: [],
    instructions: [
      "Stand facing the cable machine.",
      "Grip the attachment.",
      "Keep your elbows close to your sides.",
      "Push the handle downward.",
      "Return slowly.",
    ],
  },

  {
    id: "overhead-dumbbell-tricep-extension",
    name: "Overhead Dumbbell Tricep Extension",
    muscleGroup: "Triceps",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Triceps"],
    secondaryMuscles: [],
    instructions: [
      "Hold one dumbbell overhead.",
      "Lower it behind your head.",
      "Extend your elbows to raise the dumbbell.",
      "Repeat under control.",
    ],
  },

  // ─────────────────────────────
  // QUADRICEPS
  // ─────────────────────────────

  {
    id: "barbell-back-squat",
    name: "Barbell Back Squat",
    muscleGroup: "Quadriceps",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: [
      "Quadriceps",
      "Gluteus Maximus",
    ],
    secondaryMuscles: [
      "Hamstrings",
      "Adductors",
      "Core",
    ],
    instructions: [
      "Position the bar securely across your upper back.",
      "Brace your core.",
      "Bend your knees and hips to lower yourself.",
      "Drive through your feet to stand.",
    ],
  },

  {
    id: "leg-press",
    name: "Leg Press",
    muscleGroup: "Quadriceps",
    equipment: "Machine",
    category: "Strength",
    primaryMuscles: [
      "Quadriceps",
      "Gluteus Maximus",
    ],
    secondaryMuscles: [
      "Hamstrings",
    ],
    instructions: [
      "Sit securely in the machine.",
      "Place your feet on the platform.",
      "Lower the platform under control.",
      "Press through your feet to return.",
    ],
  },

  {
    id: "leg-extension",
    name: "Leg Extension",
    muscleGroup: "Quadriceps",
    equipment: "Machine",
    category: "Hypertrophy",
    primaryMuscles: ["Quadriceps"],
    secondaryMuscles: [],
    instructions: [
      "Sit with your knees aligned with the machine pivot.",
      "Extend your legs.",
      "Squeeze your quadriceps.",
      "Lower the weight slowly.",
    ],
  },

  // ─────────────────────────────
  // HAMSTRINGS
  // ─────────────────────────────

  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscleGroup: "Hamstrings",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: [
      "Hamstrings",
      "Gluteus Maximus",
    ],
    secondaryMuscles: [
      "Erector Spinae",
      "Adductors",
    ],
    instructions: [
      "Stand holding the bar close to your thighs.",
      "Push your hips backward.",
      "Lower the bar while maintaining a stable back.",
      "Drive your hips forward to stand.",
    ],
  },

  {
    id: "lying-leg-curl",
    name: "Lying Leg Curl",
    muscleGroup: "Hamstrings",
    equipment: "Machine",
    category: "Hypertrophy",
    primaryMuscles: ["Hamstrings"],
    secondaryMuscles: ["Calves"],
    instructions: [
      "Lie face down on the machine.",
      "Position your ankles under the pad.",
      "Curl your heels toward your glutes.",
      "Lower the weight slowly.",
    ],
  },

  // ─────────────────────────────
  // GLUTES
  // ─────────────────────────────

  {
    id: "barbell-hip-thrust",
    name: "Barbell Hip Thrust",
    muscleGroup: "Glutes",
    equipment: "Barbell",
    category: "Hypertrophy",
    primaryMuscles: [
      "Gluteus Maximus",
    ],
    secondaryMuscles: [
      "Hamstrings",
      "Adductors",
    ],
    instructions: [
      "Position your upper back against a bench.",
      "Place the bar across your hips.",
      "Drive your hips upward.",
      "Squeeze your glutes at the top.",
      "Lower under control.",
    ],
  },

  {
    id: "glute-kickback",
    name: "Cable Glute Kickback",
    muscleGroup: "Glutes",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: [
      "Gluteus Maximus",
    ],
    secondaryMuscles: [
      "Hamstrings",
    ],
    instructions: [
      "Attach the cable to your ankle.",
      "Brace yourself against the machine.",
      "Extend your leg backward.",
      "Return slowly.",
    ],
  },

  // ─────────────────────────────
  // CALVES
  // ─────────────────────────────

  {
    id: "standing-calf-raise",
    name: "Standing Calf Raise",
    muscleGroup: "Calves",
    equipment: "Machine",
    category: "Hypertrophy",
    primaryMuscles: [
      "Gastrocnemius",
    ],
    secondaryMuscles: [
      "Soleus",
    ],
    instructions: [
      "Position your shoulders under the machine pads.",
      "Rise onto the balls of your feet.",
      "Pause at the top.",
      "Lower your heels slowly.",
    ],
  },

  // ─────────────────────────────
  // CORE
  // ─────────────────────────────

  {
    id: "cable-crunch",
    name: "Cable Crunch",
    muscleGroup: "Core",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: [
      "Rectus Abdominis",
    ],
    secondaryMuscles: [
      "Obliques",
    ],
    instructions: [
      "Kneel facing the cable machine.",
      "Hold the rope near your head.",
      "Curl your torso downward.",
      "Return slowly.",
    ],
  },

  {
    id: "plank",
    name: "Plank",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: [
      "Rectus Abdominis",
      "Transverse Abdominis",
    ],
    secondaryMuscles: [
      "Obliques",
      "Glutes",
      "Shoulders",
    ],
    instructions: [
      "Place your forearms on the ground.",
      "Extend your legs behind you.",
      "Keep your body in a straight line.",
      "Brace your core and hold the position.",
    ],
  },

  {
    id: "hanging-knee-raise",
    name: "Hanging Knee Raise",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: [
      "Rectus Abdominis",
    ],
    secondaryMuscles: [
      "Hip Flexors",
      "Obliques",
    ],
    instructions: [
      "Hang from a pull-up bar.",
      "Brace your core.",
      "Raise your knees toward your chest.",
      "Lower them under control.",
    ],
  },
];