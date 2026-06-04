import ActivityCard from "./ActivityCard";
import { CombatIcon, FarmingIcon, MiningIcon } from "./icons";
import "./dashboard.css";

interface DashboardTypes {
    isAuthenticated: boolean;
    detectClick: (buttonType: string) => void;
}

const activities = [
    {
        icon: <CombatIcon />,
        title: "Combat",
        description: "Fight monsters to earn Combat XP and loot.",
        actionLabel: "Fight",
        accent: "#c0392b",
        onAction: () => {},
    },
    {
        icon: <FarmingIcon />,
        title: "Farming",
        description: "Harvest crops to earn Farming XP and resources.",
        actionLabel: "Farm",
        accent: "#4a9d4e",
        onAction: () => {},
    },
    {
        icon: <MiningIcon />,
        title: "Mining",
        description: "Mine ore to earn Mining XP and resources.",
        actionLabel: "Mine",
        accent: "#4a6fa5",
        onAction: () => {},
    },
];

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

            {isAuthenticated === true && (
                <main className="dashboard-main">
                    <h2 className="dashboard-heading">Activities</h2>
                    <div className="activities">
                        {activities.map((activity) => (
                            <ActivityCard
                                key={activity.title}
                                icon={activity.icon}
                                title={activity.title}
                                description={activity.description}
                                actionLabel={activity.actionLabel}
                                accent={activity.accent}
                                onAction={activity.onAction}
                            />
                        ))}
                    </div>
                </main>
            )}
        </div>
    );
}
