"use client";

import { passwordCriteria } from "../../backend/src/db/schema";
import { useState } from "react";
import axios from "axios";
import "./app.css";

axios.defaults.withCredentials = true;

export default function App() {
    const [form, setForm] = useState("signIn");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("Sign Up");

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
                /* Sign In */
                <div className="auth-card">
                    <h2>Sign In</h2>
                    <label>
                        Username
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                setUsername(e.target.value);
                            }}
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </label>
                    <button type="button" onClick={detectSubmit}>
                        Sign In
                    </button>
                </div>
            ) : form == "signUp" ? (
                /* Sign Up */
                <div className="auth-card">
                    <h2>{message}</h2>
                    <label>
                        Username
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                setUsername(e.target.value);
                            }}
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </label>
                    <button type="button" onClick={detectSubmit}>
                        Sign Up
                    </button>
                </div>
            ) : (
                /* All goes wrong */
                <h1>Wrong!</h1>
            )}
        </div>
    );
}
