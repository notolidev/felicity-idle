import argon2 from "argon2";

export async function hashPassword(password: string) {
    try {
        return await argon2.hash(password);
    } catch (err) {
        throw err;
    }
}
