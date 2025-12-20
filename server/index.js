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

