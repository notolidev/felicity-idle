import { getSession } from "../../db";
import { hashRefreshToken } from "./hashRefreshToken";

export async function verifyRefreshToken(token: string) {
    const hashedRefreshToken: string = hashRefreshToken(token);

    try {
        const player: any = await getSession(hashedRefreshToken);

        if (Date.now() > player[0].expiration) {
            return "401";
        } else {
            return player[0].player_id;
        }
    } catch (err) {
        return "401";
    }
}
