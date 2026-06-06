import type { Range, ResourceStats } from "@felicity/shared";
import { randomIntInRange } from "../utils/randomIntInRage";

export class Resource {
    private name: string;
    private drops: string;
    private coinRange: Range<number>;
    private timeToHarvestMs: number;

    public constructor(
        name: string,
        drops: string,
        coinRange: Range<number>,
        timeToHarvestMs: number,
    ) {
        this.name = name;
        this.drops = drops;
        this.coinRange = coinRange;
        this.timeToHarvestMs = timeToHarvestMs;
    }

    public getStats(): ResourceStats {
        return {
            name: this.name,
            drops: this.drops,
            coinRange: this.coinRange,
            timeToHarvestMs: this.timeToHarvestMs,
        };
    }

    public rollCoins(): number {
        return randomIntInRange(this.coinRange);
    }
}
