import type { Exercise } from "../types/Exercise";

export const exercises: Exercise[] = [
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Triceps", "Anterior Deltoid"],
    instructions: [
      "Lie flat on the bench with your eyes under the bar.",
      "Grip the bar slightly wider than shoulder width.",
      "Lower the bar toward the middle of your chest.",
      "Press the bar upward until your arms are extended.",
    ],
  },

  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Upper Chest"],
    secondaryMuscles: ["Triceps", "Anterior Deltoid"],
    instructions: [
      "Set the bench to a moderate incline.",
      "Hold a dumbbell in each hand at chest level.",
      "Press the dumbbells upward while maintaining control.",
      "Lower them slowly until you feel a stretch in your chest.",
    ],
  },

  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "Back",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: ["Biceps", "Rear Deltoid"],
    instructions: [
      "Sit comfortably with your thighs secured under the pads.",
      "Grip the bar slightly wider than shoulder width.",
      "Pull the bar toward your upper chest.",
      "Slowly return the bar to the starting position.",
    ],
  },

  {
    id: "seated-cable-row",
    name: "Seated Cable Row",
    muscleGroup: "Back",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Rhomboids", "Middle Trapezius"],
    secondaryMuscles: ["Latissimus Dorsi", "Biceps"],
    instructions: [
      "Sit upright with your feet secured.",
      "Grip the handle with your arms extended.",
      "Pull the handle toward your torso.",
      "Squeeze your shoulder blades together.",
      "Return to the starting position under control.",
    ],
  },

  {
    id: "shoulder-press",
    name: "Dumbbell Shoulder Press",
    muscleGroup: "Shoulders",
    equipment: "Dumbbell",
    category: "Strength",
    primaryMuscles: ["Anterior Deltoid", "Lateral Deltoid"],
    secondaryMuscles: ["Triceps"],
    instructions: [
      "Hold the dumbbells at shoulder height.",
      "Brace your core and keep your back stable.",
      "Press both dumbbells overhead.",
      "Lower them slowly back to shoulder height.",
    ],
  },

  {
    id: "lateral-raise",
    name: "Dumbbell Lateral Raise",
    muscleGroup: "Shoulders",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Lateral Deltoid"],
    secondaryMuscles: ["Anterior Deltoid"],
    instructions: [
      "Stand with a dumbbell in each hand.",
      "Keep a slight bend in your elbows.",
      "Raise your arms outward until approximately shoulder height.",
      "Lower the dumbbells slowly.",
    ],
  },

  {
    id: "bicep-curl",
    name: "Dumbbell Bicep Curl",
    muscleGroup: "Biceps",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Biceps Brachii"],
    secondaryMuscles: ["Brachialis"],
    instructions: [
      "Stand with your arms hanging naturally.",
      "Keep your elbows close to your torso.",
      "Curl the dumbbells toward your shoulders.",
      "Lower the dumbbells under control.",
    ],
  },

  {
    id: "tricep-pushdown",
    name: "Cable Tricep Pushdown",
    muscleGroup: "Triceps",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Triceps"],
    secondaryMuscles: [],
    instructions: [
      "Stand facing the cable machine.",
      "Grip the attachment with your elbows close to your sides.",
      "Push the handle downward until your arms are extended.",
      "Return to the starting position slowly.",
    ],
  },

  {
    id: "barbell-squat",
    name: "Barbell Back Squat",
    muscleGroup: "Quads",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: ["Quadriceps"],
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    instructions: [
      "Position the bar securely across your upper back.",
      "Brace your core and unrack the bar.",
      "Descend by bending your knees and hips.",
      "Drive through your feet to return to standing.",
    ],
  },

  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscleGroup: "Hamstrings",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: ["Hamstrings"],
    secondaryMuscles: ["Glutes", "Lower Back"],
    instructions: [
      "Stand with the bar close to your thighs.",
      "Push your hips backward while keeping your back neutral.",
      "Lower the bar along your legs.",
      "Drive your hips forward to return to standing.",
    ],
  },

  {
    id: "bodyweight-squat",
    name: "Bodyweight Squat",
    muscleGroup: "Quads",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Quadriceps"],
    secondaryMuscles: ["Glutes", "Hamstrings"],
    instructions: [
      "Stand with your feet around shoulder width.",
      "Brace your core.",
      "Lower your hips while keeping your chest upright.",
      "Drive through your feet to stand.",
    ],
  },

  {
    id: "glute-bridge",
    name: "Glute Bridge",
    muscleGroup: "Glutes",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings"],
    instructions: [
      "Lie on your back with your knees bent.",
      "Place your feet flat on the floor.",
      "Drive your hips upward.",
      "Squeeze your glutes at the top.",
      "Lower your hips under control.",
    ],
  },

  {
    id: "plank",
    name: "Plank",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Rectus Abdominis", "Transverse Abdominis"],
    secondaryMuscles: ["Obliques"],
    instructions: [
      "Place your forearms on the floor.",
      "Extend your legs behind you.",
      "Keep your body in a straight line.",
      "Brace your core and hold the position.",
    ],
  },
];