"use client";

import { useState } from "react";
import "./app.css";

export default function App() {
    const [form, setForm] = useState("signIn");

    return (
        <div className="auth-container">
            <button
                onClick={() => {
                    if (form === "signUp") {
                        setForm("signIn");
                    } else if (form === "signIn") {
                        setForm("signUp");
                    }
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
                        <input type="text" placeholder="Username" />
                    </label>
                    <label>
                        Password
                        <input type="password" placeholder="Password" />
                    </label>
                    <button type="button">Sign In</button>
                </div>
            ) : form == "signUp" ? (
                /* Sign Up */
                <div className="auth-card">
                    <h2>Sign Up</h2>
                    <label>
                        Username
                        <input type="text" placeholder="Username" />
                    </label>
                    <label>
                        Password
                        <input type="password" placeholder="Password" />
                    </label>
                    <button type="button">Sign Up</button>
                </div>
            ) : (
                <h1>Wrong!</h1>
            )}
        </div>
    );
}
