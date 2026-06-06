import type { GatherConfig } from "./gather";

export const miningConfig: GatherConfig = {
    name: "Cobblestone",
    drops: "cobblestone",
    fortunePerLevel: 0.1,
    baseCoins: 3,
    coinsPerLevel: 2,
    coinRangeMultiplier: 1.5,
    cooldownRange: [2000, 12000],
    baseXp: 5,
    xpPerLevel: 3,
};
