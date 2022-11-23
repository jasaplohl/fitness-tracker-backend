const express = require("express");
const db = require("./common/helpers/common.helper");

const app = express();

//Enables us to read the request body
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
});

//Home page:
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, Heroku and Postgres API for a workout tracking app.' });
});

/**
 * API calls:
 */

//Query:
app.get('/workouts', db.getAllWorkouts);
app.get('/excercises', db.getAllExcercises);
app.get('/completed', db.getAllCompletedTrainigs);
app.get('/workout/:name', db.getWorkoutByName);
app.get('/excercises/:workout_id', db.getExcercisesForWorkoutWithId);

//Insert:
app.post('/workout', db.createWorkout);
app.post('/excercise', db.createExcercise);
app.post('/completed', db.createCompletedTraining);

//Delete:
app.post('/delete_completed', db.deleteCompletedTrainingWithId);

//Update:
app.post('/update_completed', db.updateCompletedTraining);

app.listen(process.env.PORT, () => {
    console.log("App running on port: " + process.env.PORT);
});
