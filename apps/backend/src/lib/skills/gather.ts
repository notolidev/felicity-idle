import { Resource } from "../models/resource";
import type { Range, ResourceStats, GatherResult } from "@felicity/shared";
import { convertXpToLevel } from "@felicity/shared";
import { randomIntInRange } from "../utils/randomIntInRage";

export type GatherConfig = {
    name: string;
    drops: string;
    fortunePerLevel: number;
    baseCoins: number;
    coinsPerLevel: number;
    coinRangeMultiplier: number;
    cooldownRange: Range<number>;
    baseXp: number;
    xpPerLevel: number;
};

export default function gather(xp: number, config: GatherConfig): GatherResult {
    const playerLevel: number = convertXpToLevel(xp).userLevel;

    const fortune: number = 1 + playerLevel * config.fortunePerLevel;

    const coins: number = config.baseCoins + playerLevel * config.coinsPerLevel;
    const coinRange: Range<number> = [
        coins,
        Math.round(coins * config.coinRangeMultiplier),
    ];

    const cooldownMs: number = randomIntInRange(config.cooldownRange);

    const resource: Resource = new Resource(
        config.name,
        config.drops,
        coinRange,
        cooldownMs,
    );

    const stats: ResourceStats = resource.getStats();
    const amount: number = Math.floor(fortune);

    return {
        item: stats.drops,
        amount: amount,
        coins: resource.rollCoins(),
        xp: config.baseXp + playerLevel * config.xpPerLevel,
        cooldownMs: stats.timeToHarvestMs,
    };
}
