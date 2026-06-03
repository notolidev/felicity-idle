import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env", quiet: true });

export function signToken(player_id: number): string {
    const token: string = jwt.sign(
        {
            player_id: player_id,
        },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: "7d", algorithm: "HS256" },
    );

    return token;
}
