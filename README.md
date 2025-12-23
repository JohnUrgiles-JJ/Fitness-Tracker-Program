deployment link: https://fitness-tracker-application-beta.vercel.app/

<h1>Fitness Tracker Application</h1>

A full-stack web applicatino for tracking workouts and goals. Built entirely with React, Node.js,
Express.js, and PostgreSQL.

@author --> John Urgiles

<h2>Overview:</h2>

The fitness tracker application is a user responsive application that allows users to:
- Create, update, delete, and view workout routines input by the user
- Set and track goals with an optional completion status
- Search/filter goals and workouts by name/id
- Manage and update goals, changing dates, notes, etc. 

The application illustrates my knowledge and usage of practices within React frontend, backend, and PostgreSQL custom databases.

[https://fitness-tracker-application-beta.vercel.app/](https://fitness-tracker-application-beta.vercel.app/)

<h2>Frontend Application:</h2>

- React 19.2.0
- Vite 7.2.4
- CSS3 - styling
- Fetch API - HTTP requests for backend

<h2>Backend Application:</h2>

- Node.js - UI library and implementations
- Express.js - web framework and design
- PostgreSQL - custom database
- PoolPG - postgres client for our node.js
- CORS - resource sharing
- dotenv 0 environmental variable management (hiding protective information)

<h2>Deployment Applications</h2>

- **Vercel** - frontend hosting with connection to railway for backend activity
= **Railway** - backend hosting and database availability

<h3>Before you begin application of website you must have:</h3>

- **Node.js**
- **npm** or **yarn**
- **PostgreSQL**
- **Git**

<h3>Installation Guide</h3>
### 1. Clone Repository

git clone https://github.com/JohnUrgiles-JJ/Fitness-Tracker-Program.git
cd Fitness-Tracker-Program### 2. Install Frontend Dependencies

cd client
npm install### 3. Install Backend Dependencies

cd ../server
npm install## DataBase Setup

### 1. Create PostgreSQL Database

Open PostgreSQL shell (psql) and run:

Create database
CREATE DATABASE fitness;

Connect to database
\c fitness### 2. Create Tables

While connected to the `fitness` database, run:

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    target_date DATE,
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workouts_created_at ON workouts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goals_is_complete ON goals(is_complete);
CREATE INDEX IF NOT EXISTS idx_goals_created_at ON goals(created_at DESC);### 3. Configure Environment Variables

Create `server/.env` file:

# Database Configuration
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=fitness
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Server Configuration
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173## Running the Application

### Development Mode

#### 1. Start the Backend Server

cd server
npm run devThe server will start on `http://localhost:3001`

#### 2. Start the Frontend Development Server

Open a new terminal:
cd client
npm run devThe frontend will start on `http://localhost:5173`

#### 3. Open in Browser

Navigate to `http://localhost:5173` to view the application.

### Production Build

#### Build Frontend

cd client
npm run build, the built files will be in `client/dist/`

#### Start Production Server

cd server
npm run dev

<h3> Application Explanation</3>

### Workout Component ('workout.jsx')
- Manages workout state (variabels) and API calls
- Handles form submissions for create and updates
- Implements a search feature
- Displays workout list with the ability to delete

### Goal Component ('goal.jsx')
- Manages goal state and API calls
- Handles form submissions for create and updates
- Similar to Workout component with deletion, edits, completions, and filters

### App Component ('App.jsx')
- Implements middle split layout (left orient bug still in effect)
- Renders workouts and goals
- Handles connectivity between backend and frontend

<h2>Reflections</h2>

Throughout development of the project, many bugs and errors kept me backtracking in the client and server files respectively, with issues about deployment, CRUD methods being incomplete or incompetent, or even wtih mispelling in certain variables and array initializations that caused the api server to go null. I've learned much more about backened application than I previously had thought I knew, especially with the implementation of ES6 modules rather than commonJS and how it impacted the clutter and errors in my methods, exporting them and importing was difficult. Use state and props also became apparent core mechanics of my code since working with the frontend portion of the code was a terrible struggle (the ui is still a litte iffy). Event handling, dynamic-queries, responsive layouts, request/response errors, JSON parsing, SQL fundamentals, timestamps, and vercel/railway cross implementation are the main areas of program where I had the most trouble. By the end of the application deployment, my understanding of database hosting and implementations of http method handling has improved, moving onto other projects seems more feasible now with my understanding of these topics.