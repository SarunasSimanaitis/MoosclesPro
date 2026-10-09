export type ExerciseMedia = { folder: string; sourceName: string; hasEnd: boolean };

const MEDIA_BASE = "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises";

export const exerciseMediaById: Record<string, ExerciseMedia> =
{
  "ninety-ninety-hip-switch": {
    "folder": "90_90_Hamstring",
    "sourceName": "90/90 Hamstring",
    "hasEnd": true
  },
  "barbell-bench-press": {
    "folder": "Barbell_Bench_Press_-_Medium_Grip",
    "sourceName": "Barbell Bench Press - Medium Grip",
    "hasEnd": true
  },
  "incline-barbell-bench-press": {
    "folder": "Barbell_Incline_Bench_Press_-_Medium_Grip",
    "sourceName": "Barbell Incline Bench Press - Medium Grip",
    "hasEnd": true
  },
  "dumbbell-bench-press": {
    "folder": "Dumbbell_Bench_Press",
    "sourceName": "Dumbbell Bench Press",
    "hasEnd": true
  },
  "incline-dumbbell-press": {
    "folder": "Incline_Dumbbell_Press",
    "sourceName": "Incline Dumbbell Press",
    "hasEnd": true
  },
  "cable-chest-fly": {
    "folder": "Cable_Crossover",
    "sourceName": "Cable Crossover",
    "hasEnd": true
  },
  "lat-pulldown": {
    "folder": "Wide-Grip_Lat_Pulldown",
    "sourceName": "Wide-Grip Lat Pulldown",
    "hasEnd": true
  },
  "barbell-bent-over-row": {
    "folder": "Bent_Over_Barbell_Row",
    "sourceName": "Bent Over Barbell Row",
    "hasEnd": true
  },
  "seated-cable-row": {
    "folder": "Seated_Cable_Rows",
    "sourceName": "Seated Cable Rows",
    "hasEnd": true
  },
  "one-arm-dumbbell-row": {
    "folder": "One-Arm_Dumbbell_Row",
    "sourceName": "One-Arm Dumbbell Row",
    "hasEnd": true
  },
  "dumbbell-shoulder-press": {
    "folder": "Dumbbell_Shoulder_Press",
    "sourceName": "Dumbbell Shoulder Press",
    "hasEnd": true
  },
  "barbell-overhead-press": {
    "folder": "Standing_Military_Press",
    "sourceName": "Standing Military Press",
    "hasEnd": true
  },
  "dumbbell-lateral-raise": {
    "folder": "Side_Lateral_Raise",
    "sourceName": "Side Lateral Raise",
    "hasEnd": true
  },
  "cable-lateral-raise": {
    "folder": "Cable_Seated_Lateral_Raise",
    "sourceName": "Cable Seated Lateral Raise",
    "hasEnd": true
  },
  "dumbbell-bicep-curl": {
    "folder": "Dumbbell_Bicep_Curl",
    "sourceName": "Dumbbell Bicep Curl",
    "hasEnd": true
  },
  "barbell-curl": {
    "folder": "Barbell_Curl",
    "sourceName": "Barbell Curl",
    "hasEnd": true
  },
  "hammer-curl": {
    "folder": "Hammer_Curls",
    "sourceName": "Hammer Curls",
    "hasEnd": true
  },
  "cable-tricep-pushdown": {
    "folder": "Triceps_Pushdown",
    "sourceName": "Triceps Pushdown",
    "hasEnd": true
  },
  "dumbbell-tricep-extension": {
    "folder": "Lying_Dumbbell_Tricep_Extension",
    "sourceName": "Lying Dumbbell Tricep Extension",
    "hasEnd": true
  },
  "overhead-dumbbell-tricep-extension": {
    "folder": "Standing_Dumbbell_Triceps_Extension",
    "sourceName": "Standing Dumbbell Triceps Extension",
    "hasEnd": true
  },
  "barbell-back-squat": {
    "folder": "Barbell_Squat",
    "sourceName": "Barbell Squat",
    "hasEnd": true
  },
  "leg-press": {
    "folder": "Leg_Press",
    "sourceName": "Leg Press",
    "hasEnd": true
  },
  "leg-extension": {
    "folder": "Leg_Extensions",
    "sourceName": "Leg Extensions",
    "hasEnd": true
  },
  "romanian-deadlift": {
    "folder": "Romanian_Deadlift",
    "sourceName": "Romanian Deadlift",
    "hasEnd": true
  },
  "lying-leg-curl": {
    "folder": "Lying_Leg_Curls",
    "sourceName": "Lying Leg Curls",
    "hasEnd": true
  },
  "barbell-hip-thrust": {
    "folder": "Barbell_Hip_Thrust",
    "sourceName": "Barbell Hip Thrust",
    "hasEnd": true
  },
  "glute-kickback": {
    "folder": "Glute_Kickback",
    "sourceName": "Glute Kickback",
    "hasEnd": true
  },
  "standing-calf-raise": {
    "folder": "Standing_Calf_Raises",
    "sourceName": "Standing Calf Raises",
    "hasEnd": true
  },
  "cable-crunch": {
    "folder": "Cable_Crunch",
    "sourceName": "Cable Crunch",
    "hasEnd": true
  },
  "plank": {
    "folder": "Plank",
    "sourceName": "Plank",
    "hasEnd": true
  },
  "hanging-knee-raise": {
    "folder": "Hanging_Leg_Raise",
    "sourceName": "Hanging Leg Raise",
    "hasEnd": true
  },
  "decline-barbell-bench-press": {
    "folder": "Decline_Barbell_Bench_Press",
    "sourceName": "Decline Barbell Bench Press",
    "hasEnd": true
  },
  "machine-chest-press": {
    "folder": "Leverage_Chest_Press",
    "sourceName": "Leverage Chest Press",
    "hasEnd": true
  },
  "pec-deck": {
    "folder": "Butterfly",
    "sourceName": "Butterfly",
    "hasEnd": true
  },
  "dumbbell-fly": {
    "folder": "Dumbbell_Flyes",
    "sourceName": "Dumbbell Flyes",
    "hasEnd": true
  },
  "push-up": {
    "folder": "Barbell_Bench_Press_-_Medium_Grip",
    "sourceName": "Barbell Bench Press - Medium Grip",
    "hasEnd": true
  },
  "close-grip-push-up": {
    "folder": "Incline_Push-Up_Close-Grip",
    "sourceName": "Incline Push-Up Close-Grip",
    "hasEnd": true
  },
  "pull-up": {
    "folder": "Bent_Over_Barbell_Row",
    "sourceName": "Bent Over Barbell Row",
    "hasEnd": true
  },
  "chin-up": {
    "folder": "Chin-Up",
    "sourceName": "Chin-Up",
    "hasEnd": true
  },
  "assisted-pull-up": {
    "folder": "Band_Assisted_Pull-Up",
    "sourceName": "Band Assisted Pull-Up",
    "hasEnd": true
  },
  "chest-supported-row": {
    "folder": "Dumbbell_Incline_Row",
    "sourceName": "Dumbbell Incline Row",
    "hasEnd": true
  },
  "dumbbell-rear-delt-row": {
    "folder": "Barbell_Rear_Delt_Row",
    "sourceName": "Barbell Rear Delt Row",
    "hasEnd": true
  },
  "straight-arm-pulldown": {
    "folder": "Straight-Arm_Pulldown",
    "sourceName": "Straight-Arm Pulldown",
    "hasEnd": true
  },
  "machine-shoulder-press": {
    "folder": "Machine_Shoulder_Military_Press",
    "sourceName": "Machine Shoulder (Military) Press",
    "hasEnd": true
  },
  "dumbbell-front-raise": {
    "folder": "Front_Dumbbell_Raise",
    "sourceName": "Front Dumbbell Raise",
    "hasEnd": true
  },
  "cable-rear-delt-fly": {
    "folder": "Cable_Rear_Delt_Fly",
    "sourceName": "Cable Rear Delt Fly",
    "hasEnd": true
  },
  "face-pull": {
    "folder": "Face_Pull",
    "sourceName": "Face Pull",
    "hasEnd": true
  },
  "incline-dumbbell-curl": {
    "folder": "Incline_Dumbbell_Curl",
    "sourceName": "Incline Dumbbell Curl",
    "hasEnd": true
  },
  "preacher-curl": {
    "folder": "Preacher_Curl",
    "sourceName": "Preacher Curl",
    "hasEnd": true
  },
  "cable-bicep-curl": {
    "folder": "Standing_Biceps_Cable_Curl",
    "sourceName": "Standing Biceps Cable Curl",
    "hasEnd": true
  },
  "cable-overhead-tricep-extension": {
    "folder": "Cable_Rope_Overhead_Triceps_Extension",
    "sourceName": "Cable Rope Overhead Triceps Extension",
    "hasEnd": true
  },
  "tricep-dip": {
    "folder": "Dips_-_Triceps_Version",
    "sourceName": "Dips - Triceps Version",
    "hasEnd": true
  },
  "dumbbell-kickback": {
    "folder": "Tricep_Dumbbell_Kickback",
    "sourceName": "Tricep Dumbbell Kickback",
    "hasEnd": true
  },
  "bodyweight-squat": {
    "folder": "Bodyweight_Squat",
    "sourceName": "Bodyweight Squat",
    "hasEnd": true
  },
  "reverse-lunge": {
    "folder": "Barbell_Squat",
    "sourceName": "Barbell Squat",
    "hasEnd": true
  },
  "split-squat": {
    "folder": "Split_Squats",
    "sourceName": "Split Squats",
    "hasEnd": true
  },
  "front-squat": {
    "folder": "Front_Squat_Clean_Grip",
    "sourceName": "Front Squat (Clean Grip)",
    "hasEnd": true
  },
  "bulgarian-split-squat": {
    "folder": "Split_Squat_with_Dumbbells",
    "sourceName": "Split Squat with Dumbbells",
    "hasEnd": true
  },
  "goblet-squat": {
    "folder": "Goblet_Squat",
    "sourceName": "Goblet Squat",
    "hasEnd": true
  },
  "dumbbell-lunge": {
    "folder": "Dumbbell_Lunges",
    "sourceName": "Dumbbell Lunges",
    "hasEnd": true
  },
  "smith-machine-squat": {
    "folder": "Smith_Machine_Squat",
    "sourceName": "Smith Machine Squat",
    "hasEnd": true
  },
  "seated-leg-curl": {
    "folder": "Seated_Leg_Curl",
    "sourceName": "Seated Leg Curl",
    "hasEnd": true
  },
  "dumbbell-romanian-deadlift": {
    "folder": "Romanian_Deadlift",
    "sourceName": "Romanian Deadlift",
    "hasEnd": true
  },
  "good-morning": {
    "folder": "Good_Morning",
    "sourceName": "Good Morning",
    "hasEnd": true
  },
  "single-leg-glute-bridge": {
    "folder": "Single_Leg_Glute_Bridge",
    "sourceName": "Single Leg Glute Bridge",
    "hasEnd": true
  },
  "dumbbell-hip-thrust": {
    "folder": "Barbell_Hip_Thrust",
    "sourceName": "Barbell Hip Thrust",
    "hasEnd": true
  },
  "glute-bridge": {
    "folder": "Barbell_Hip_Thrust",
    "sourceName": "Barbell Hip Thrust",
    "hasEnd": true
  },
  "kettlebell-swing": {
    "folder": "Barbell_Hip_Thrust",
    "sourceName": "Barbell Hip Thrust",
    "hasEnd": true
  },
  "seated-calf-raise": {
    "folder": "Seated_Calf_Raise",
    "sourceName": "Seated Calf Raise",
    "hasEnd": true
  },
  "single-leg-calf-raise": {
    "folder": "Standing_Calf_Raises",
    "sourceName": "Standing Calf Raises",
    "hasEnd": true
  },
  "wrist-curl": {
    "folder": "Cable_Wrist_Curl",
    "sourceName": "Cable Wrist Curl",
    "hasEnd": true
  },
  "reverse-wrist-curl": {
    "folder": "Reverse_Barbell_Curl",
    "sourceName": "Reverse Barbell Curl",
    "hasEnd": true
  },
  "farmer-carry": {
    "folder": "Farmers_Walk",
    "sourceName": "Farmer's Walk",
    "hasEnd": true
  },
  "dead-bug": {
    "folder": "Dead_Bug",
    "sourceName": "Dead Bug",
    "hasEnd": true
  },
  "side-plank": {
    "folder": "Plank",
    "sourceName": "Plank",
    "hasEnd": true
  },
  "bird-dog": {
    "folder": "Plank",
    "sourceName": "Plank",
    "hasEnd": true
  },
  "reverse-crunch": {
    "folder": "Reverse_Crunch",
    "sourceName": "Reverse Crunch",
    "hasEnd": true
  },
  "lying-leg-raise": {
    "folder": "Flat_Bench_Lying_Leg_Raise",
    "sourceName": "Flat Bench Lying Leg Raise",
    "hasEnd": true
  },
  "hollow-body-hold": {
    "folder": "Plank",
    "sourceName": "Plank",
    "hasEnd": true
  },
  "pallof-press": {
    "folder": "Pallof_Press",
    "sourceName": "Pallof Press",
    "hasEnd": true
  },
  "mountain-climber": {
    "folder": "Mountain_Climbers",
    "sourceName": "Mountain Climbers",
    "hasEnd": true
  },
  "cat-cow": {
    "folder": "Cat_Stretch",
    "sourceName": "Cat Stretch",
    "hasEnd": true
  },
  "thoracic-rotation": {
    "folder": "Torso_Rotation",
    "sourceName": "Torso Rotation",
    "hasEnd": true
  },
  "worlds-greatest-stretch": {
    "folder": "Worlds_Greatest_Stretch",
    "sourceName": "World's Greatest Stretch",
    "hasEnd": true
  },
  "pilates-single-leg-stretch": {
    "folder": "Flat_Bench_Lying_Leg_Raise",
    "sourceName": "Flat Bench Lying Leg Raise",
    "hasEnd": true
  },
  "pilates-glute-bridge": {
    "folder": "Barbell_Hip_Thrust",
    "sourceName": "Barbell Hip Thrust",
    "hasEnd": true
  },
  "treadmill-walk": {
    "folder": "Walking_Treadmill",
    "sourceName": "Walking, Treadmill",
    "hasEnd": true
  },
  "treadmill-run": {
    "folder": "Running_Treadmill",
    "sourceName": "Running, Treadmill",
    "hasEnd": true
  },
  "stationary-bike": {
    "folder": "Bicycling_Stationary",
    "sourceName": "Bicycling, Stationary",
    "hasEnd": true
  },
  "rowing-machine": {
    "folder": "Rowing_Stationary",
    "sourceName": "Rowing, Stationary",
    "hasEnd": true
  },
  "jump-rope": {
    "folder": "Rope_Jumping",
    "sourceName": "Rope Jumping",
    "hasEnd": true
  },
  "kettlebell-goblet-squat": {
    "folder": "Goblet_Squat",
    "sourceName": "Goblet Squat",
    "hasEnd": true
  },
  "kettlebell-clean": {
    "folder": "One-Arm_Kettlebell_Clean",
    "sourceName": "One-Arm Kettlebell Clean",
    "hasEnd": true
  },
  "kettlebell-overhead-press": {
    "folder": "One-Arm_Kettlebell_Military_Press_To_The_Side",
    "sourceName": "One-Arm Kettlebell Military Press To The Side",
    "hasEnd": true
  },
  "kettlebell-row": {
    "folder": "One-Arm_Kettlebell_Row",
    "sourceName": "One-Arm Kettlebell Row",
    "hasEnd": true
  },
  "band-chest-press": {
    "folder": "Bench_Press_-_With_Bands",
    "sourceName": "Bench Press - With Bands",
    "hasEnd": true
  },
  "band-row": {
    "folder": "Bent_Over_Barbell_Row",
    "sourceName": "Bent Over Barbell Row",
    "hasEnd": true
  },
  "band-lateral-raise": {
    "folder": "Lateral_Raise_-_With_Bands",
    "sourceName": "Lateral Raise - With Bands",
    "hasEnd": true
  },
  "band-glute-abduction": {
    "folder": "Barbell_Hip_Thrust",
    "sourceName": "Barbell Hip Thrust",
    "hasEnd": true
  }
}
;

export function exerciseImageUrl(media: ExerciseMedia, endFrame = false): string {
  const folder = media.folder.split("/").map(encodeURIComponent).join("/");
  const frame = endFrame && media.hasEnd ? "1.jpg" : "0.jpg";
  return MEDIA_BASE + "/" + folder + "/" + frame;
}

export const exerciseMediaCredit = "Exercise photos from the public-domain Free Exercise DB (Unlicense).";
export const exerciseMediaSourceUrl = "https://github.com/yuhonas/free-exercise-db";
