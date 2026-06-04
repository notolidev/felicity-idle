type Range<T = number> = [min: T, max: T];

class Enemy {
    private health: number;
    private level: Range<number>;
    private damageRange: Range<number>;
    private coinsHeld: Range<number>;

    constructor() {}
}
