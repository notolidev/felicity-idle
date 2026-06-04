import { passwordCriteria } from "../../backend/src/db/schema";
import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router";
import AuthLayout from "./components/auth/AuthLayout";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Dashboard from "./components/dashboard/Dashboard";
import "./app.css";

axios.defaults.withCredentials = true;

export default function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("Sign Up");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    let navigate = useNavigate();

    useEffect(() => {
        axios({
            method: "GET",
            url: "//localhost:3000/auth/me",
        }).then((res) => {
            if (res.status === 200) {
                setIsAuthenticated(true);
            } else if (res.status === 401) {
                axios({
                    method: "GET",
                    url: "//localhost:3000/auth/refresh",
                }).then((res2) => {
                    if (res2.status === 200) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                });
                setIsAuthenticated(false);
            }
        });
    }, []);

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

    function detectClick(buttonType: string) {
        if (buttonType === "signout") {
            axios({ method: "GET", url: "//localhost:3000/auth/signout" }).then(
                (res: any) => {
                    console.log(res.data);
                    if (res.data === "OK") {
                        setIsAuthenticated(false);
                        navigate("/");
                    }
                },
            );
        } else if (buttonType === "signin") {
            navigate("/signin");
        }
    }

    async function detectSubmit(form: string) {
        if (!username || !password) {
            setMessage("Please fill out all fields.");
            return;
        }

        const checkPasswordValue: string = checkPassword(password);

        if (checkPasswordValue === "200") {
            if (form === "signin") {
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
                        setIsAuthenticated(true);

                        navigate("/");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else if (form === "signup") {
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

                        navigate("/");
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
        <Routes>
            <Route
                path="/"
                element={
                    <Dashboard
                        isAuthenticated={isAuthenticated}
                        detectClick={detectClick}
                    />
                }
            />
            <Route element={<AuthLayout />}>
                <Route
                    path="/signin"
                    element={
                        <SignIn
                            username={username}
                            password={password}
                            setUsername={setUsername}
                            setPassword={setPassword}
                            onSubmit={() => {
                                detectSubmit("signin");
                            }}
                        />
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <SignUp
                            message={message}
                            username={username}
                            password={password}
                            setUsername={setUsername}
                            setPassword={setPassword}
                            onSubmit={() => {
                                detectSubmit("signup");
                            }}
                        />
                    }
                />
            </Route>
        </Routes>
    );
}
