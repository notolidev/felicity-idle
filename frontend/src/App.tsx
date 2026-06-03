"use client";

// import { passwordCriteria } from "../../backend/src/db/schema";
// import { useState } from "react";
import axios from "axios";
// import SignIn from "./components/auth/SignIn";
// import SignUp from "./components/auth/SignUp";
import Dashboard from "./components/dashboard/Dashboard";
import "./app.css";

axios.defaults.withCredentials = true;

export default function App() {
    // const [form, setForm] = useState("signIn");
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [message, setMessage] = useState("Sign Up");

    /*
    function checkPassword(password: string): string {
        if (password.length < passwordCriteria.minimumLength) {
            return `Your password must be at least ${passwordCriteria.minimumLength} characters.`;
        }

        if (passwordCriteria.mustHaveCapitalLetter && !/[A-Z]/.test(password)) {
            return "Your password must contain a capital letter.";
        }

        if (passwordCriteria.mustHaveNumber && !/[0-9]/.test(password)) {
            return "Your password must contain a number.";
        }

        return "200";
    }

    async function detectSubmit() {
        if (!username || !password) {
            setMessage("Please fill out all fields.");
            return;
        }

        const checkPasswordValue: string = checkPassword(password);

        if (checkPasswordValue === "200") {
            if (form === "signIn") {
                axios({
                    method: "POST",
                    url: "//localhost:3000/auth/signin",
                    data: {
                        username: username,
                        password: password,
                    },
                })
                    .then((res) => {
                        setMessage(res.data);
                        setUsername("");
                        setPassword("");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else if (form === "signUp") {
                axios({
                    method: "POST",
                    url: "//localhost:3000/auth/signup",
                    data: {
                        username: username,
                        password: password,
                    },
                })
                    .then((res) => {
                        setMessage(res.data);
                        setUsername("");
                        setPassword("");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        } else {
            setMessage(checkPasswordValue);
        }
    }
    */

    return <Dashboard />;

    /*
    return (
        <div className="auth-container">
            <button
                onClick={() => {
                    form == "signIn"
                        ? setForm("signUp")
                        : form == "signUp"
                          ? setForm("signIn")
                          : null;
                }}
            >
                Change form
            </button>
            {form == "signIn" ? (
                <SignIn
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    onSubmit={detectSubmit}
                />
            ) : form == "signUp" ? (
                <SignUp
                    message={message}
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    onSubmit={detectSubmit}
                />
            ) : (
                <h1>Wrong!</h1>
            )}
        </div>
    );
    */
}
