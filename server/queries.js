import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'me',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fitness',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// workout CRUD methods

// returns an array of all workouts in our database

export const getWorkouts = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM workouts ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching workouts: ${error.message}`);
  }
};

// using an id parameter to get specific workouts

export const getWorkoutById = async (id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM workouts WHERE id = $1',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error fetching workout: ${error.message}`);
  }
};

// creates workout with certain attributes in mind (reps, sets, and a little note for reminders)
export const createWorkout = async (name, sets, reps, notes = null) => {
  try {
    const result = await pool.query(
      `INSERT INTO workouts (name, sets, reps, notes, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [name, sets, reps, notes]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating workout: ${error.message}`);
  }
};


export const updateWorkout = async (id, updates) => {
  try {
    // Build dynamic update query based on provided fields
    const fields = [];  // this array creates placeholder parameters
    const values = [];  // this array holds the values that will update our placeholders (the workout)
    let paramCount = 1; // holds $count for updates at the end

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.sets !== undefined) {
      fields.push(`sets = $${paramCount++}`);
      values.push(updates.sets);
    }
    if (updates.reps !== undefined) {
      fields.push(`reps = $${paramCount++}`);
      values.push(updates.reps);
    }
    if (updates.notes !== undefined) {
      fields.push(`notes = $${paramCount++}`);
      values.push(updates.notes);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // uses fields to set name, sets, etc with the help of paramCount
    values.push(id);
    const result = await pool.query(
      `UPDATE workouts 
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating workout: ${error.message}`);
  }
};

// delete workout by id

export const deleteWorkout = async (id) => {
  try {
    const result = await pool.query(
      'DELETE FROM workouts WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error deleting workout: ${error.message}`);
  }
};

// ========== GOALS CRUD OPERATIONS ==========

// returns goals array 
export const getGoals = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM goals ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching goals: ${error.message}`);
  }
};

// returns out goal by id (of course)
export const getGoalById = async (id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM goals WHERE id = $1',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error fetching goal: ${error.message}`);
  }
};

/**
 * @param {string} description - Goal description (e.g., "Bench press 225 lbs")
 * @param {string} targetDate - Optional target date (YYYY-MM-DD format)
 * @param {boolean} isComplete - Whether the goal is complete 
 * create our goals with certain criterias in mind
 */
export const createGoal = async (description, targetDate = null, isComplete = false) => {
  try {
    const result = await pool.query(
      `INSERT INTO goals (description, target_date, is_complete, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [description, targetDate, isComplete]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating goal: ${error.message}`);
  }
};

/**
 * @param {number} id - The goal ID to update
 * @param {object} updates - Object containing fields to update
 * updates our goal by description or time frame (also completion)
 */
export const updateGoal = async (id, updates) => {
  try { // all similar to updateWorkout with dynamic queries
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    if (updates.targetDate !== undefined) {
      fields.push(`target_date = $${paramCount++}`);
      values.push(updates.targetDate);
    }
    if (updates.isComplete !== undefined) {
      fields.push(`is_complete = $${paramCount++}`);
      values.push(updates.isComplete);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE goals 
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating goal: ${error.message}`);
  }
};

// uses our updateGoal method to set this
export const markGoalComplete = async (id) => {
  return await updateGoal(id, { isComplete: true });
};

// deletion
export const deleteGoal = async (id) => {
  try {
    const result = await pool.query(
      'DELETE FROM goals WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error deleting goal: ${error.message}`);
  }
};

// Export the pool for potential direct queries or cleanup
export { pool };