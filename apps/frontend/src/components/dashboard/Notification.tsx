interface NotificationProps {
    message: string;
    type: "success" | "error";
}

export default function Notification({ message, type }: NotificationProps) {
    return (
        <div
            className={
                type === "success"
                    ? "notification notification-success"
                    : "notification notification-error"
            }
        >
            {message}
        </div>
    );
}
