interface CollectionCardProps {
    item: string;
    amount: number;
}

export default function CollectionCard({ item, amount }: CollectionCardProps) {
    const label = item.charAt(0).toUpperCase() + item.slice(1);

    return (
        <div className="collection-card">
            <span className="collection-name">{label}</span>
            <span className="collection-amount">{amount.toLocaleString()}</span>
        </div>
    );
}
