const exercise = (state, action) => {
    switch (action.type) {
        case 'ADD_EXERCISE': {
            let highestId = 0;
            state.forEach((exercise) => {
                highestId = exercise.id > highestId ? exercise.id : highestId;
            });
            return {
                id: highestId + 1,
                exId: `ex-${highestId + 1}`,
                name: action.name || 'new exercise',
                archived: false,
            };
        }
        case 'UPDATE_EXERCISE':
            return {
                ...state,
                name: action.name || state.name,
            };
        case 'ARCHIVE_EXERCISE':
            return {
                ...state,
                archived: true,
            };
        default:
            return state;
    }
};

const exercises = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_EXERCISES':
            return action.exercises || [];
        case 'ADD_EXERCISE':
            return [
                ...state,
                exercise(state, action),
            ];
        case 'ARCHIVE_EXERCISE': {
            const updatedExercise = state.findIndex((a) => {
                return a.id === action.id;
            });
            const newState = [...state];
            newState[updatedExercise] = exercise(
                state[updatedExercise], action);
            return newState;
        }
        case 'UPDATE_EXERCISE': {
            const updatedExercise = state.findIndex((a) => {
                return a.id === action.id;
            });
            const newState = [...state];
            newState[updatedExercise] = exercise(
                state[updatedExercise], action);
            return newState;
        }
        case 'MOVE_EXERCISE_UP': {
            const movedExercise = state.findIndex((a) => {
                return a.id === action.id;
            });
            if (movedExercise === 0) {
                return state;
            }
            const newState = [...state];
            const temp = newState[movedExercise - 1];
            newState[movedExercise - 1] = newState[movedExercise];
            newState[movedExercise] = temp;
            return newState;
        }
        case 'MOVE_EXERCISE_DOWN': {
            const movedExercise = state.findIndex((a) => {
                return a.id === action.id;
            });
            if (movedExercise === state.length - 1) {
                return state;
            }
            const newState = [...state];
            const temp = newState[movedExercise + 1];
            newState[movedExercise + 1] = newState[movedExercise];
            newState[movedExercise] = temp;
            return newState;
        }
        default:
            return state;
    }
};

module.exports = exercises;