import express from "express";
import authenticateUser from "../middleware/auth";
import combat from "../lib/skills/combat";
import gather from "../lib/skills/gather";
import type { GatherConfig } from "../lib/skills/gather";
import { farmingConfig } from "../lib/skills/farming";
import { miningConfig } from "../lib/skills/mining";
import { combatCooldownMs } from "@felicity/shared";
import { getXp, addXp, getEconomy, addCoins } from "../db";

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

router.get("/", async (_req: express.Request, res: express.Response) => {
    try {
        const player_id: any = res.locals.player_id;

        const combatXpRow: any = await getXp(player_id, "combat");
        const farmingXpRow: any = await getXp(player_id, "farming");
        const miningXpRow: any = await getXp(player_id, "mining");
        const economyRow: any = await getEconomy(player_id);

        const combatXp: number = combatXpRow[0]?.xp ?? 0;
        const farmingXp: number = farmingXpRow[0]?.xp ?? 0;
        const miningXp: number = miningXpRow[0]?.xp ?? 0;
        const purse: number = economyRow[0]?.coins_purse ?? 0;
        const bank: number = economyRow[0]?.coins_bank ?? 0;

        const lastActionAt: Date | null = combatXpRow[0]?.last_action_at ?? null;
        const combatCooldownRemaining: number = lastActionAt
            ? combatCooldownMs - (Date.now() - lastActionAt.getTime())
            : 0;

        const farmingCooldownUntil: Date | null =
            farmingXpRow[0]?.cooldown_until ?? null;
        const farmingCooldownRemaining: number = farmingCooldownUntil
            ? farmingCooldownUntil.getTime() - Date.now()
            : 0;

        const miningCooldownUntil: Date | null =
            miningXpRow[0]?.cooldown_until ?? null;
        const miningCooldownRemaining: number = miningCooldownUntil
            ? miningCooldownUntil.getTime() - Date.now()
            : 0;

        res.status(200).json({
            combatXp,
            farmingXp,
            miningXp,
            purse,
            bank,
            combatCooldownRemaining,
            farmingCooldownRemaining,
            miningCooldownRemaining,
        });
    } catch (err: any) {
        res.status(500).send("Something went wrong");
    }
});

router.post("/combat", async (_req: express.Request, res: express.Response) => {
    try {
        const player_id: any = res.locals.player_id;

        const xpRow: any = await getXp(player_id, "combat");
        const currentXp: number = xpRow[0]?.xp ?? 0;
        const lastActionAt: Date | null = xpRow[0]?.last_action_at ?? null;

        if (
            lastActionAt &&
            Date.now() - lastActionAt.getTime() < combatCooldownMs
        ) {
            res.status(429).send("On cooldown");
            return;
        }

        const result = combat(currentXp);

        await addXp(player_id, "combat", result.xp);
        await addCoins(player_id, "purse", result.coins);

        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).send("Something went wrong");
    }
});

// Shared flow for every gathering skill: check the cooldown, roll the result,
// then persist xp + cooldown + coins. The skill name and config are passed in
// by the route, never by the client, so there's no untrusted input here.
async function runGather(
    res: express.Response,
    skillType: string,
    config: GatherConfig,
) {
    const player_id: any = res.locals.player_id;

    const xpRow: any = await getXp(player_id, skillType);
    const currentXp: number = xpRow[0]?.xp ?? 0;
    const cooldownUntil: Date | null = xpRow[0]?.cooldown_until ?? null;

    if (cooldownUntil && Date.now() < cooldownUntil.getTime()) {
        res.status(429).send("On cooldown");
        return;
    }

    const result = gather(currentXp, config);

    const newCooldownUntil: Date = new Date(Date.now() + result.cooldownMs);
    await addXp(player_id, skillType, result.xp, newCooldownUntil);
    await addCoins(player_id, "purse", result.coins);

    res.status(200).json(result);
}

router.post("/farming", async (_req: express.Request, res: express.Response) => {
    try {
        await runGather(res, "farming", farmingConfig);
    } catch (err: any) {
        res.status(500).send("Something went wrong");
    }
});

router.post("/mining", async (_req: express.Request, res: express.Response) => {
    try {
        await runGather(res, "mining", miningConfig);
    } catch (err: any) {
        res.status(500).send("Something went wrong");
    }
});

export { router };
