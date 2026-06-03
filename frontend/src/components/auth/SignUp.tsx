type SignUpProps = {
    message: string;
    username: string;
    password: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: () => void;
};

export default function SignUp({
    message,
    username,
    password,
    setUsername,
    setPassword,
    onSubmit,
}: SignUpProps) {
    return (
        <div className="auth-card">
            <h2>{message}</h2>
            <label>
                Username
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value);
                    }}
                />
            </label>
            <button type="button" onClick={onSubmit}>
                Sign Up
            </button>
        </div>
    );
}
