import Workout from './components/workout.jsx';
import Goal from './components/goal.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Personal Fitness Tracker</h1>
        <p>Track sets, reps, and ambitions!</p>
      </header>
      
      <div className="container">
        <div className="left-panel">
          <Workout />
        </div>
        
        <div className="divider"></div>
        
        <div className="right-panel">
          <Goal />
        </div>
      </div>
    </div>
  );
}

export default App;