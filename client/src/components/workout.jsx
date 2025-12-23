import { useState, useEffect } from 'react';
import API_URL from '../config.js';


function Workout() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sets: '',
    reps: '',
    notes: ''
  });
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`${API_URL}/workouts`);
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      alert('Failed to fetch workouts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkout) {
        // Update existing workout
        const updates = {};
        if (form.name) updates.name = form.name;
        if (form.sets) updates.sets = parseInt(form.sets);
        if (form.reps) updates.reps = parseInt(form.reps);
        if (form.notes !== undefined) updates.notes = form.notes;

        const response = await fetch(`${API_URL}/workouts/${editingWorkout.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });

        if (response.ok) {
          const updated = await response.json();
          setWorkouts(workouts.map(w => w.id === updated.id ? updated : w));
          setEditingWorkout(null);
          setForm({ name: '', sets: '', reps: '', notes: '' });
          alert('Workout updated successfully');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to update workout');
        }
      } else {
        // Create new workout
        if (!form.name || !form.sets || !form.reps) {
          alert('Please fill in name, sets, and reps');
          return;
        }

        const response = await fetch(`${API_URL}/workouts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            sets: parseInt(form.sets),
            reps: parseInt(form.reps),
            notes: form.notes || null
          })
        });

        if (response.ok) {
          const data = await response.json();
          setWorkouts([data.workout, ...workouts]);
          setForm({ name: '', sets: '', reps: '', notes: '' });
          alert(`Workout added with ID: ${data.workout.id}`);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to create workout');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save workout');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWorkouts(workouts.filter(w => w.id !== id));
        alert('Workout deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete workout');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete workout');
    }
  };

  const startEdit = (workout) => {
    setEditingWorkout(workout);
    setForm({
      name: workout.name,
      sets: workout.sets.toString(),
      reps: workout.reps.toString(),
      notes: workout.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingWorkout(null);
    setForm({ name: '', sets: '', reps: '', notes: '' });
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="workout-section">
      <h2>Our Workouts!</h2>
      
      {/* Form */}
      <form className="workout-form" onSubmit={handleSubmit}>
        <h3>{editingWorkout ? 'Edit Workout' : 'Add New Workout'}</h3>
        
        <div className="form-group">
          <label>Workout Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Bench Press, Squat, Core"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Sets *</label>
            <input
              type="number"
              value={form.sets}
              onChange={(e) => setForm({ ...form, sets: e.target.value })}
              placeholder="4"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Reps *</label>
            <input
              type="number"
              value={form.reps}
              onChange={(e) => setForm({ ...form, reps: e.target.value })}
              placeholder="10"
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes for workout"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingWorkout ? 'Update' : 'Add Workout'}
          </button>
          {editingWorkout && (
            <button type="button" onClick={cancelEdit} className="btn btn-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filter */}
      <div className="filter-section">
        <label>Filter: </label>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search workouts..."
          className="filter-input"
        />
      </div>

      {/* List */}
      <div className="workout-list">
        {filteredWorkouts.length === 0 ? (
          <p className="empty">No workouts found</p>
        ) : (
          filteredWorkouts.map(workout => (
            <div key={workout.id} className="workout-card">
              <div className="card-header">
                <h4>{workout.name}</h4>
                <span className="badge">{workout.sets} sets × {workout.reps} reps</span>
              </div>
              {workout.notes && <p className="card-notes">{workout.notes}</p>}
              <div className="card-footer">
                <small>{new Date(workout.created_at).toLocaleDateString()}</small>
                <div className="card-actions">
                  <button onClick={() => startEdit(workout)} className="btn btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(workout.id)} className="btn btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Workout;