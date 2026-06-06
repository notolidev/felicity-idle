export type Range<T = number> = [min: T, max: T];

export type CombatStats = {
    health: number;
    damageRange: Range<number>;
    coinsHeld: number;
};

export type ResourceStats = {
    name: string;
    drops: string;
    coinRange: Range<number>;
    timeToHarvestMs: number;
};

export type CombatResult = {
    result: string;
    coins: number;
    xp: number;
};

export type GatherResult = {
    item: string;
    amount: number;
    coins: number;
    xp: number;
    cooldownMs: number;
};
