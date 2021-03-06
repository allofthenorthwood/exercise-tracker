const { StyleSheet, css } = require('../lib/aphrodite.js');
const React = require('react');
const moment = require('moment');

const SS = require('../styles.js');

const ExerciseImage = require('./ExerciseImage.jsx');
const ExerciseModal = require('./ExerciseModal.jsx');
const Icon = require('./Icon.jsx');

const RP = React.PropTypes;

const ClickToEdit = React.createClass({
    propTypes: {
        text: RP.string,
        placeholder: RP.string,
        placeholderStyles: RP.oneOfType([RP.object, RP.bool]),
        textStyles: RP.oneOfType([RP.object, RP.bool]),
        inputStyles: RP.oneOfType([RP.object, RP.bool]),
    },
    getDefaultProps: function() {
        return {
            selectAllOnClick: false,
        };
    },
    getInitialState: function() {
        return {
            isEditing: false,
            text: this.props.text || "",
        };
    },
    setEditing: function() {
        this.setState({
            isEditing: true,
        });
    },
    handleOnChange: function(e) {
        this.setState({
            text: e.target.value,
        });
    },
    handleOnBlur: function(e) {
        this.props.onSubmit(this.state.text);
        this.setState({
            isEditing: false,
        });
    },
    handleOnFocus: function(e) {
        const textLength = this.state.text.length;
        if (this.props.selectAllOnClick) {
            e.target.setSelectionRange(0, textLength);
        } else {
            e.target.setSelectionRange(textLength, textLength);
        }
    },
    render: function() {
        const {
            inputStyles,
            placeholderStyles,
            placeholder,
            textStyles,
        } = this.props;
        const {
            text
        } = this.state;
        if (this.state.isEditing) {
            return <form
                onSubmit={(e) => {
                    e.preventDefault();
                    this.handleOnBlur();
                }}
            >
                <input
                    className={css(inputStyles, ST.input)}
                    value={text}
                    placeholder={placeholder}
                    onChange={this.handleOnChange}
                    onBlur={this.handleOnBlur}
                    autoFocus={true}
                    onFocus={this.handleOnFocus}
                />
            </form>;
        }
        return <span
            className={css(
                ST.editableText,
                !text && ST.placeholderText,
                textStyles,
                !text && placeholderStyles
            )}
            onClick={this.setEditing}
            onFocus={this.setEditing}
            tabIndex={0}
        >
            {text || placeholder}
        </span>;
    },
});

