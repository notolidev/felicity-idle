import "./dashboard.css";

interface DashboardTypes {
    isAuthenticated: boolean;
}

export default function Dashboard({ isAuthenticated }: DashboardTypes) {
    return (
        <div className="dashboard">
            <nav className="navbar">
                <span className="navbar-brand">Felicity</span>
                <span className="navbar-signin">
                    {isAuthenticated === true ? "Sign Out" : "Sign In"}
                </span>
            </nav>
        </div>
    );
}
