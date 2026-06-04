import "./dashboard.css";

interface DashboardTypes {
    isAuthenticated: boolean;
    detectClick: (buttonType: string) => void;
}

export default function Dashboard({
    isAuthenticated,
    detectClick,
}: DashboardTypes) {
    return (
        <div className="dashboard">
            <nav className="navbar">
                <span className="navbar-brand">Felicity</span>
                <span
                    className="navbar-signin"
                    onClick={() => {
                        const buttonType: any =
                            isAuthenticated === true ? "signout" : "signin";

                        detectClick(buttonType);
                    }}
                >
                    {isAuthenticated === true ? "Sign Out" : "Sign In"}
                </span>
            </nav>
        </div>
    );
}
