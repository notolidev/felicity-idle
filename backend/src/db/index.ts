import { drizzle } from "drizzle-orm/node-postgres";
import * as schemaTables from "./schema";
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config({ path: "./backend/.env", quiet: true });

const db = drizzle(process.env.DATABASE_URL!);
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
