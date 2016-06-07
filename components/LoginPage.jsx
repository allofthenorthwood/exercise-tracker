const { StyleSheet, css } = require('../lib/aphrodite.js');
const React = require("react");

const RP = React.PropTypes;

const LoginPage = React.createClass({
    getInitialState: function() {
        return {
            email: '',
            password: '',
            error: null,
        };
    },
    createUser: function(e) {
        e && e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(
            this.state.email, this.state.password
        ).catch((error) => {
                console.log(error)
            if (error) {
                if (error.message ===
                        "The email address is already in use by another account.") {
                    this.login();
                } else {
                    this.setState({
                        error: error.message,
                    });
                }
            }
        });
    },
    login: function(e) {
        e && e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(
            this.state.email, this.state.password
        ).catch(
            (error) => {
            if (error) {
                this.setState({
                    error: error.message,
                });
            }
        });
    },
    render: function() {
        return <div className={css(ST.wrapper)}>
            <form onSubmit={this.login} className={css(ST.form)}>
                <h1 className={css(ST.title)}>Exercise Tracker</h1>
                {this.state.error && <div className={css(ST.error)}>
                    {this.state.error}
                </div>}
                <div>
                    <input
                        className={css(ST.input)}
                        placeholder="Email"
                        value={this.state.email}
                        onChange={(e) => {
                            this.setState({ email: e.target.value });
                        }}
                    />
                </div>
                <div>
                    <input
                        className={css(ST.input)}
                        value={this.state.password}
                        type="password"
                        placeholder="Password"
                        onChange={(e) => {
                            this.setState({ password: e.target.value });
                        }}
                    />
                </div>
                <div>
                    <input
                        className={css(ST.input, ST.submit)}
                        type="submit"
                        value="Login"
                    />
                    <input
                        className={css(ST.input, ST.submit)}
                        type="button"
                        onClick={this.createUser}
                        value="Signup"
                    />
                </div>
            </form>
        </div>;
    }
});

const ST = StyleSheet.create({
    wrapper: {
        display: "flex",
        justifyContent: "center",
    },
    title: {
        fontSize: 30,
        textAlign: "center",
        marginTop: 50,
        marginBottom: 20,
    },
    form: {
        maxWidth: 300,
        flex: 1,
    },
    input: {
        background: "#fff",
        border: "1px solid #ddd",
        fontSize: 14,
        fontFamily: "inherit",
        marginBottom: 5,
        marginTop: 5,
        padding: "10px 15px",
        transition: "box-shadow 0.1s ease-out",
        width: "100%",
        ":focus": {
            borderColor: "#ca337c",
            boxShadow: "0 0 0 2px #ca337c",
            outline: "none",
        },
    },
    error: {
        background: "#F9E6EF",
        border: "1px solid red",
        color: "#ca337c",
        padding: "10px 15px",
        lineHeight: 1.2,
        fontSize: 14,
        marginBottom: 5,
    },
    submit: {
        background: "#ca337c",
        border: "none",
        borderRadius: 2,
        color: "#fff",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: "normal",
        ":hover": {
            background: "#9e034e",
        },
        ":focus": {
            background: "#9e034e",
            border: "none",
            boxShadow: "none",
        },
    }
});

module.exports = LoginPage;