const TablePage = React.createClass({
    propTypes: {
        entries: RP.arrayOf(RP.shape({
            date: RP.number,
            exercises: RP.object,
            id: RP.number,
        })),
        exercises:  RP.arrayOf(RP.shape({
            name: RP.string,
            id: RP.number,
        })),
        addExercise: RP.func,
        addExerciseToEntry: RP.func,
        addEntry: RP.func,
        deleteEntry: RP.func,
        archiveExercise: RP.func,
        updateEntryDate: RP.func,
        updateExercise: RP.func,
    },

    getInitialState: function() {
        return {
            showExerciseModal: false,
        };
    },
    addExercise: function(exercise) {
        this.props.addExercise(exercise);
        this.hideExerciseModal();
    },

    showExerciseModal: function() {
        this.setState({
            showExerciseModal: true,
        });
    },
    hideExerciseModal: function() {
        this.setState({
            showExerciseModal: false,
        });
    },

    render: function() {
        const {
            updateEntryDate,
            updateExercise,
            addExerciseToEntry,
        } = this.props;

        const entries = this.props.entries.filter((e) => {
            return !e.deleted;
        });
        entries.sort((entry1, entry2) => {
            // show newest dates on the left/first
            return entry1.date < entry2.date ? 1 : -1;
        });

        const exercises = this.props.exercises.filter((e) => {
            return !e.archived;
        });

        return (<div className={css(ST.page)}>
            {this.state.showExerciseModal && <ExerciseModal
                close={this.hideExerciseModal}
                addExercise={this.addExercise}
            />}
            <div className={css(ST.header)}>
                <button
                    className={css(ST.button, ST.buttonLight)}
                    onClick={() => {
                        this.props.logout()
                    }}
                >
                    Logout
                </button>
            </div>

            <h1 className={css(ST.title)}>Weight Lifting Tracker</h1>

            <div className={css(ST.addEntryButtonWrapper)}>
                <button
                    className={css(ST.button, ST.addEntryButton)}
                    onClick={() => {
                        this.props.addEntry();
                    }}
                >
                    New Entry
                    <span className={css(ST.plusIcon)}>
                        <Icon
                            type="plus"
                            size={15}
                            color="#fff"
                        />
                    </span>
                </button>
            </div>

            <div className={css(ST.table)}>
                <div className={css(ST.column, ST.exerciseColumn)}>
                    <div
                        className={css(ST.cell)}
                    >
                    </div>
                    {exercises && exercises.map((exercise, exerciseIdx) => {
                        const exOptions = ExerciseImage.exerciseOptions();
                        const hasImage = exOptions.indexOf(exercise.name) > -1;
                        const id = exercise.id;
                        return <div
                            key={exercise.id}
                            className={css(
                                ST.cell,
                                ST.exerciseCell,
                                !(exerciseIdx % 2) && ST.darkCell
                            )}
                        >
                            <div className={css(ST.exerciseControls)}>
                                <a
                                    href="#"
                                    className={css(
                                        ST.exerciseMoveButton,
                                        ST.exerciseMoveUpButton
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.props.moveExerciseUp(id);
                                    }}
                                >
                                    <Icon
                                        type="angleBracketLeft"
                                        color="#999"
                                        size={15}
                                    />
                                </a>
                                <button
                                    className={css(ST.exerciseDeleteButton)}
                                    onClick={() => {
                                        this.props.archiveExercise(id,
                                            exercise);
                                    }}
                                >&times;</button>
                                <a
                                    href="#"
                                    className={css(
                                        ST.exerciseMoveButton,
                                        ST.exerciseMoveDownButton
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.props.moveExerciseDown(id);
                                    }}
                                >
                                    <Icon
                                        type="angleBracketLeft"
                                        color="#999"
                                        size={15}
                                    />
                                </a>
                            </div>
                            {hasImage &&
                                <ExerciseImage
                                    type={exercise.name}
                                    height={80}
                                />
                            }
                            {!hasImage && <ClickToEdit
                                text={exercise.name}
                                onSubmit={(newName) => {
                                    updateExercise(id, newName);
                                }}
                            />}
                        </div>;
                    })}
                    <div
                        className={css(ST.cell)}
                    >
                        <button
                            onClick={this.showExerciseModal}
                            className={css(ST.button, ST.buttonLight)}
                        >
                            Add Exercise
                        </button>
                    </div>
                </div>
                <div className={css(ST.results)}>
                    <div className={css(ST.resultsInner)}>
                        {entries && entries.map((entry, entryIdx) => {
                            return <div
                                className={css(
                                    ST.column,
                                    entryIdx === 0 && ST.highlightColumn
                                )}
                                key={entry.id}
                            >
                                <div
                                    className={css(ST.cell)}
                                >
                                    <ClickToEdit
                                        text={
                                            moment(entry.date).format('MMM Do')
                                        }
                                        selectAllOnClick={true}
                                        onSubmit={(newDate) => {
                                            updateEntryDate(
                                                entry.id,
                                                moment(newDate, "MMM Do")
                                                    .valueOf(),
                                                null
                                            );
                                        }}
                                    />
                                </div>
                                {exercises && exercises.map(
                                    (exercise, exerciseIdx) => {
                                    const ex = entry.exercises &&
                                        entry.exercises[exercise.exId];
                                    return <div
                                        className={css(
                                            ST.cell,
                                            ST.dataCell,
                                            !(exerciseIdx % 2) && ST.darkCell
                                        )}
                                        key={exercise.id}
                                    >
                                        <div className={css(ST.weight)}>
                                            <ClickToEdit
                                                text={ex && ex.weight}
                                                placeholder="(weight)"
                                                onSubmit={(weight) => {
                                                    addExerciseToEntry(
                                                        entry.id,
                                                        exercise.exId,
                                                        weight || null,
                                                        ex ? ex.reps : null
                                                    )
                                                }}
                                                placeholderStyles={
                                                    entryIdx !== 0 &&
                                                        ST.lightPlaceholder
                                                }
                                            />
                                        </div>
                                        <div className={css(ST.reps)}>
                                            <ClickToEdit
                                                text={ex && ex.reps}
                                                placeholder={"(reps)"}
                                                onSubmit={(reps) => {
                                                    addExerciseToEntry(
                                                        entry.id,
                                                        exercise.exId,
                                                        ex ? ex.weight : null,
                                                        reps || null
                                                    )
                                                }}
                                                placeholderStyles={
                                                    entryIdx !== 0 &&
                                                        ST.lightPlaceholder
                                                }
                                            />
                                        </div>
                                    </div>;
                                })}
                                <div className={css(ST.cell)}>
                                    <button
                                        className={css(ST.deleteButton)}
                                        onClick={() => {
                                            this.props.deleteEntry(entry.id);
                                        }}
                                    >
                                        Delete Entry
                                    </button>
                                </div>
                            </div>;
                        })}
                    </div>
                </div>
            </div>
        </div>);
    }
});

