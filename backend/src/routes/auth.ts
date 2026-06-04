import express from "express";
import { hashPassword } from "../auth/hashPassword";
import { verifyPassword } from "../auth/verifyPassword";
import { getPlayer, insertPlayer } from "../db";
import { signToken } from "../auth/signToken";
import { maxUsernameLength } from "../db/schema";
import { verifyToken } from "../auth/verifyToken";

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
            console.log(err.cause);
        }
    }
});

router.post("/signin", async (req: express.Request, res: express.Response) => {
    try {
        const player: any = await getPlayer(req.body.username);

        if (
            (await verifyPassword(
                player.hashed_password,
                req.body.password,
            )) === true
        ) {
            const token: any = signToken(player.player_id);

            res.cookie("auth_cookie", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
        }
    } catch (err: any) {
        console.log(err.cause);
    }
});

router.get("/me", (req: express.Request, res: express.Response) => {
    if (!req.cookies.auth_cookie) {
        res.status(401).send("Not logged in");
        return;
    }
    try {
        verifyToken(req.cookies.auth_cookie);
        res.status(200).send("Success");
    } catch (err: any) {
        res.status(401).send("We cannot authenticate you.");
        return;
    }
});

export { router };
