import { useState, useEffect } from 'react';
import API_URL from '../config.js';

function Goal() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    description: '',
    targetDate: '',
    isComplete: false
  });
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_URL}/goals`);
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      alert('Failed to fetch goals');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        // Update existing goal
        const updates = {};
        if (form.description) updates.description = form.description;
        if (form.targetDate) updates.targetDate = form.targetDate;
        if (form.isComplete !== undefined) updates.isComplete = form.isComplete;

        const response = await fetch(`${API_URL}/goals/${editingGoal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });

        if (response.ok) {
          const updated = await response.json();
          setGoals(goals.map(g => g.id === updated.id ? updated : g));
          setEditingGoal(null);
          setForm({ description: '', targetDate: '', isComplete: false });
          alert('Goal updated successfully');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to update goal');
        }
      } else {
        // Create new goal
        if (!form.description) {
          alert('Please enter a goal description');
          return;
        }

        const response = await fetch(`${API_URL}/goals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: form.description,
            targetDate: form.targetDate || null,
            isComplete: form.isComplete
          })
        });

        if (response.ok) {
          const data = await response.json();
          setGoals([data, ...goals]);
          setForm({ description: '', targetDate: '', isComplete: false });
          alert(`Goal added with ID: ${data.id}`);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to create goal');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save goal');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setGoals(goals.filter(g => g.id !== id));
        alert('Goal deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete goal');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete goal');
    }
  };

  const markComplete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isComplete: true })
      });

      if (response.ok) {
        const updated = await response.json();
        setGoals(goals.map(g => g.id === updated.id ? updated : g));
        alert('Goal marked as complete!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update goal');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update goal');
    }
  };

  const startEdit = (goal) => {
    setEditingGoal(goal);
    setForm({
      description: goal.description,
      targetDate: goal.target_date || '',
      isComplete: goal.is_complete
    });
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    setForm({ description: '', targetDate: '', isComplete: false });
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'complete') return goal.is_complete;
    if (filter === 'incomplete') return !goal.is_complete;
    return true;
  });

  return (
    <div className="goal-section">
      <h2>🎯 Goals</h2>
      
      {/* Form */}
      <form className="goal-form" onSubmit={handleSubmit}>
        <h3>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</h3>
        
        <div className="form-group">
          <label>Goal Description *</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g., 225lbs Bench, 400lbs Squat"
            required
          />
        </div>

        <div className="form-group">
          <label>Target Date</label>
          <input
            type="date"
            value={form.targetDate}
            onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
          />
        </div>

        {editingGoal && (
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.isComplete}
                onChange={(e) => setForm({ ...form, isComplete: e.target.checked })}
              />
              Mark as Complete
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingGoal ? 'Update' : 'Add Goal'}
          </button>
          {editingGoal && (
            <button type="button" onClick={cancelEdit} className="btn btn-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filter */}
      <div className="filter-section">
        <label>Filter: </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Goals</option>
          <option value="complete">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {/* List */}
      <div className="goal-list">
        {filteredGoals.length === 0 ? (
          <p className="empty">No goals found</p>
        ) : (
          filteredGoals.map(goal => (
            <div key={goal.id} className={`goal-card ${goal.is_complete ? 'completed' : ''}`}>
              <div className="card-header">
                <h4>{goal.description}</h4>
                {goal.is_complete && <span className="badge badge-success">✓ Complete</span>}
              </div>
              {goal.target_date && (
                <p className="card-info">
                  Target: {new Date(goal.target_date).toLocaleDateString()}
                </p>
              )}
              <div className="card-footer">
                <small>{new Date(goal.created_at).toLocaleDateString()}</small>
                <div className="card-actions">
                  {!goal.is_complete && (
                    <button onClick={() => markComplete(goal.id)} className="btn btn-success">
                      Complete
                    </button>
                  )}
                  <button onClick={() => startEdit(goal)} className="btn btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(goal.id)} className="btn btn-delete">
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

export default Goal;