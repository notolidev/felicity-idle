import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schemaTables from "./schema";
import dotenv from "dotenv";
import "dotenv/config";
import { and, eq, sql } from "drizzle-orm";

dotenv.config({ path: "./backend/.env", quiet: true });

const db: NodePgDatabase<typeof schemaTables> = drizzle(
    process.env.DATABASE_URL!,
    { schema: schemaTables },
);
const tables = schemaTables;

export async function insertPlayer(username: string, hashed_password: string) {
    try {
        return await db
            .insert(tables.players)
            .values({
                username: username,
                password_hash: hashed_password,
            })
            .returning({ player_id: tables.players.player_id })
            .then((e) => {
                return e[0].player_id;
            });
    } catch (err) {
        throw err;
    }
}

export async function getPlayer(username: string) {
    try {
        return await db
            .select()
            .from(tables.players)
            .where(eq(tables.players.username, username));
    } catch (err) {
        throw err;
    }
}

export async function insertSession(
    player_id: number,
    refresh_token_hash: string,
    expiration: Date,
) {
    try {
        return await db.insert(tables.player_sessions).values({
            player_id: player_id,
            refresh_token_hash: refresh_token_hash,
            expiration: expiration,
        });
    } catch (err) {
        throw err;
    }
}

export async function getSession(hashedRefreshToken: string) {
    try {
        return await db
            .select()
            .from(tables.player_sessions)
            .where(
                eq(
                    tables.player_sessions.refresh_token_hash,
                    hashedRefreshToken,
                ),
            );
    } catch (err) {
        throw err;
    }
}

export async function deleteSession(hashedRefreshToken: string) {
    try {
        return await db
            .delete(tables.player_sessions)
            .where(
                eq(
                    tables.player_sessions.refresh_token_hash,
                    hashedRefreshToken,
                ),
            );
    } catch (err: any) {
        throw err;
    }
}

export async function addXp(
    player_id: number,
    skill_type: string,
    xp: number,
    cooldownUntil?: Date,
) {
    try {
        return await db
            .insert(tables.player_skills)
            .values({
                player_id: player_id,
                skill_type: skill_type,
                xp: xp,
                last_action_at: new Date(),
                cooldown_until: cooldownUntil ?? null,
            })
            .onConflictDoUpdate({
                target: [
                    tables.player_skills.player_id,
                    tables.player_skills.skill_type,
                ],
                set: {
                    xp: sql`${tables.player_skills.xp} + ${xp}`,
                    last_action_at: new Date(),
                    cooldown_until: cooldownUntil ?? null,
                },
            });
    } catch (err) {
        throw err;
    }
}

export async function getXp(player_id: number, skill_type: string) {
    try {
        return await db
            .select()
            .from(tables.player_skills)
            .where(
                and(
                    eq(tables.player_skills.player_id, player_id),
                    eq(tables.player_skills.skill_type, skill_type),
                ),
            );
    } catch (err) {
        throw err;
    }
}

export async function getEconomy(player_id: number) {
    try {
        return await db
            .select()
            .from(tables.player_economy)
            .where(eq(tables.player_economy.player_id, player_id));
    } catch (err) {
        throw err;
    }
}

export async function addCoins(
    player_id: number,
    coin_type: "purse" | "bank",
    amount: number,
) {
    try {
        const values =
            coin_type === "purse"
                ? { player_id: player_id, coins_purse: amount, coins_bank: 0 }
                : { player_id: player_id, coins_purse: 0, coins_bank: amount };

        const set =
            coin_type === "purse"
                ? {
                      coins_purse: sql`${tables.player_economy.coins_purse} + ${amount}`,
                  }
                : {
                      coins_bank: sql`${tables.player_economy.coins_bank} + ${amount}`,
                  };

        return await db
            .insert(tables.player_economy)
            .values(values)
            .onConflictDoUpdate({
                target: tables.player_economy.player_id,
                set: set,
            });
    } catch (err) {
        throw err;
    }
}
