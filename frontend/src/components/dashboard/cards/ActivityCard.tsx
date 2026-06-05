interface ActivityCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel: string;
    accent: string;
    onAction: () => void;
    disabled: boolean;
}

export default function ActivityCard({
    icon,
    title,
    description,
    actionLabel,
    accent,
    onAction,
    disabled,
}: ActivityCardProps) {
    return (
        <div className="activity-card">
            <div className="activity-icon" style={{ color: accent }}>
                {icon}
            </div>
            <h3 className="activity-title">{title}</h3>
            <p className="activity-description">{description}</p>
            <button
                type="button"
                className="activity-action"
                style={{ background: accent }}
                onClick={onAction}
                disabled={disabled}
            >
                {actionLabel}
            </button>
        </div>
    );
}
