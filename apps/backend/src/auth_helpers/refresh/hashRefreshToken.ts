import crypto from "crypto";

export function hashRefreshToken(token: string) {
    const refreshTokenHashed: string = crypto.hash("sha256", token);

    return refreshTokenHashed;
}
