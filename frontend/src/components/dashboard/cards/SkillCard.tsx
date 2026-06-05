import convertXpToLevel from "../../../lib/utils/convertXpToLevel";

interface SkillCardProps {
    icon: React.ReactNode;
    name: string;
    xp: number;
    accent: string;
}

export default function SkillCard({ icon, name, xp, accent }: SkillCardProps) {
    const { userLevel, xpIntoLevel } = convertXpToLevel(xp);

    return (
        <div className="skill-card">
            <div className="skill-icon" style={{ color: accent }}>
                {icon}
            </div>
            <div className="skill-info">
                <span className="skill-name">{name}</span>
                <span className="skill-stats">
                    <span className="skill-level">Level {userLevel}</span>
                    <span className="skill-xp">
                        {xpIntoLevel.toLocaleString()} XP
                    </span>
                </span>
            </div>
        </div>
    );
}
