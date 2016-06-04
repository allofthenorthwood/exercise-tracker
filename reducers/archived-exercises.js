const archivedExercises = (state = [], action) => {
    switch (action.type) {
        case 'LOAD_ARCHIVED_EXERCISES':
            return action.exercises || [];
        case 'ARCHIVE_EXERCISE':
            return [
                ...state,
                action.exercise,
            ];
        default:
            return state;
    }
};

module.exports = archivedExercises;