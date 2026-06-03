import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schemaTables from "./schema";
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config({ path: "./backend/.env", quiet: true });

const db: NodePgDatabase<typeof schemaTables> = drizzle(
    process.env.DATABASE_URL!,
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
        return await db.query.players.findFirst({
            with: {
                username: username,
            },
        });
    } catch (err) {
        throw err;
    }
}
