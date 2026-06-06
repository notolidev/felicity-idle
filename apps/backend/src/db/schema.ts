import {
    doublePrecision,
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { maxUsernameLength } from "@felicity/shared";

export const players = pgTable("players", {
    player_id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: maxUsernameLength }).notNull().unique(),
    password_hash: text().notNull(),
});

export const player_sessions = pgTable("player_sessions", {
    player_id: integer()
        .references(() => players.player_id)
        .notNull(),
    session_id: integer().primaryKey().generatedAlwaysAsIdentity(),
    refresh_token_hash: text().notNull().unique(),
    expiration: timestamp({ withTimezone: true, mode: "date" }).notNull(),
});

export const player_skills = pgTable(
    "player_skills",
    {
        player_id: integer()
            .references(() => players.player_id)
            .notNull(),
        skill_type: text().notNull(),
        xp: doublePrecision().notNull(),
    },
    (table) => [primaryKey({ columns: [table.player_id, table.skill_type] })],
);

export const player_collections = pgTable(
    "player_collections",
    {
        player_id: integer()
            .references(() => players.player_id)
            .notNull(),
        item_type: text().notNull(),
        amount: integer().notNull(),
    },
    (table) => [primaryKey({ columns: [table.player_id, table.item_type] })],
);

export const player_economy = pgTable("player_economy", {
    player_id: integer()
        .references(() => players.player_id)
        .primaryKey()
        .notNull(),
    coins_purse: doublePrecision().notNull(),
    coins_bank: doublePrecision().notNull(),
});

export const player_minions = pgTable(
    "player_minions",
    {
        player_id: integer()
            .references(() => players.player_id)
            .notNull(),
        minion_type: text().notNull(),
        tier: integer().notNull(),
        amount: integer().notNull(),
        last_collected_at: timestamp({
            withTimezone: true,
            mode: "date",
        }).notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.player_id, table.minion_type, table.tier],
        }),
    ],
);
