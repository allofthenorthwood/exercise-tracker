const React = require('react');
const { connect } = require('react-redux');

const firebase = require('firebase');

const actions = require('./actions/index.js');
const TablePage = require('./components/TablePage.jsx');
const LoginPage = require('./components/LoginPage.jsx');

const config = {
    apiKey: "AIzaSyAY2X7ebiNT8N-uyGzCyWqgvbBE4PuJh3c",
    authDomain: "fiery-heat-5035.firebaseapp.com",
    databaseURL: "https://fiery-heat-5035.firebaseio.com",
    storageBucket: "fiery-heat-5035.appspot.com",
};
firebase.initializeApp(config);

const rootRef = firebase.database().ref();

const RP = React.PropTypes;

let App = React.createClass({
    propTypes: {
        user: RP.string,
        entries: RP.array,
        exercises: RP.array,
        arcivedExercises: RP.array,

        login: RP.func,
        logout: RP.func,
        loadData: RP.func,
    },
    componentDidMount: function() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.login(user.uid);
            } else {
                this.props.logout();
            }
        });
        this.loadUserData();
    },
    componentDidUpdate: function(newProps) {
        if (this.props.user !== newProps.user) {
            this.loadUserData();
        } else if (this.props.user) {
            this.saveUserData();
        }
    },

    loadUserData: function() {
        const user = firebase.auth().currentUser;
        if (!this.props.user && user) {
            this.props.login(user.uid);
        }
        if (user) {
            const child = ref.child("users").child(user.uid);
            child.once("value").then((data) => {
                const archivedExercises = data
                    .child("archivedExercises").val();
                const exercises = data.child("exercises").val();
                const entries = data.child("entries").val();
                this.props.loadData(entries, exercises, archivedExercises);
            }).catch((e) => {
                console.log(e);
            });
        }
    },
    saveUserData: function() {
        if (this.props.exercises.length ||
            this.props.entries.length ||
            this.props.archivedExercises.length
        ) {
            const user = ref.getAuth();
            const child = ref.child("users").child(user.uid);
            child.update({
                archivedExercises: this.props.archivedExercises || [],
                exercises: this.props.exercises,
                entries: this.props.entries,
            });
        }
    },
    render: function() {
        if (!this.props.user) {
            return <LoginPage/>;
        }
        return <TablePage
            {...this.props}
            logout={() =>firebase.auth().signOut()}
        />;
    }
});

const mapStateToProps = (state, ownProps) => {
    return state;
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadData: (entries, exercises, archivedExercises) => {
            dispatch(actions.loadExercises(exercises));
            dispatch(actions.loadEntries(entries));
            dispatch(actions.loadArchivedExercises(archivedExercises));
        },
        login: (userId) => {
            dispatch(actions.login(userId));
        },
        logout: () => {
            dispatch(actions.loadArchivedExercises(null));
            dispatch(actions.loadExercises(null));
            dispatch(actions.loadEntries(null));
            dispatch(actions.logout());
        },
        addEntry: () => {
            dispatch(actions.addEntry());
        },
        deleteEntry: (id) => {
            dispatch(actions.deleteEntry(id));
        },
        updateEntryDate: (id, date) => {
            dispatch(actions.updateEntryDate(id, date));
        },
        addExerciseToEntry: (entryId, exercise, weight, reps) => {
            dispatch(actions.addExerciseToEntry(
                entryId, exercise, weight, reps));
        },
        addExercise: (name) => {
            dispatch(actions.addExercise(name));
        },
        archiveExercise: (id, exerciseData) => {
            dispatch(actions.archiveExercise(id, exerciseData));
        },
        moveExerciseUp: (id) => {
            dispatch(actions.moveExerciseUp(id));
        },
        moveExerciseDown: (id) => {
            dispatch(actions.moveExerciseDown(id));
        },
        updateExercise: (id, date) => {
            dispatch(actions.updateExercise(id, date));
        },
    };
};

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

module.exports = App;