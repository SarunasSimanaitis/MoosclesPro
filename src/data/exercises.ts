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
    id: "dumbbell-tricep-extension",
    name: "Dumbbell Tricep Extension",
    muscleGroup: "Triceps",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Triceps"],
    secondaryMuscles: [],
    instructions: [
      "Hold a dumbbell securely with both hands.",
      "Raise the dumbbell overhead with your arms extended.",
      "Lower the dumbbell behind your head under control.",
      "Keep your upper arms relatively still.",
      "Extend your elbows to return the dumbbell to the starting position.",
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
  // ─────────────────────────────
  // CHEST — ADDITIONAL
  // ─────────────────────────────

  {
    id: "decline-barbell-bench-press",
    name: "Decline Barbell Bench Press",
    muscleGroup: "Chest",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Triceps", "Anterior Deltoid"],
    instructions: [
      "Set up securely on a decline bench.",
      "Grip the bar slightly wider than shoulder width.",
      "Lower the bar toward the lower chest.",
      "Press the bar upward under control.",
    ],
  },

  {
    id: "machine-chest-press",
    name: "Machine Chest Press",
    muscleGroup: "Chest",
    equipment: "Machine",
    category: "Hypertrophy",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Triceps", "Anterior Deltoid"],
    instructions: [
      "Adjust the seat so the handles are around mid-chest height.",
      "Brace your torso against the pad.",
      "Press the handles forward.",
      "Return them under control.",
    ],
  },

  {
    id: "pec-deck",
    name: "Pec Deck",
    muscleGroup: "Chest",
    equipment: "Machine",
    category: "Hypertrophy",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Anterior Deltoid"],
    instructions: [
      "Adjust the machine so your arms are positioned comfortably.",
      "Brace your torso against the back pad.",
      "Bring the handles together.",
      "Return slowly while maintaining control.",
    ],
  },

  {
    id: "dumbbell-fly",
    name: "Dumbbell Fly",
    muscleGroup: "Chest",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Anterior Deltoid"],
    instructions: [
      "Lie on a flat bench with dumbbells above your chest.",
      "Lower the dumbbells outward with a slight bend in your elbows.",
      "Stop at a comfortable range of motion.",
      "Bring the dumbbells back together under control.",
    ],
  },

  {
    id: "push-up",
    name: "Push-Up",
    muscleGroup: "Chest",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Triceps", "Anterior Deltoid", "Core"],
    instructions: [
      "Place your hands slightly wider than shoulder width.",
      "Keep your body in a straight line.",
      "Lower your chest toward the floor.",
      "Press through your hands to return.",
    ],
  },

  {
    id: "close-grip-push-up",
    name: "Close-Grip Push-Up",
    muscleGroup: "Chest",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Triceps", "Pectoralis Major"],
    secondaryMuscles: ["Anterior Deltoid", "Core"],
    instructions: [
      "Place your hands closer together than a standard push-up.",
      "Brace your core and keep your body aligned.",
      "Lower your chest toward the floor.",
      "Press back up while keeping your elbows controlled.",
    ],
  },

  // ─────────────────────────────
  // BACK — ADDITIONAL
  // ─────────────────────────────

  {
    id: "pull-up",
    name: "Pull-Up",
    muscleGroup: "Back",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: ["Biceps", "Teres Major", "Core"],
    instructions: [
      "Grip the bar with an overhand grip.",
      "Brace your core and begin from a controlled hang.",
      "Pull your chest toward the bar.",
      "Lower yourself under control.",
    ],
  },

  {
    id: "chin-up",
    name: "Chin-Up",
    muscleGroup: "Back",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Latissimus Dorsi", "Biceps"],
    secondaryMuscles: ["Teres Major", "Core"],
    instructions: [
      "Grip the bar with your palms facing you.",
      "Brace your core.",
      "Pull your body upward.",
      "Lower yourself under control.",
    ],
  },

  {
    id: "assisted-pull-up",
    name: "Assisted Pull-Up",
    muscleGroup: "Back",
    equipment: "Machine",
    category: "Strength",
    primaryMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: ["Biceps", "Teres Major"],
    instructions: [
      "Set the assistance level appropriate for you.",
      "Grip the pull-up handles.",
      "Pull yourself upward while keeping your torso controlled.",
      "Lower slowly.",
    ],
  },

  {
    id: "chest-supported-row",
    name: "Chest-Supported Row",
    muscleGroup: "Back",
    equipment: "Machine",
    category: "Hypertrophy",
    primaryMuscles: ["Rhomboids", "Latissimus Dorsi"],
    secondaryMuscles: ["Biceps", "Rear Deltoid", "Trapezius"],
    instructions: [
      "Position your chest firmly against the pad.",
      "Grip the handles.",
      "Pull toward your torso.",
      "Lower the weight under control.",
    ],
  },

  {
    id: "dumbbell-rear-delt-row",
    name: "Dumbbell Rear Delt Row",
    muscleGroup: "Back",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Rear Deltoid"],
    secondaryMuscles: ["Rhomboids", "Trapezius"],
    instructions: [
      "Hinge forward while keeping your back stable.",
      "Hold the dumbbells with your arms hanging.",
      "Pull your elbows outward.",
      "Lower the dumbbells slowly.",
    ],
  },

  {
    id: "straight-arm-pulldown",
    name: "Straight-Arm Pulldown",
    muscleGroup: "Back",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: ["Teres Major", "Core"],
    instructions: [
      "Stand facing the cable machine.",
      "Hold the bar with your arms extended.",
      "Pull the bar toward your thighs.",
      "Return slowly while keeping your arms mostly straight.",
    ],
  },

  // ─────────────────────────────
  // SHOULDERS — ADDITIONAL
  // ─────────────────────────────

  {
    id: "machine-shoulder-press",
    name: "Machine Shoulder Press",
    muscleGroup: "Shoulders",
    equipment: "Machine",
    category: "Strength",
    primaryMuscles: ["Anterior Deltoid", "Lateral Deltoid"],
    secondaryMuscles: ["Triceps"],
    instructions: [
      "Adjust the seat so the handles begin around shoulder height.",
      "Brace your torso.",
      "Press the handles overhead.",
      "Lower them under control.",
    ],
  },

  {
    id: "dumbbell-front-raise",
    name: "Dumbbell Front Raise",
    muscleGroup: "Shoulders",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Anterior Deltoid"],
    secondaryMuscles: ["Upper Chest"],
    instructions: [
      "Hold dumbbells in front of your thighs.",
      "Raise your arms forward.",
      "Stop around shoulder height.",
      "Lower slowly.",
    ],
  },

  {
    id: "cable-rear-delt-fly",
    name: "Cable Rear Delt Fly",
    muscleGroup: "Shoulders",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Rear Deltoid"],
    secondaryMuscles: ["Rhomboids", "Trapezius"],
    instructions: [
      "Set the cables around shoulder height.",
      "Grab the opposite handles.",
      "Move your arms outward and backward.",
      "Return slowly.",
    ],
  },

  {
    id: "face-pull",
    name: "Face Pull",
    muscleGroup: "Shoulders",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Rear Deltoid"],
    secondaryMuscles: ["Trapezius", "Rotator Cuff"],
    instructions: [
      "Set a rope attachment around upper-chest or face height.",
      "Pull the rope toward your face.",
      "Rotate your hands outward as you pull.",
      "Return under control.",
    ],
  },

  // ─────────────────────────────
  // BICEPS — ADDITIONAL
  // ─────────────────────────────

  {
    id: "incline-dumbbell-curl",
    name: "Incline Dumbbell Curl",
    muscleGroup: "Biceps",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Biceps Brachii"],
    secondaryMuscles: ["Brachialis", "Brachioradialis"],
    instructions: [
      "Sit on an incline bench with your arms hanging.",
      "Curl the dumbbells without moving your upper arms.",
      "Squeeze the biceps at the top.",
      "Lower slowly.",
    ],
  },

  {
    id: "preacher-curl",
    name: "Preacher Curl",
    muscleGroup: "Biceps",
    equipment: "EZ Bar",
    category: "Hypertrophy",
    primaryMuscles: ["Biceps Brachii"],
    secondaryMuscles: ["Brachialis", "Brachioradialis"],
    instructions: [
      "Position your upper arms securely against the pad.",
      "Curl the bar toward your shoulders.",
      "Squeeze your biceps.",
      "Lower the weight under control.",
    ],
  },

  {
    id: "cable-bicep-curl",
    name: "Cable Bicep Curl",
    muscleGroup: "Biceps",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Biceps Brachii"],
    secondaryMuscles: ["Brachialis", "Brachioradialis"],
    instructions: [
      "Stand facing the cable machine.",
      "Hold the attachment with an underhand grip.",
      "Curl toward your shoulders.",
      "Return slowly.",
    ],
  },

  // ─────────────────────────────
  // TRICEPS — ADDITIONAL
  // ─────────────────────────────

  {
    id: "cable-overhead-tricep-extension",
    name: "Cable Overhead Tricep Extension",
    muscleGroup: "Triceps",
    equipment: "Cable",
    category: "Hypertrophy",
    primaryMuscles: ["Triceps"],
    secondaryMuscles: [],
    instructions: [
      "Face away from the cable machine.",
      "Hold the rope behind your head.",
      "Extend your elbows while keeping your upper arms controlled.",
      "Return slowly.",
    ],
  },

  {
    id: "tricep-dip",
    name: "Tricep Dip",
    muscleGroup: "Triceps",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Triceps"],
    secondaryMuscles: ["Pectoralis Major", "Anterior Deltoid"],
    instructions: [
      "Support your body on parallel bars.",
      "Keep your torso relatively upright.",
      "Bend your elbows to lower yourself.",
      "Press back up under control.",
    ],
  },

  {
    id: "dumbbell-kickback",
    name: "Dumbbell Tricep Kickback",
    muscleGroup: "Triceps",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Triceps"],
    secondaryMuscles: [],
    instructions: [
      "Hinge forward while keeping your back stable.",
      "Hold the dumbbells with your elbows bent.",
      "Extend your elbows backward.",
      "Return under control.",
    ],
  },

  // ─────────────────────────────
  // QUADRICEPS — ADDITIONAL

  {
    id: "bodyweight-squat",
    name: "Bodyweight Squat",
    muscleGroup: "Quadriceps",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Adductors", "Core"],
    instructions: [
      "Stand with your feet around shoulder width apart.",
      "Brace your core and keep your chest controlled.",
      "Bend your knees and hips to lower into a squat.",
      "Drive through your feet to return to standing.",
    ],
  },

  {
    id: "reverse-lunge",
    name: "Reverse Lunge",
    muscleGroup: "Quadriceps",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Calves", "Core"],
    instructions: [
      "Stand tall with your feet about hip width apart.",
      "Step one foot backward and lower into a controlled lunge.",
      "Keep your front foot stable and your torso controlled.",
      "Drive through the front foot to return to standing.",
    ],
  },

  {
    id: "split-squat",
    name: "Split Squat",
    muscleGroup: "Quadriceps",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Adductors", "Core"],
    instructions: [
      "Stand in a staggered stance with one foot in front.",
      "Brace your core and keep your torso controlled.",
      "Lower your body by bending both knees.",
      "Drive through the front foot to return to the starting position.",
    ],
  },
  // ─────────────────────────────

  {
    id: "front-squat",
    name: "Front Squat",
    muscleGroup: "Quadriceps",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: ["Quadriceps"],
    secondaryMuscles: ["Gluteus Maximus", "Adductors", "Core"],
    instructions: [
      "Position the bar securely across the front of your shoulders.",
      "Brace your core.",
      "Squat down while keeping your torso controlled.",
      "Drive through your feet to stand.",
    ],
  },

  {
    id: "bulgarian-split-squat",
    name: "Bulgarian Split Squat",
    muscleGroup: "Quadriceps",
    equipment: "Dumbbell",
    category: "Strength",
    primaryMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Adductors"],
    instructions: [
      "Place your rear foot on a bench.",
      "Position your front foot securely.",
      "Lower your body under control.",
      "Drive through the front foot to stand.",
    ],
  },

  {
    id: "goblet-squat",
    name: "Goblet Squat",
    muscleGroup: "Quadriceps",
    equipment: "Dumbbell",
    category: "Strength",
    primaryMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Adductors", "Core"],
    instructions: [
      "Hold a dumbbell close to your chest.",
      "Brace your core.",
      "Squat down while keeping your torso controlled.",
      "Stand by driving through your feet.",
    ],
  },

  {
    id: "dumbbell-lunge",
    name: "Dumbbell Lunge",
    muscleGroup: "Quadriceps",
    equipment: "Dumbbell",
    category: "Strength",
    primaryMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Calves"],
    instructions: [
      "Stand holding dumbbells at your sides.",
      "Step forward into a controlled lunge.",
      "Lower until both knees are comfortably bent.",
      "Push through the front foot to return.",
    ],
  },

  {
    id: "smith-machine-squat",
    name: "Smith Machine Squat",
    muscleGroup: "Quadriceps",
    equipment: "Smith Machine",
    category: "Strength",
    primaryMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Adductors", "Core"],
    instructions: [
      "Position yourself securely under the bar.",
      "Brace your core.",
      "Lower into a controlled squat.",
      "Drive upward through your feet.",
    ],
  },

  // ─────────────────────────────
  // HAMSTRINGS — ADDITIONAL
  // ─────────────────────────────

  {
    id: "seated-leg-curl",
    name: "Seated Leg Curl",
    muscleGroup: "Hamstrings",
    equipment: "Machine",
    category: "Hypertrophy",
    primaryMuscles: ["Hamstrings"],
    secondaryMuscles: ["Calves"],
    instructions: [
      "Adjust the machine so your knees align with the pivot.",
      "Position your legs securely.",
      "Curl your legs downward.",
      "Return slowly.",
    ],
  },

  {
    id: "dumbbell-romanian-deadlift",
    name: "Dumbbell Romanian Deadlift",
    muscleGroup: "Hamstrings",
    equipment: "Dumbbell",
    category: "Strength",
    primaryMuscles: ["Hamstrings", "Gluteus Maximus"],
    secondaryMuscles: ["Erector Spinae", "Adductors"],
    instructions: [
      "Hold dumbbells in front of your thighs.",
      "Push your hips backward.",
      "Lower the dumbbells while maintaining a stable back.",
      "Drive your hips forward to stand.",
    ],
  },

  {
    id: "good-morning",
    name: "Good Morning",
    muscleGroup: "Hamstrings",
    equipment: "Barbell",
    category: "Strength",
    primaryMuscles: ["Hamstrings", "Gluteus Maximus"],
    secondaryMuscles: ["Erector Spinae", "Adductors"],
    instructions: [
      "Position the bar securely across your upper back.",
      "Brace your core.",
      "Hinge at the hips while keeping your back stable.",
      "Drive your hips forward to return.",
    ],
  },

  // ─────────────────────────────
  // GLUTES — ADDITIONAL

  {
    id: "single-leg-glute-bridge",
    name: "Single-Leg Glute Bridge",
    muscleGroup: "Glutes",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Core"],
    instructions: [
      "Lie on your back with one knee bent and the other leg extended.",
      "Brace your core and keep your pelvis controlled.",
      "Drive through the planted foot to raise your hips.",
      "Squeeze your glutes at the top and lower slowly.",
    ],
  },
  // ─────────────────────────────

  {
    id: "dumbbell-hip-thrust",
    name: "Dumbbell Hip Thrust",
    muscleGroup: "Glutes",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Adductors"],
    instructions: [
      "Rest your upper back against a bench.",
      "Place a dumbbell across your hips.",
      "Drive your hips upward.",
      "Squeeze your glutes and lower under control.",
    ],
  },

  {
    id: "glute-bridge",
    name: "Glute Bridge",
    muscleGroup: "Glutes",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Core"],
    instructions: [
      "Lie on your back with your knees bent.",
      "Brace your core.",
      "Drive through your feet to raise your hips.",
      "Lower slowly.",
    ],
  },

  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    muscleGroup: "Glutes",
    equipment: "Kettlebell",
    category: "Strength",
    primaryMuscles: ["Gluteus Maximus", "Hamstrings"],
    secondaryMuscles: ["Core", "Erector Spinae"],
    instructions: [
      "Stand with the kettlebell slightly in front of you.",
      "Hinge at the hips and hike the kettlebell backward.",
      "Drive your hips forward explosively.",
      "Allow the kettlebell to swing to chest height.",
      "Control the descent into the next repetition.",
    ],
  },

  // ─────────────────────────────
  // CALVES — ADDITIONAL
  // ─────────────────────────────

  {
    id: "seated-calf-raise",
    name: "Seated Calf Raise",
    muscleGroup: "Calves",
    equipment: "Machine",
    category: "Hypertrophy",
    primaryMuscles: ["Soleus"],
    secondaryMuscles: ["Gastrocnemius"],
    instructions: [
      "Sit securely in the calf raise machine.",
      "Place the balls of your feet on the platform.",
      "Raise your heels as high as comfortable.",
      "Lower slowly into a controlled stretch.",
    ],
  },

  {
    id: "single-leg-calf-raise",
    name: "Single-Leg Calf Raise",
    muscleGroup: "Calves",
    equipment: "Bodyweight",
    category: "Hypertrophy",
    primaryMuscles: ["Gastrocnemius", "Soleus"],
    secondaryMuscles: [],
    instructions: [
      "Stand on one foot with support nearby.",
      "Lower your heel toward the floor.",
      "Rise onto the ball of your foot.",
      "Lower slowly.",
    ],
  },

  // ─────────────────────────────
  // FOREARMS
  // ─────────────────────────────

  {
    id: "wrist-curl",
    name: "Wrist Curl",
    muscleGroup: "Forearms",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Wrist Flexors"],
    secondaryMuscles: ["Forearm Muscles"],
    instructions: [
      "Rest your forearms on a bench or your thighs.",
      "Hold the dumbbells with your palms facing upward.",
      "Curl your wrists upward.",
      "Lower slowly.",
    ],
  },

  {
    id: "reverse-wrist-curl",
    name: "Reverse Wrist Curl",
    muscleGroup: "Forearms",
    equipment: "Dumbbell",
    category: "Hypertrophy",
    primaryMuscles: ["Wrist Extensors"],
    secondaryMuscles: ["Forearm Muscles"],
    instructions: [
      "Rest your forearms securely.",
      "Hold the dumbbells with your palms facing downward.",
      "Extend your wrists upward.",
      "Lower slowly.",
    ],
  },

  {
    id: "farmer-carry",
    name: "Farmer Carry",
    muscleGroup: "Forearms",
    equipment: "Dumbbell",
    category: "Strength",
    primaryMuscles: ["Forearms"],
    secondaryMuscles: ["Trapezius", "Core", "Glutes"],
    instructions: [
      "Hold a dumbbell in each hand.",
      "Stand tall with your shoulders controlled.",
      "Walk with steady, controlled steps.",
      "Maintain your posture throughout the carry.",
    ],
  },

  // ─────────────────────────────
  // CORE
  // ─────────────────────────────

  {
    id: "dead-bug",
    name: "Dead Bug",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Rectus Abdominis", "Transverse Abdominis"],
    secondaryMuscles: ["Hip Flexors"],
    instructions: [
      "Lie on your back with your arms raised and knees bent.",
      "Brace your core and keep your lower back controlled.",
      "Slowly extend the opposite arm and leg.",
      "Return to the starting position and alternate sides.",
    ],
  },

  {
    id: "side-plank",
    name: "Side Plank",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Obliques"],
    secondaryMuscles: ["Transverse Abdominis", "Glutes", "Shoulders"],
    instructions: [
      "Support yourself on one forearm.",
      "Stack or stagger your feet.",
      "Keep your body in a straight line.",
      "Brace your core and hold.",
    ],
  },

  {
    id: "bird-dog",
    name: "Bird Dog",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Mobility",
    primaryMuscles: ["Core"],
    secondaryMuscles: ["Glutes", "Shoulders", "Erector Spinae"],
    instructions: [
      "Start on your hands and knees.",
      "Brace your core.",
      "Extend the opposite arm and leg.",
      "Pause briefly and return under control.",
    ],
  },

  {
    id: "reverse-crunch",
    name: "Reverse Crunch",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Hypertrophy",
    primaryMuscles: ["Rectus Abdominis"],
    secondaryMuscles: ["Hip Flexors"],
    instructions: [
      "Lie on your back with your knees bent.",
      "Brace your core.",
      "Curl your pelvis toward your ribcage.",
      "Lower your legs under control.",
    ],
  },

  {
    id: "lying-leg-raise",
    name: "Lying Leg Raise",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Rectus Abdominis"],
    secondaryMuscles: ["Hip Flexors"],
    instructions: [
      "Lie flat on your back.",
      "Brace your core.",
      "Raise your legs while keeping your lower back controlled.",
      "Lower them slowly.",
    ],
  },

  {
    id: "hollow-body-hold",
    name: "Hollow Body Hold",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Strength",
    primaryMuscles: ["Rectus Abdominis", "Transverse Abdominis"],
    secondaryMuscles: ["Hip Flexors"],
    instructions: [
      "Lie on your back.",
      "Brace your core and press your lower back toward the floor.",
      "Lift your shoulders and legs slightly from the ground.",
      "Hold while maintaining control.",
    ],
  },

  {
    id: "pallof-press",
    name: "Pallof Press",
    muscleGroup: "Core",
    equipment: "Cable",
    category: "Strength",
    primaryMuscles: ["Obliques", "Transverse Abdominis"],
    secondaryMuscles: ["Rectus Abdominis", "Shoulders"],
    instructions: [
      "Stand sideways to the cable machine.",
      "Hold the handle at your chest.",
      "Brace your core.",
      "Press the handle straight forward without rotating.",
      "Return to your chest.",
    ],
  },

  {
    id: "mountain-climber",
    name: "Mountain Climber",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Cardio",
    primaryMuscles: ["Core"],
    secondaryMuscles: ["Shoulders", "Hip Flexors", "Quadriceps"],
    instructions: [
      "Start in a high plank position.",
      "Brace your core.",
      "Drive one knee toward your chest.",
      "Alternate legs in a controlled rhythm.",
    ],
  },

  // ─────────────────────────────
  // PILATES / MOBILITY
  // ─────────────────────────────

  {
    id: "cat-cow",
    name: "Cat-Cow",
    muscleGroup: "Full Body",
    equipment: "Bodyweight",
    category: "Mobility",
    primaryMuscles: ["Core"],
    secondaryMuscles: ["Erector Spinae", "Shoulders"],
    instructions: [
      "Start on your hands and knees.",
      "Round your spine gently.",
      "Move smoothly into a controlled spinal extension.",
      "Repeat slowly with your breathing.",
    ],
  },

  {
    id: "thoracic-rotation",
    name: "Thoracic Rotation",
    muscleGroup: "Full Body",
    equipment: "Bodyweight",
    category: "Mobility",
    primaryMuscles: ["Thoracic Spine"],
    secondaryMuscles: ["Core", "Shoulders"],
    instructions: [
      "Start in a comfortable quadruped position.",
      "Place one hand behind your head.",
      "Rotate your upper body toward the ceiling.",
      "Return slowly and repeat.",
    ],
  },

  {
    id: "ninety-ninety-hip-switch",
    name: "90/90 Hip Switch",
    muscleGroup: "Full Body",
    equipment: "Bodyweight",
    category: "Mobility",
    primaryMuscles: ["Hip Rotators"],
    secondaryMuscles: ["Glutes", "Core"],
    instructions: [
      "Sit with both knees bent in a 90/90 position.",
      "Keep your torso controlled.",
      "Rotate both knees toward the opposite side.",
      "Return and repeat smoothly.",
    ],
  },

  {
    id: "worlds-greatest-stretch",
    name: "World's Greatest Stretch",
    muscleGroup: "Full Body",
    equipment: "Bodyweight",
    category: "Mobility",
    primaryMuscles: ["Hip Flexors"],
    secondaryMuscles: ["Hamstrings", "Thoracic Spine", "Glutes"],
    instructions: [
      "Step one foot forward into a lunge.",
      "Place both hands near the front foot.",
      "Rotate the torso and reach upward.",
      "Return and switch sides.",
    ],
  },

  {
    id: "pilates-single-leg-stretch",
    name: "Pilates Single-Leg Stretch",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    category: "Mobility",
    primaryMuscles: ["Rectus Abdominis"],
    secondaryMuscles: ["Hip Flexors", "Obliques"],
    instructions: [
      "Lie on your back with your shoulders slightly lifted.",
      "Bring one knee toward your chest.",
      "Extend the opposite leg.",
      "Switch legs smoothly while keeping your core braced.",
    ],
  },

  {
    id: "pilates-glute-bridge",
    name: "Pilates Glute Bridge",
    muscleGroup: "Glutes",
    equipment: "Bodyweight",
    category: "Mobility",
    primaryMuscles: ["Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Core"],
    instructions: [
      "Lie on your back with your knees bent.",
      "Brace your core.",
      "Lift your hips slowly.",
      "Pause briefly and lower with control.",
    ],
  },

  // ─────────────────────────────
  // CARDIO
  // ─────────────────────────────

  {
    id: "treadmill-walk",
    name: "Treadmill Walking",
    muscleGroup: "Cardio",
    equipment: "Machine",
    category: "Cardio",
    primaryMuscles: ["Cardiovascular System"],
    secondaryMuscles: ["Calves", "Quadriceps", "Hamstrings"],
    instructions: [
      "Set a comfortable walking speed.",
      "Maintain an upright posture.",
      "Walk continuously for your planned duration.",
      "Adjust speed or incline according to your goal.",
    ],
  },

  {
    id: "treadmill-run",
    name: "Treadmill Running",
    muscleGroup: "Cardio",
    equipment: "Machine",
    category: "Cardio",
    primaryMuscles: ["Cardiovascular System"],
    secondaryMuscles: ["Quadriceps", "Hamstrings", "Calves"],
    instructions: [
      "Begin at a comfortable pace.",
      "Maintain an upright posture.",
      "Run for the planned duration or distance.",
      "Gradually reduce speed before stopping.",
    ],
  },

  {
    id: "stationary-bike",
    name: "Stationary Bike",
    muscleGroup: "Cardio",
    equipment: "Machine",
    category: "Cardio",
    primaryMuscles: ["Cardiovascular System"],
    secondaryMuscles: ["Quadriceps", "Hamstrings", "Glutes"],
    instructions: [
      "Adjust the seat to a comfortable height.",
      "Begin pedaling at an easy pace.",
      "Maintain the planned intensity.",
      "Cool down gradually.",
    ],
  },

  {
    id: "rowing-machine",
    name: "Rowing Machine",
    muscleGroup: "Cardio",
    equipment: "Machine",
    category: "Cardio",
    primaryMuscles: ["Cardiovascular System"],
    secondaryMuscles: ["Quadriceps", "Glutes", "Back", "Core"],
    instructions: [
      "Secure your feet in the footrests.",
      "Drive through your legs.",
      "Follow with your torso and arms.",
      "Return smoothly to the starting position.",
    ],
  },

  {
    id: "jump-rope",
    name: "Jump Rope",
    muscleGroup: "Cardio",
    equipment: "Other",
    category: "Cardio",
    primaryMuscles: ["Cardiovascular System"],
    secondaryMuscles: ["Calves", "Quadriceps", "Core"],
    instructions: [
      "Hold the rope handles at your sides.",
      "Jump lightly as the rope passes beneath you.",
      "Keep your jumps small and controlled.",
      "Maintain a consistent rhythm.",
    ],
  },

  // ─────────────────────────────
  // KETTLEBELL / HOME
  // ─────────────────────────────

  {
    id: "kettlebell-goblet-squat",
    name: "Kettlebell Goblet Squat",
    muscleGroup: "Quadriceps",
    equipment: "Kettlebell",
    category: "Strength",
    primaryMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Adductors", "Core"],
    instructions: [
      "Hold the kettlebell close to your chest.",
      "Brace your core.",
      "Lower into a controlled squat.",
      "Drive through your feet to stand.",
    ],
  },

  {
    id: "kettlebell-clean",
    name: "Kettlebell Clean",
    muscleGroup: "Full Body",
    equipment: "Kettlebell",
    category: "Strength",
    primaryMuscles: ["Gluteus Maximus", "Hamstrings"],
    secondaryMuscles: ["Shoulders", "Core", "Upper Back"],
    instructions: [
      "Start with the kettlebell between your feet.",
      "Hinge and drive through your hips.",
      "Guide the kettlebell into the rack position.",
      "Lower it under control.",
    ],
  },

  {
    id: "kettlebell-overhead-press",
    name: "Kettlebell Overhead Press",
    muscleGroup: "Shoulders",
    equipment: "Kettlebell",
    category: "Strength",
    primaryMuscles: ["Shoulders"],
    secondaryMuscles: ["Triceps", "Core"],
    instructions: [
      "Hold the kettlebell in the rack position.",
      "Brace your core.",
      "Press the kettlebell overhead.",
      "Lower it under control.",
    ],
  },

  {
    id: "kettlebell-row",
    name: "Kettlebell Row",
    muscleGroup: "Back",
    equipment: "Kettlebell",
    category: "Hypertrophy",
    primaryMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: ["Biceps", "Rhomboids", "Rear Deltoid"],
    instructions: [
      "Hinge forward while keeping your back stable.",
      "Hold the kettlebell with one hand.",
      "Pull it toward your hip.",
      "Lower under control.",
    ],
  },

  // ─────────────────────────────
  // RESISTANCE BANDS
  // ─────────────────────────────

  {
    id: "band-chest-press",
    name: "Resistance Band Chest Press",
    muscleGroup: "Chest",
    equipment: "Resistance Band",
    category: "Hypertrophy",
    primaryMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Triceps", "Anterior Deltoid"],
    instructions: [
      "Anchor the band securely behind you.",
      "Hold the handles near chest height.",
      "Press forward.",
      "Return slowly while maintaining tension.",
    ],
  },

  {
    id: "band-row",
    name: "Resistance Band Row",
    muscleGroup: "Back",
    equipment: "Resistance Band",
    category: "Hypertrophy",
    primaryMuscles: ["Latissimus Dorsi", "Rhomboids"],
    secondaryMuscles: ["Biceps", "Rear Deltoid"],
    instructions: [
      "Anchor the band securely.",
      "Grip the handles.",
      "Pull toward your torso.",
      "Return slowly while maintaining tension.",
    ],
  },

  {
    id: "band-lateral-raise",
    name: "Resistance Band Lateral Raise",
    muscleGroup: "Shoulders",
    equipment: "Resistance Band",
    category: "Hypertrophy",
    primaryMuscles: ["Lateral Deltoid"],
    secondaryMuscles: ["Supraspinatus"],
    instructions: [
      "Stand on the resistance band.",
      "Hold the handles at your sides.",
      "Raise your arms outward.",
      "Lower slowly.",
    ],
  },

  {
    id: "band-glute-abduction",
    name: "Resistance Band Glute Abduction",
    muscleGroup: "Glutes",
    equipment: "Resistance Band",
    category: "Hypertrophy",
    primaryMuscles: ["Gluteus Medius"],
    secondaryMuscles: ["Gluteus Maximus"],
    instructions: [
      "Place the band around your thighs or ankles.",
      "Maintain a stable stance.",
      "Move one leg outward against the band.",
      "Return slowly.",
    ],
  },
];