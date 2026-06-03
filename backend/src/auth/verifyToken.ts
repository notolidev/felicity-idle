import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env", quiet: true });

export function verifyToken(token: string) {
    const cookie: any = jwt.verify(token, process.env.JWT_SECRET_KEY!, {
        algorithms: ["HS256"],
    });

    return cookie;
}
