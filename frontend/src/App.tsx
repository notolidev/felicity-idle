"use client";

import "./app.css";

export default function App() {
    return (
        <div className="auth-container">
            {/* Sign In */}
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

            {/* Sign Up */}
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
        </div>
    );
}
