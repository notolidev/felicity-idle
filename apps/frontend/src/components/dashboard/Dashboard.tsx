import { useState } from "react";
import { CombatIcon, FarmingIcon, MiningIcon } from "../icons/icons";
import ActivityCard from "./cards/ActivityCard";
import CoinsDisplay from "./cards/CoinsDisplay";
import SkillCard from "./cards/SkillCard";
import type { CombatResult } from "@felicity/shared";
import "./dashboard.css";
import axios from "axios";

interface DashboardTypes {
    isAuthenticated: boolean;
    detectClick: (buttonType: string) => void;
}

export default function Dashboard({
    isAuthenticated,
    detectClick,
}: DashboardTypes) {
    const [combatXp, setCombatXp] = useState(0);
    const [purse, setPurse] = useState(0);
    const [combatCooldown, setCombatCooldown] = useState(false);
    const [fightOutcome, setFightOutcome] = useState<CombatResult | null>(null);

    function handleFight() {
        if (combatCooldown === true) {
            return;
        }

        const result: CombatResult = { result: "loss", coins: 0, xp: 0 };
        setCombatXp((xp) => xp + result.xp);
        setPurse((coins) => coins + result.coins);
        setFightOutcome(result);

        axios({
            method: "POST",
            url: "//localhost:3000/skill/combat",
            data: {},
        })
            .then((res) => {
                if (res.status === 200) {
                }
            })
            .catch((err) => {
                console.log(err);
            });

        setCombatCooldown(true);
        setTimeout(() => {
            setCombatCooldown(false);
            setFightOutcome(null);
        }, 2000);
    }

    const skills = [
        {
            icon: <CombatIcon />,
            name: "Combat",
            xp: combatXp,
            accent: "#c0392b",
        },
        { icon: <FarmingIcon />, name: "Farming", xp: 0, accent: "#4a9d4e" },
        { icon: <MiningIcon />, name: "Mining", xp: 0, accent: "#4a6fa5" },
    ];

    const activities = [
        {
            icon: <CombatIcon />,
            title: "Combat",
            description: "Fight monsters to earn Combat XP and loot.",
            actionLabel: combatCooldown === true ? "Resting…" : "Fight",
            accent: "#c0392b",
            onAction: handleFight,
            disabled: combatCooldown,
        },
        {
            icon: <FarmingIcon />,
            title: "Farming",
            description: "Harvest crops to earn Farming XP and resources.",
            actionLabel: "Farm",
            accent: "#4a9d4e",
            onAction: () => {},
            disabled: false,
        },
        {
            icon: <MiningIcon />,
            title: "Mining",
            description: "Mine ore to earn Mining XP and resources.",
            actionLabel: "Mine",
            accent: "#4a6fa5",
            onAction: () => {},
            disabled: false,
        },
    ];

    return (
        <div className="dashboard">
            <nav className="navbar">
                <span className="navbar-brand">Felicity</span>
                <div className="navbar-right">
                    {isAuthenticated === true && (
                        <CoinsDisplay purse={purse} bank={0} />
                    )}
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
                </div>
            </nav>

            {fightOutcome !== null && (
                <div
                    className={
                        fightOutcome.result === "win"
                            ? "combat-toast combat-toast-win"
                            : "combat-toast combat-toast-loss"
                    }
                >
                    {fightOutcome.result === "win"
                        ? `Victory! +${fightOutcome.xp} XP, +${fightOutcome.coins} coins`
                        : "Defeat. You came away with nothing"}
                </div>
            )}

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
                                disabled={activity.disabled}
                            />
                        ))}
                    </div>

                    <h2 className="dashboard-heading">Skills</h2>
                    <div className="skills">
                        {skills.map((skill) => (
                            <SkillCard
                                key={skill.name}
                                icon={skill.icon}
                                name={skill.name}
                                xp={skill.xp}
                                accent={skill.accent}
                            />
                        ))}
                    </div>
                </main>
            )}
        </div>
    );
}
