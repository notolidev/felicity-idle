import express from "express";
import { hashPassword } from "../auth/hashPassword";
import { insertPlayer } from "../db";
import { signToken } from "../auth/signToken";
import { maxUsernameLength } from "../db/schema";

const router = express.Router({ mergeParams: true });

router.post("/signup", async (req: express.Request, res: express.Response) => {
    let hashed_password = await hashPassword(req.body.password);

    try {
        const player_id: number = await insertPlayer(
            req.body.username,
            hashed_password,
        );

        const token: any = signToken(player_id);

        res.cookie("auth_cookie", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.send(`Welcome ${req.body.username}!`);
    } catch (err: any) {
        if (Number(err.cause.code) === 23505) {
            res.send("That username is already taken!");
        } else if (Number(err.cause.code) === 22001) {
            res.send(`Your username is over ${maxUsernameLength} characters!`);
        } else {
            res.send(err.cause);
        }
    }
});

router.post("/signin", (req: express.Request, res: express.Response) => {});

export { router };
