const { combineReducers } = require('redux');
const entries = require('./entries.js');
const exercises = require('./exercises.js');
const archivedExercises = require('./archived-exercises.js');
const user = require('./user.js');

const rootReducers = combineReducers({
    entries,
    exercises,
    archivedExercises,
    user,
});

module.exports = rootReducers;
