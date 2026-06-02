import { integer, pgTable, real, text, varchar } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
    user_id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 20 }).notNull(),
    password_hash: text().notNull(),
});

export const player_skills = pgTable("player_skills", {
    user_id: integer().references(() => players.user_id),
    skill_type: text().notNull(),
    xp: real().notNull(),
});

export const player_collections = pgTable("player_collections", {
    user_id: integer().references(() => players.user_id),
    item_type: text().notNull(),
    amount: integer().notNull(),
});

export const player_economy = pgTable("player_economy", {
    user_id: integer().references(() => players.user_id),
    coins_purse: integer().notNull(),
    coins_bank: integer().notNull(),
});

export const player_minions = pgTable("player_minions", {
    user_id: integer().references(() => players.user_id),
    minion_type: text().notNull(),
    tier: integer().notNull(),
    amount: integer().notNull(),
    last_collected_at: text().notNull(),
});