const ST = StyleSheet.create({
    page: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 30,
    },
    header: {
        textAlign: "right",
    },

    title: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 30,
        textAlign: "center",
    },
    table: {
        display: "flex",
        alignItems: "flex-start",
    },
    results: {
        display: "flex",
        flex: 1,
        alignSelf: "stretch",
        overflowX: "auto",
    },
    resultsInner: {
        display: "flex",
    },
    column: {
        alignSelf: "stretch",
        borderRight: "1px solid #ddd",
        width: 120,
    },
    highlightColumn: {
        border: `2px solid ${SS.colors.green.light}`,
        borderLeft: "none",
    },
    addEntryColumn: {
        width: 60,
    },
    exerciseColumn: {
        width: 160,
        borderRight: `2px solid ${SS.colors.green.light}`,
    },
    exerciseCell: {
        flexDirection: "column",
        position: "relative",
    },
    cell: {
        height: 100,
        padding: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    darkCell: {
        background: "#fafafa",
    },

    dataCell: {
        flexDirection: "column",
    },

    form: {

    },
    editableText: {
        display: "inline-block",
        padding: 5,
        textAlign: "center",
    },
    placeholderText: {
        color: "#999",
    },
    lightPlaceholder: {
        color: "#ccc",
    },
    input: {
        font: "inherit",
        fontSize: "inherit",
        textAlign: "center",
        width: "100%",
    },
    deleteButton: {
        background: "none",
        border: "1px solid #aaa",
        borderRadius: 30,
        color: "#888",
        cursor: "pointer",
        fontSize: 11,
        opacity: 0.8,
        padding: "6px 11px",
        ":hover": {
            opacity: 1,
        },
    },

    button: SS.button,
    buttonLight: SS.buttonLight,

    addEntryButtonWrapper: {
        textAlign: "center",
        marginBottom: 20,
    },
    addEntryButton: {
        fontSize: 20,
        lineHeight: "40px",
        paddingTop: 0,
        paddingBottom: 0,
    },
    plusIcon: {
        marginLeft: 10,
    },

    exerciseControls: {
        position: "absolute",
        left: -35,
        width: 30,
        top: 15,
        textAlign: "right",
    },
    exerciseDeleteButton: {
        background: "none",
        border: "none",
        color: "#888",
        cursor: "pointer",
        fontSize: 25,
        lineHeight: 1,
        margin: "4px 1px 0 0",
        opacity: 0.8,

        ":hover": {
            opacity: 1,
        },
    },
    exerciseMoveButton: {
        background: "none",
        border: "none",
        display: "flex",
        padding: 0,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.7,
        ":hover": {
            opacity: 1,
        },
    },
    exerciseMoveUpButton: {
        transform: "rotate(90deg)",
    },
    exerciseMoveDownButton: {
        transform: "rotate(-90deg)",
        height: 30,
        width: 30,
    },
});

module.exports = TablePage;