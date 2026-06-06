export type Range<T = number> = [min: T, max: T];

export type Stats = {
    health: number;
    damageRange: Range<number>;
    coinsHeld: number;
};

export type CombatResult = {
    result: string;
    coins: number;
    xp: number;
};
