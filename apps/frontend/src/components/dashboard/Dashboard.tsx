import { useEffect, useRef, useState } from "react";
import { CombatIcon, FarmingIcon, MiningIcon } from "../icons/icons";
import ActivityCard from "./cards/ActivityCard";
import CoinsDisplay from "./cards/CoinsDisplay";
import CollectionCard from "./cards/CollectionCard";
import SkillCard from "./cards/SkillCard";
import Notification from "./Notification";
import type {
    CombatResult,
    GatherResult,
    CollectionEntry,
} from "@felicity/shared";
import { combatCooldownMs } from "@felicity/shared";
import "./dashboard.css";
import { api } from "../../api";

interface DashboardTypes {
    isAuthenticated: boolean;
    detectClick: (buttonType: string) => void;
}

type NotificationItem = {
    id: number;
    message: string;
    type: "success" | "error";
};

export default function Dashboard({
    isAuthenticated,
    detectClick,
}: DashboardTypes) {
    const [combatXp, setCombatXp] = useState(0);
    const [farmingXp, setFarmingXp] = useState(0);
    const [miningXp, setMiningXp] = useState(0);
    const [purse, setPurse] = useState(0);
    const [collections, setCollections] = useState<CollectionEntry[]>([]);
    const [combatCooldown, setCombatCooldown] = useState(false);
    const [farmingCooldownEnd, setFarmingCooldownEnd] = useState<number | null>(
        null,
    );
    const [miningCooldownEnd, setMiningCooldownEnd] = useState<number | null>(
        null,
    );
    const [now, setNow] = useState(() => Date.now());
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const nextNotificationId = useRef(0);

    function addNotification(message: string, type: "success" | "error") {
        const id = nextNotificationId.current++;
        setNotifications((current) => [...current, { id, message, type }]);
        setTimeout(() => {
            setNotifications((current) => current.filter((n) => n.id !== id));
        }, 4000);
    }

    function addToCollections(item: string, amount: number) {
        setCollections((current) => {
            const exists = current.some((entry) => entry.item === item);
            if (exists === false) {
                return [...current, { item, amount }];
            }
            return current.map((entry) =>
                entry.item === item
                    ? { ...entry, amount: entry.amount + amount }
                    : entry,
            );
        });
    }

    useEffect(() => {
        if (isAuthenticated !== true) {
            return;
        }

        let ignore = false;
        let cooldownTimeout: ReturnType<typeof setTimeout> | undefined;

        api({
            method: "GET",
            url: "/skill",
        })
            .then((res) => {
                if (ignore === true) {
                    return;
                }
                setCombatXp(res.data.combatXp);
                setFarmingXp(res.data.farmingXp);
                setMiningXp(res.data.miningXp);
                setPurse(res.data.purse);

                const remaining = res.data.combatCooldownRemaining;
                if (remaining > 0) {
                    setCombatCooldown(true);
                    cooldownTimeout = setTimeout(() => {
                        setCombatCooldown(false);
                    }, remaining);
                }

                const farmingRemaining = res.data.farmingCooldownRemaining;
                if (farmingRemaining > 0) {
                    setFarmingCooldownEnd(Date.now() + farmingRemaining);
                }

                const miningRemaining = res.data.miningCooldownRemaining;
                if (miningRemaining > 0) {
                    setMiningCooldownEnd(Date.now() + miningRemaining);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        api({
            method: "GET",
            url: "/skill/collections",
        })
            .then((res) => {
                if (ignore === true) {
                    return;
                }
                setCollections(res.data.collections);
            })
            .catch((err) => {
                console.log(err);
            });

        return () => {
            ignore = true;
            clearTimeout(cooldownTimeout);
        };
    }, [isAuthenticated]);

    // Tick once a second while a farming cooldown is running, so the
    // countdown re-renders. Clears itself when the cooldown ends.
    useEffect(() => {
        if (farmingCooldownEnd === null) {
            return;
        }

        const id = setInterval(() => {
            const current = Date.now();
            setNow(current);
            if (current >= farmingCooldownEnd) {
                setFarmingCooldownEnd(null);
            }
        }, 250);

        return () => clearInterval(id);
    }, [farmingCooldownEnd]);

    useEffect(() => {
        if (miningCooldownEnd === null) {
            return;
        }

        const id = setInterval(() => {
            const current = Date.now();
            setNow(current);
            if (current >= miningCooldownEnd) {
                setMiningCooldownEnd(null);
            }
        }, 250);

        return () => clearInterval(id);
    }, [miningCooldownEnd]);

    function handleFight() {
        if (combatCooldown === true) {
            return;
        }

        function sendCombat() {
            return api({
                method: "POST",
                url: "/skill/combat",
                data: {},
            });
        }

        function applyResult(res: any) {
            const result: CombatResult = res.data;
            setCombatXp((xp) => xp + result.xp);
            setPurse((coins) => coins + result.coins);
            addNotification(
                result.result === "win"
                    ? `Victory! +${result.xp} XP, +${result.coins} coins`
                    : "Defeat. You came away with nothing",
                result.result === "win" ? "success" : "error",
            );
        }

        sendCombat()
            .then((res) => {
                applyResult(res);
            })
            .catch((err) => {
                console.log(err);
            });

        setCombatCooldown(true);
        setTimeout(() => {
            setCombatCooldown(false);
        }, combatCooldownMs);
    }

    // The farming cooldown is random and rolled server-side, so unlike combat
    // we only know its length once the response comes back.
    const farmingRemainingMs =
        farmingCooldownEnd !== null ? farmingCooldownEnd - now : 0;
    const farmingOnCooldown = farmingRemainingMs > 0;
    const farmingSecondsLeft = farmingOnCooldown
        ? (farmingRemainingMs - (farmingRemainingMs % 1000)) / 1000
        : 0;

    function handleFarm() {
        if (farmingOnCooldown === true) {
            return;
        }

        function sendFarm() {
            return api({
                method: "POST",
                url: "/skill/farming",
                data: {},
            });
        }

        function applyResult(res: any) {
            const result: GatherResult = res.data;
            setFarmingXp((xp) => xp + result.xp);
            setPurse((coins) => coins + result.coins);
            addToCollections(result.item, result.amount);
            addNotification(
                `Harvested ${result.amount} ${result.item} — +${result.xp} XP, +${result.coins} coins`,
                "success",
            );
            setFarmingCooldownEnd(Date.now() + result.cooldownMs);
        }

        sendFarm()
            .then((res) => {
                applyResult(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const miningRemainingMs =
        miningCooldownEnd !== null ? miningCooldownEnd - now : 0;
    const miningOnCooldown = miningRemainingMs > 0;
    const miningSecondsLeft = miningOnCooldown
        ? (miningRemainingMs - (miningRemainingMs % 1000)) / 1000
        : 0;

    function handleMine() {
        if (miningOnCooldown === true) {
            return;
        }

        function sendMine() {
            return api({
                method: "POST",
                url: "/skill/mining",
                data: {},
            });
        }

        function applyResult(res: any) {
            const result: GatherResult = res.data;
            setMiningXp((xp) => xp + result.xp);
            setPurse((coins) => coins + result.coins);
            addToCollections(result.item, result.amount);
            addNotification(
                `Mined ${result.amount} ${result.item} — +${result.xp} XP, +${result.coins} coins`,
                "success",
            );
            setMiningCooldownEnd(Date.now() + result.cooldownMs);
        }

        sendMine()
            .then((res) => {
                applyResult(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const skills = [
        {
            icon: <CombatIcon />,
            name: "Combat",
            xp: combatXp,
            accent: "#c0392b",
        },
        {
            icon: <FarmingIcon />,
            name: "Farming",
            xp: farmingXp,
            accent: "#4a9d4e",
        },
        {
            icon: <MiningIcon />,
            name: "Mining",
            xp: miningXp,
            accent: "#4a6fa5",
        },
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
            actionLabel:
                farmingOnCooldown === true
                    ? `Growing… ${farmingSecondsLeft}s`
                    : "Farm",
            accent: "#4a9d4e",
            onAction: handleFarm,
            disabled: farmingOnCooldown,
        },
        {
            icon: <MiningIcon />,
            title: "Mining",
            description: "Mine ore to earn Mining XP and resources.",
            actionLabel:
                miningOnCooldown === true
                    ? `Mining… ${miningSecondsLeft}s`
                    : "Mine",
            accent: "#4a6fa5",
            onAction: handleMine,
            disabled: miningOnCooldown,
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

            <div className="notifications">
                {notifications.map((n) => (
                    <Notification
                        key={n.id}
                        message={n.message}
                        type={n.type}
                    />
                ))}
            </div>

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

                    <h2 className="dashboard-heading">Collections</h2>
                    {collections.length === 0 ? (
                        <p className="collections-empty">
                            Nothing collected yet. Go farm or mine something.
                        </p>
                    ) : (
                        <div className="collections">
                            {collections.map((entry) => (
                                <CollectionCard
                                    key={entry.item}
                                    item={entry.item}
                                    amount={entry.amount}
                                />
                            ))}
                        </div>
                    )}
                </main>
            )}
        </div>
    );
}
