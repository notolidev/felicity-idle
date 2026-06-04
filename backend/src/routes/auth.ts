import express from "express";
import { hashPassword } from "../auth_helpers/password/hashPassword";
import { verifyPassword } from "../auth_helpers/password/verifyPassword";
import { deleteSession, getPlayer, insertPlayer, insertSession } from "../db";
import { signToken } from "../auth_helpers/access/signAccessToken";
import { maxUsernameLength } from "../db/schema";
import { verifyAccessToken } from "../auth_helpers/access/verifyAccessToken";
import crypto from "crypto";
import { verifyRefreshToken } from "../auth_helpers/refresh/verifyRefreshToken";
import { hashRefreshToken } from "../auth_helpers/refresh/hashRefreshToken";

const router = express.Router({ mergeParams: true });

router.post("/signup", async (req: express.Request, res: express.Response) => {
    let hashed_password = await hashPassword(req.body.password);

    try {
        const player_id: number = await insertPlayer(
            req.body.username,
            hashed_password,
        );

        const refreshTokenBuffer: Buffer = crypto.randomBytes(32);
        const refreshToken: string = refreshTokenBuffer.toString("base64url");

        const accessToken: any = signToken(player_id);

        const refreshTokenHash: string = crypto.hash("sha256", refreshToken);
        const expiration: Date = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 7 * 4,
        );

        await insertSession(player_id, refreshTokenHash, expiration);

        res.cookie("accessCookie", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.cookie("refreshCookie", refreshToken, {
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
        const player_id: any = player[0].player_id;

        if (
            (await verifyPassword(
                player[0].password_hash,
                req.body.password,
            )) === true
        ) {
            const refreshTokenBuffer: Buffer = crypto.randomBytes(32);
            const refreshToken: string =
                refreshTokenBuffer.toString("base64url");

            const accessToken: any = signToken(player_id);

            const refreshTokenHash: string = crypto.hash(
                "sha256",
                refreshToken,
            );
            const expiration: Date = new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 7 * 4,
            );

            await insertSession(player_id, refreshTokenHash, expiration);

            res.status(200).cookie("accessCookie", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            res.status(200).cookie("refreshCookie", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            res.send("ok");
        }
    } catch (err: any) {
        console.log(err.cause);
    }
});

router.get("/signout", async (req: express.Request, res: express.Response) => {
    if (!req.cookies.accessCookie || !req.cookies.refreshCookie) {
        res.status(401).send("Not logged in");
        return;
    } else {
        try {
            const playerRefreshToken: any = hashRefreshToken(
                req.cookies.accessCookie,
            );
            const deletedPlayer: any = await deleteSession(playerRefreshToken);

            res.clearCookie("accessCookie");
            res.clearCookie("refreshCookie");

            res.sendStatus(200);
        } catch (err: any) {
            res.send("Error");
        }
    }
});

router.get("/me", (req: express.Request, res: express.Response) => {
    if (!req.cookies.accessCookie) {
        res.status(401).send("Not logged in");
        return;
    }
    try {
        verifyAccessToken(req.cookies.accessCookie);
        res.status(200).send("ok");
    } catch (err: any) {
        res.status(401).send("We cannot authenticate you.");
        return;
    }
});

router.get("/refresh", async (req: express.Request, res: express.Response) => {
    if (!req.cookies.refreshCookie) {
        res.status(401).send("Not logged in");
        return;
    }

    try {
        const player_id: any = await verifyRefreshToken(
            req.cookies.refreshCookie,
        );

        if (player_id === "401") {
            res.status(401).send("We cannot authenticate you");
            return;
        } else if (player_id !== "401") {
            const accessToken: any = signToken(player_id);

            res.status(200).cookie("accessCookie", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            return;
        }

        res.status(200).send("ok");
    } catch (err: any) {
        res.status(401).send("We cannot authenticate you.");
        return;
    }
});

export { router };
