import {
    bigint,
    doublePrecision,
    integer,
    pgTable,
    primaryKey,
    text,
    varchar,
} from "drizzle-orm/pg-core";

export const players = pgTable("players", {
    user_id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 20 }).notNull().unique(),
    password_hash: text().notNull(),
});

export const player_skills = pgTable(
    "player_skills",
    {
        user_id: integer().references(() => players.user_id),
        skill_type: text().notNull(),
        xp: doublePrecision().notNull(),
    },
    (table) => [primaryKey({ columns: [table.user_id, table.skill_type] })],
);

export const player_collections = pgTable(
    "player_collections",
    {
        user_id: integer().references(() => players.user_id),
        item_type: text().notNull(),
        amount: integer().notNull(),
    },
    (table) => [primaryKey({ columns: [table.user_id, table.item_type] })],
);

export const player_economy = pgTable("player_economy", {
    user_id: integer()
        .references(() => players.user_id)
        .primaryKey(),
    coins_purse: doublePrecision().notNull(),
    coins_bank: doublePrecision().notNull(),
});

export const player_minions = pgTable(
    "player_minions",
    {
        user_id: integer().references(() => players.user_id),
        minion_type: text().notNull(),
        tier: integer().notNull(),
        amount: integer().notNull(),
        last_collected_at: text().notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.user_id, table.minion_type, table.tier] }),
    ],
);
