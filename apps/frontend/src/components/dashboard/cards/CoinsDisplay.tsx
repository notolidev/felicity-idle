import { CoinIcon } from "../../icons/icons";

interface CoinsDisplayProps {
    purse: number;
    bank: number;
}

export default function CoinsDisplay({ purse, bank }: CoinsDisplayProps) {
    return (
        <div className="coins">
            <span className="coins-item">
                <span className="coin-icon">
                    <CoinIcon />
                </span>
                {purse.toLocaleString()}
                <span className="coins-label">purse</span>
            </span>
            <span className="coins-item">
                <span className="coin-icon">
                    <CoinIcon />
                </span>
                {bank.toLocaleString()}
                <span className="coins-label">bank</span>
            </span>
        </div>
    );
}
