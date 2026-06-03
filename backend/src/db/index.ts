import "dotenv/config";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schemaTables from "./schema";
import argon2 from "argon2";

dotenv.config({ path: "./backend/.env", quiet: true });

const db = drizzle(process.env.DATABASE_URL!);
const tables = schemaTables;

const insertPlayer = async (username: string, password: string) => {
    let hashed_password;

    try {
        hashed_password = await argon2.hash(password);
    } catch (err) {
        return err;
    }

    return db.insert(tables.players).values({
        username: username,
        password_hash: hashed_password,
    });
};

export default insertPlayer;
