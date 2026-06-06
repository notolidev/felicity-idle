import type { Range, Stats } from "@felicity/shared";
import { randomIntInRange } from "../utils/randomIntInRage";

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
        this.health = randomIntInRange(healthRange);
        this.maxHealth = this.health;
        this.damageRange = damageRange;
        this.coinsHeld = randomIntInRange(coinsHeldRange);
    }

    public getStats(): Stats {
        return {
            health: this.maxHealth,
            damageRange: this.damageRange,
            coinsHeld: this.coinsHeld,
        };
    }

    public takeDamage(damageAmount: number): void {
        this.health -= damageAmount;

        if (this.health <= 0) {
            this.health = 0;
        }
    }

    public doDamage(): number {
        return randomIntInRange(this.damageRange);
    }

    public isDead(): boolean {
        if (this.health <= 0) {
            return true;
        } else {
            return false;
        }
    }
}
