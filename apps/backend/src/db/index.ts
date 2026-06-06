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
) {
    try {
        return await db
            .insert(tables.player_skills)
            .values({
                player_id: player_id,
                skill_type: skill_type,
                xp: xp,
            })
            .onConflictDoUpdate({
                target: [
                    tables.player_skills.player_id,
                    tables.player_skills.skill_type,
                ],
                set: { xp: sql`${tables.player_skills.xp} + ${xp}` },
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
