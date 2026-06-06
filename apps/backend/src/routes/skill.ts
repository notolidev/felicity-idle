import express from "express";
import authenticateUser from "../middleware/auth";
import combat from "../lib/skills/combat";
import { getXp, addXp, getEconomy, addCoins } from "../db";

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

router.get("/", async (_req: express.Request, res: express.Response) => {
    try {
        const player_id: any = res.locals.player_id;

        const xpRow: any = await getXp(player_id, "combat");
        const economyRow: any = await getEconomy(player_id);

        const combatXp: number = xpRow[0]?.xp ?? 0;
        const purse: number = economyRow[0]?.coins_purse ?? 0;
        const bank: number = economyRow[0]?.coins_bank ?? 0;

        res.status(200).json({ combatXp, purse, bank });
    } catch (err: any) {
        res.status(500).send("Something went wrong");
    }
});

router.post("/combat", async (_req: express.Request, res: express.Response) => {
    try {
        const player_id: any = res.locals.player_id;

        const xpRow: any = await getXp(player_id, "combat");
        const currentXp: number = xpRow[0]?.xp ?? 0;

        const result = combat(currentXp);

        await addXp(player_id, "combat", result.xp);
        await addCoins(player_id, "purse", result.coins);

        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).send("Something went wrong");
    }
});

export { router };
