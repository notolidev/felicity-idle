export type Range<T = number> = [min: T, max: T];

export type Stats = {
    health: number;
    damageRange: Range<number>;
    coinsHeld: number;
};
