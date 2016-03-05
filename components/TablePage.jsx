const { StyleSheet, css } = require('../lib/aphrodite.js');
const React = require('react');
const moment = require('moment');


const RP = React.PropTypes;

const ClickToEdit = React.createClass({
    propTypes: {
        text: RP.string,
        inputClass: RP.object,
    },
    getInitialState: function() {
        return {
            isEditing: false,
            text: this.props.text,
        };
    },
    handleOnClick: function() {
        this.setState({
            isEditing: true,
        });
    },
    handleOnChange: function(e) {
        this.setState({
            text: e.target.value(),
        });
    },
    handleOnBlur: function(e) {
        //this.props.onSubmit();
        this.setState({
            isEditing: false,
        });
    },
    handleOnFocus: function(e) {
        e.target.setSelectionRange(0, e.target.value.length);
    },
    render: function() {
        const {
            inputClass,
            textClass,
        } = this.props;
        const {
            text
        } = this.state;
        if (this.state.isEditing) {
            return <input
                className={css(inputClass, ST.input)}
                value={text}
                onChange={this.handleOnChange}
                onBlur={this.handleOnBlur}
                autoFocus={true}
                onFocus={this.handleOnFocus}
            />
        }
        return <span onClick={this.handleOnClick}>
            {text}
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
        addEntry: RP.func,
        deleteEntry: RP.func,
    },

    render: function() {
        const {
            entries,
            exercises,
        } = this.props;

        return (<div className={css(ST.page)}>
            <h1 className={css(ST.title)}>Weight Lifting Tracker</h1>

            <div className={css(ST.table)}>
                <div className={css(ST.column)}>
                    <div
                        className={css(ST.cell)}
                    >
                    </div>
                    {exercises && exercises.map((exercise, idx) => {
                        return <div
                            key={idx}
                            className={css(ST.cell, ST.exerciseCell)}
                        >
                            {exercise.name}
                        </div>;
                    })}
                    <div
                        className={css(ST.cell)}
                    >
                        <button
                            onClick={() => {
                                this.props.addExercise();
                            }}
                        >
                            Add Exercise
                        </button>
                    </div>
                </div>
                <div className={css(ST.results)}>
                    <div className={css(ST.resultsInner)}>
                        {entries && entries.map((entry, entryIdx) => {
                            return <div
                                className={css(ST.column)}
                                key={entryIdx}
                            >
                                <div
                                    className={css(ST.cell)}
                                >
                                    <ClickToEdit
                                        inputClass={ST.dateInput}
                                        text={
                                            moment(entry.date).format('MMM Do')
                                        }
                                    />
                                </div>
                                {exercises && exercises.map(
                                    (exercise, exerciseIdx) => {
                                    const ex = entry.exercises[exercise.id];
                                    return ex && <div
                                        className={css(ST.cell)}
                                        key={exerciseIdx}
                                    >
                                        {ex}
                                    </div>;
                                })}
                                <button
                                    onClick={() => {
                                        this.props.deleteEntry(entry.id);
                                    }}
                                >Delete Entry</button>
                            </div>;
                        })}
                        <div className={css(ST.column)}>
                            <div
                                className={css(ST.cell)}
                            >
                                <button
                                    onClick={() => {
                                        this.props.addEntry();
                                    }}
                                >Add Entry</button>
                            </div>
                        </div>
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
        padding: 20,
    },
    title: {
        fontSize: 30,
        marginTop: 60,
        marginBottom: 20,
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
        borderRight: "1px solid #ddd",
        width: 120,
    },
    exerciseCell: {

    },
    cell: {
        height: 40,
        padding: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        font: "inherit",
        fontSize: "inherit",
        width: "100%",
    },
    dateInput: {
        textAlign: "center",
    },
});

module.exports = TablePage;