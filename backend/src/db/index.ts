import { drizzle } from "drizzle-orm/node-postgres";
import * as schemaTables from "./schema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import argon2 from "argon2";
import "dotenv/config";

dotenv.config({ path: "./backend/.env", quiet: true });

const db = drizzle(process.env.DATABASE_URL!);
const tables = schemaTables;

export async function insertPlayer(username: string, password: string) {
    let hashed_password;

    try {
        hashed_password = await argon2.hash(password);
    } catch (err) {
        throw err;
    }

    try {
        return await db
            .insert(tables.players)
            .values({
                username: username,
                password_hash: hashed_password,
            })
            .returning({ player_id: tables.players.player_id })
            .then((e) => {
                const token: string = jwt.sign(
                    {
                        player_id: e[0].player_id,
                    },
                    process.env.JWT_SECRET_KEY!,
                    { expiresIn: "15m", algorithm: "HS256" },
                );

                return token;
            });
    } catch (err) {
        throw err;
    }
}
