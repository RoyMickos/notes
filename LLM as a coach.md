Played around with gemini to help create a prompt for a personalized fitness coach. Here's what it came up with:
```
You will be provided with the following user details to create a weekly training program.

  

**User Information:**

* **User Profile:** {user_profile} (e.g., Age, Gender, Weight, Height)

* **Fitness Level & Experience:** {fitness_level_experience} (e.g., Beginner/Intermediate/Advanced in weightlifting and cycling)

* **Squat 1-Rep Max (1RM):** {squat_1rm}

* **Bench Press 1-Rep Max (1RM):** {bench_press_1rm}

* **Deadlift 1-Rep Max (1RM):** {deadlift_1rm}

* **Overhead Press 1-Rep Max (1RM):** {overhead_press_1rm}

* **Available Equipment:** {available_equipment} (e.g., Kettlebell weights available, type of bike, heart rate monitor, power meter)

* **Training Availability:** {training_availability} (e.g., Days per week, preferred workout duration)

* **Cycling Endurance Goal:** {cycling_endurance_goal} (e.g., Complete a 100-mile century ride in 3 months)

* **Health and Injury History:** {health_and_injury_history}

  

Based on the information provided, create a detailed 4-week training program. Follow these instructions precisely:

  

**1. Program Structure:**

* Design a weekly schedule that intelligently combines gym sessions and cycling workouts based on the user's training_availability.

* Provide a logical layout. For example, avoid scheduling a heavy squat/deadlift day immediately before a long endurance ride.

  

**2. Gym Training (5/3/1 and Kettlebell Assistance):**

* Structure the gym training around the four main lifts: Squat, Bench Press, Deadlift, and Overhead Press, with one main lift per gym day.

* Calculate a "Training Max" for each lift by taking 90% of the user's provided 1RM (e.g., Training Max = 1RM * 0.90). All percentages will be based on this Training Max.

* Design a 4-week cycle following the 5/3/1 percentage and rep scheme:

* **Week 1 (5s week):** Warm-up, then 3 sets of 5 reps (65% x 5, 75% x 5, 85% x 5+). The last set is an AMRAP (As Many Reps As Possible).

* **Week 2 (3s week):** Warm-up, then 3 sets of 3 reps (70% x 3, 80% x 3, 90% x 3+). The last set is an AMRAP.

* **Week 3 (1s week):** Warm-up, then 3 sets of 5, 3, and 1 reps (75% x 5, 85% x 3, 95% x 1+). The last set is an AMRAP.

* **Week 4 (Deload week):** 3 sets of 5 reps at a light weight (40% x 5, 50% x 5, 60% x 5).

* For each gym day, add 2-3 kettlebell assistance exercises that complement the main lift. Select from the following categories, using the available_equipment:

* **Push:** Kettlebell Floor Press, Kettlebell Overhead Press.

* **Pull:** Kettlebell Rows, Kettlebell High Pulls.

* **Hinge/Posterior Chain:** Kettlebell Swings, Kettlebell Good Mornings.

* **Squat/Lunge:** Kettlebell Goblet Squats, Kettlebell Lunges.

* **Core/Carry:** Kettlebell Turkish Get-ups, Farmer's Walks.

* Specify 3-4 sets of 8-12 reps for most assistance exercises.

  

**3. Cycling Training (Endurance):**

* Design a weekly cycling plan aimed at building endurance for the user's cycling_endurance_goal.

* The plan should include a mix of the following workouts, with intensity described by heart rate zones (e.g., Zone 2) or perceived exertion:

* **One Long Slow Distance (LSD) Ride:** This should be the cornerstone of the week, performed at a steady, conversational pace (Zone 2). Gradually increase the duration of this ride each week.

* **One or Two Tempo/Interval Rides:** Include structured intervals to build aerobic capacity (e.g., 2x20 minutes at "Sweet Spot" or Zone 3/4 intensity).

* **One or Two Recovery/Easy Rides:** Short, low-intensity rides (Zone 1) to aid recovery, often best done the day after a hard gym session or long ride.

  

**4. Output Format:**

* Present the program in a clear, week-by-week, day-by-day format.

* For each day, specify the activity (e.g., "Gym: Squat Day", "Cycling: LSD Ride", or "Rest").

* For gym days, list each exercise with the calculated weight, sets, and reps (e.g., "Squat: 135 lbs x 5, 155 lbs x 5, 175 lbs x 5+").

* For cycling days, specify the workout type, duration, and intensity target (e.g., "LSD Ride: 2.5 hours at Zone 2").

* Begin the response with a brief summary of the program's goals.

* Conclude with a mandatory safety disclaimer: "Important: Consult with a healthcare professional before beginning any new fitness program. Listen to your body, prioritize proper form, and adjust as needed. This plan is a guideline and not a substitute for professional medical advice."
```