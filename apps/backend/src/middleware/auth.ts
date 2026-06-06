import express from "express";
import { verifyAccessToken } from "../auth_helpers/access/verifyAccessToken";

export default function authenticateUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    if (!req.cookies.accessCookie) {
        res.status(401).send("Not logged in");
        return;
    }

    try {
        const decoded: any = verifyAccessToken(req.cookies.accessCookie);

        res.locals.player_id = decoded.player_id;

        next();
    } catch (err: any) {
        res.status(401).send("We cannot authenticate you.");
        return;
    }
}
