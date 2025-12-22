import express from 'express';
import cors from 'cors';
import * as db from './queries.js'; // less clutter importing all methods

const app = express();
const PORT = 3001;

// middleware (allow our app to communicate with our server and
// allows json requests)
app.use(cors());
app.use(express.json());

// WORKOUTS CRUD OPERATIONS
// get
app.get('/api/workouts', async (request, response) => {
    try {
        const workouts = await db.getWorkouts();
        response.status(200).json(workouts);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.get('/api/workouts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const workout = await db.getWorkoutById(parseInt(id));
      
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// post
app.post('/api/workouts', async (req, res) => {
    try {
      const { name, sets, reps, notes } = req.body;

      // checks and validates each input 
      if (!name || sets === undefined || reps === undefined) {
        return res.status(400).json({ 
          error: 'There was an issue with your input for posting a workout' 
        });
      }

      // the actual post process
      const workout = await db.createWorkout(name, sets, reps, notes);
      res.status(201).json({ 
        message: `Workout added with ID: ${workout.id}`,
        workout 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

  // update with however many parameters (like sets or the actual workout)
app.put('/api/workouts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const workout = await db.updateWorkout(parseInt(id), updates);
      
      if (!workout) {
        return res.status(404).json({ error: 'There was no workout input' });
      }
      
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// delete
app.delete('/api/workouts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const workout = await db.deleteWorkout(parseInt(id));
      
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      res.status(200).json({ message: 'we successfully deleted ', workout });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


// GOALS CRUD METHODS
// get
app.get('/api/goals', async (req, res) => {
    try {
      const goals = await db.getGoals();
      res.status(200).json(goals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// get but with id
app.get('/api/goals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const goal = await db.getGoalById(parseInt(id));
      
      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }
      
      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// create a goal (post)
app.post('/api/goals', async (req, res) => {
    try {
      const { description, targetDate, isComplete } = req.body;
      
      if (!description) {
        return res.status(400).json({ 
          error: 'you need to describe said goal' 
        });
      }
      
      const goal = await db.createGoal(description, targetDate, isComplete);
      res.status(201).json(goal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
// update goal with 
app.put('/api/goals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const goal = await db.updateGoal(parseInt(id), updates);
      
      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }
      
      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// delete method to delete goals (duh)
app.delete('/api/goals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const goal = await db.deleteGoal(parseInt(id));
      
      if (!goal) {
        return res.status(404).json({ error: 'goal was not found :(' });
      }
      
      res.status(200).json({ message: 'sucessfully deleted ', goal });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// starts the server 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});