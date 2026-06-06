import type { GatherConfig } from "./gather";

export const farmingConfig: GatherConfig = {
    name: "Wheat",
    drops: "wheat",
    fortunePerLevel: 0.1,
    baseCoins: 3,
    coinsPerLevel: 2,
    coinRangeMultiplier: 1.5,
    cooldownRange: [2000, 12000],
    baseXp: 5,
    xpPerLevel: 3,
};
