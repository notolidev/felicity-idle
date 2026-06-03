import argon2 from "argon2";

export async function verifyPassword(
    hashed_password: string,
    password: string,
) {
    return await argon2.verify(hashed_password, password);
}
