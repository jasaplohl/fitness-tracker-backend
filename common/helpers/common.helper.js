const { Pool } = require("pg");
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: false
});

/**
 * QUERY THE DATA:
 */

const getAllWorkouts = async (request, response) => {
    try {
        const res = await pool.query('SELECT * FROM workout');
        return response.json(res.rows);
    } catch (err) {
        console.error(err);
        return response.json({
            error: err.message
        });
    }
}

const getWorkoutByName = (request, response) => {
    const name = request.params.name;
    const queryText = 'SELECT * FROM workout WHERE name = $1';
    pool.query(queryText, [name], (err, results) => {
        if(err) {
            console.log(err);
        } else {
            response.json(results.rows);
        }
    });
}

const getAllExcercises = (request, response) => {
    const queryText = 'SELECT * FROM excercises ORDER BY name ASC';
    pool.query(queryText, (err, results) => {
        if(err) {
            console.log(err);
        } else {
            response.json(results.rows);
        }
    });
}

//Returns all the excercises within the given workout.
const getExcercisesForWorkoutWithId = (request, response) => {
    const id = request.params.workout_id;
    const queryText = 'SELECT * FROM excercises WHERE workout_id = $1';
    pool.query(queryText, [id], (err, results) => {
        if(err) {
            console.log(err);
        } else {
            response.json(results.rows);
        }
    });
}

const getAllCompletedTrainigs = (request, response) => {
    const queryText = `SELECT 
                        training_complete.id AS complete_id,
                        training_complete.start_time AS start_time,
                        training_complete.finish_time AS finish_time,
                        training_complete.workout_id AS workout_id,
                        training_complete.comment AS comment,
                        training_complete.weight AS weight,
                        workout.name AS workout_name,
                        workout.colour AS colour
                       FROM training_complete, workout 
                       WHERE workout.id = training_complete.workout_id
                       ORDER BY start_time ASC`;
    pool.query(queryText, (err, results) => {
        if(err) {
            console.log(err);
        } else {
            response.json(results.rows);
        }
    });
}

/**
 * INSERT INTO THE DATABASE:
 */

const createWorkout = (request, response) => {
    const name = request.body.name;
    const queryText = 'INSERT INTO workout(name) VALUES($1) RETURNING *';
    pool.query(queryText, [name], (err, results) => {
        if(err) {
            console.log(err);
        } else {
            response.json(results.rows);
        }
    });
}

const createExcercise = (request, response) => {
    const name = request.body.name;
    const workout_id = request.body.workout_id;
    const queryText = 'INSERT INTO excercises(name, workout_id) VALUES($1, $2) RETURNING *';
    pool.query(queryText, [name, workout_id], (err, results) => {
        if(err) {
            console.log(err);
        } else {
            response.json(results.rows);
        }
    });
}

const createCompletedTraining = (request, response) => {
    const start = request.body.start_time;
    const finish = request.body.finish_time;
    const workout_id = request.body.workout_id;
    const comment = request.body.comment;
    const weight = request.body.weight;
    const queryText = 'INSERT INTO training_complete(start_time, finish_time, workout_id, comment, weight) VALUES($1, $2, $3, $4, $5) RETURNING *';
    pool.query(queryText, [start, finish, workout_id, comment, weight], (err, results) => {
        if(err) {
            console.log(err);
        } else {
            response.json(results.rows);
        }
    });
}

/**
 * DELETING FROM TABLES:
 */

const deleteCompletedTrainingWithId = (request, response) => {
    const id = request.body.id;
    const queryText = 'DELETE FROM training_complete where id=$1 RETURNING *'
    pool.query(queryText, [id], (err, results) => {
        if(err) {
            console.log(err);
        } else {
            response.json(results.rows);
        }
    });
}

/**
 * UPDATING VALUES:
 */

const updateCompletedTraining = (request, response) => {
    const id = request.body.id;
    const start = request.body.start_time;
    const finish = request.body.finish_time;
    const workout_id = request.body.workout_id;
    const comment = request.body.comment;
    const weight = request.body.weight;
    const queryText = `UPDATE training_complete 
                       SET start_time = $2, 
                           finish_time = $3, 
                           workout_id = $4,
                           comment = $5,
                           weight = $6
                       WHERE id = $1
                       RETURNING *`;
    pool.query(queryText, [id, start, finish, workout_id, comment, weight], (err, results) => {
        if(err) {
            console.log(err);
        } else {
            response.json(results.rows);
        }
    });
}

module.exports = {
    getAllWorkouts,
    getWorkoutByName,
    getAllExcercises,
    getExcercisesForWorkoutWithId,
    getAllCompletedTrainigs,

    createWorkout,
    createExcercise,
    createCompletedTraining,

    deleteCompletedTrainingWithId,

    updateCompletedTraining
}