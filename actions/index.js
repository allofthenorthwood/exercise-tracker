
// User actions
const login = (id) => {
    return {
        type: 'LOGIN',
        id: id,
    };
};

const logout = () => {
    return {
        type: 'LOGOUT',
    };
};

// Entries
const loadEntries = (entries) => {
    return {
        type: 'LOAD_ENTRIES',
        entries: entries,
    };
};
const addEntry = () => {
    return {
        type: 'ADD_ENTRY',
    };
};
const updateEntryDate = (id, date) => {
    return {
        type: 'UPDATE_ENTRY',
        id,
        date,
    };
};
const deleteEntry = (id) => {
    return {
        type: 'DELETE_ENTRY',
        id,
    };
};
const addExerciseToEntry = (entryId, exerciseId, weight, reps) => {
    return {
        type: 'ADD_EXERCISE_TO_ENTRY',
        entryId,
        exerciseId,
        weight,
        reps,
    };
};

// Exercises
const loadExercises = (exercises) => {
    return {
        type: 'LOAD_EXERCISES',
        exercises: exercises,
    };
};
const loadArchivedExercises = (archivedExercises) => {
    return {
        type: 'LOAD_ARCHIVED_EXERCISES',
        archivedExercises: archivedExercises,
    };
};
const addExercise = (name) => {
    return {
        type: 'ADD_EXERCISE',
        name: name,
    };
};
const updateExercise = (id, name) => {
    return {
        type: 'UPDATE_EXERCISE',
        id,
        name,
    };
};
const archiveExercise = (id, exercise) => {
    return {
        type: 'ARCHIVE_EXERCISE',
        id,
        exercise,
    };
};
const moveExerciseUp = (id) => {
    return {
        type: 'MOVE_EXERCISE_UP',
        id,
    };
};
const moveExerciseDown = (id) => {
    return {
        type: 'MOVE_EXERCISE_DOWN',
        id,
    };
};

module.exports = {
    login,
    logout,

    loadEntries,
    addEntry,
    addExerciseToEntry,
    deleteEntry,
    updateEntryDate,

    loadExercises,
    loadArchivedExercises,
    addExercise,
    updateExercise,
    archiveExercise,
    moveExerciseUp,
    moveExerciseDown,
};