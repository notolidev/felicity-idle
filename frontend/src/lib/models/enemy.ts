type Range<T = number> = [min: T, max: T];

export class Enemy {
    private maxHealth: number;
    private health: number;
    private damageRange: Range<number>;
    private coinsHeld: number;

    public constructor(
        healthRange: Range<number>,
        damageRange: Range<number>,
        coinsHeldRange: Range<number>,
    ) {
        this.health = this.randomIntInRange(healthRange);
        this.maxHealth = this.health;
        this.damageRange = damageRange;
        this.coinsHeld = this.randomIntInRange(coinsHeldRange);
    }

    private randomIntInRange(range: Range<number>) {
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }

    public getStats() {
        return {
            health: this.maxHealth,
            damageRange: this.damageRange,
            coinsHeld: this.coinsHeld,
        };
    }

    public takeDamage(damageAmount: number) {
        this.health -= damageAmount;

        if (this.health <= 0) {
            this.health = 0;
        }
    }

    public isDead(): boolean {
        if (this.health <= 0) {
            return true;
        } else {
            return false;
        }
    }
}
