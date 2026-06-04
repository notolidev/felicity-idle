interface SkillCardProps {
    icon: React.ReactNode;
    name: string;
    xp: number;
    accent: string;
}

export default function SkillCard({ icon, name, xp, accent }: SkillCardProps) {
    return (
        <div className="skill-card">
            <div className="skill-icon" style={{ color: accent }}>
                {icon}
            </div>
            <div className="skill-info">
                <span className="skill-name">{name}</span>
                <span className="skill-xp">{xp.toLocaleString()} XP</span>
            </div>
        </div>
    );
}
