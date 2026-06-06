// To do: build combat loop
import { Enemy } from "../models/enemy";
import type { CombatResult } from "@felicity/shared";
import { convertXpToLevel } from "@felicity/shared";

export default function combat(combatXP: number): CombatResult {
    const playerCombatLevel: number = convertXpToLevel(combatXP).userLevel;

    const playerMaxHealth: number = 100 + playerCombatLevel * 20;
    let playerHealth: number = playerMaxHealth;

    const playerDamage: number = 10 + playerCombatLevel * 3;

    const enemyHealth: number = 50 + playerCombatLevel * 15;
    const enemyDamage: number = 16 + playerCombatLevel * 3;
    const enemyCoins: number = 5 + playerCombatLevel * 4;
    const enemyXp: number = 10 + playerCombatLevel * 5;

    const enemy: Enemy = new Enemy(
        [enemyHealth, Math.round(enemyHealth * 1.3)],
        [enemyDamage, Math.round(enemyDamage * 1.4)],
        [enemyCoins, Math.round(enemyCoins * 1.6)],
    );

    while (playerHealth > 0 && !enemy.isDead()) {
        enemy.takeDamage(playerDamage);
        if (enemy.isDead()) {
            break;
        }

        playerHealth -= enemy.doDamage();
    }

    if (enemy.isDead()) {
        return {
            result: "win",
            coins: enemy.getStats().coinsHeld,
            xp: enemyXp,
        };
    } else {
        return { result: "loss", coins: 0, xp: 0 };
    }
}
