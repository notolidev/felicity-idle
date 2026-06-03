"use client";

import { useState } from "react";
import axios from "axios";
import "./app.css";

export default function App() {
    const [form, setForm] = useState("signIn");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function detectSubmit() {
        if (form === "signIn") {
            axios({
                method: "POST",
                url: "//localhost:3000/api/signin",
                data: {
                    username: username,
                    password: password,
                },
            });
            setUsername("");
            setPassword("");
        } else if (form === "signUp") {
            axios({
                method: "POST",
                url: "//localhost:3000/api/signup",
                data: {
                    username: username,
                    password: password,
                },
            });
            setUsername("");
            setPassword("");
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
                    <h2>Sign Up</h2>
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
