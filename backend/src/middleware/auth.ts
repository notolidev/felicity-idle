import express from "express";
import { verifyToken } from "../auth/verifyToken";

export default function authenticateUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    if (!req.cookies.auth_cookie) {
        res.status(401).send("Not logged in");
        return;
    }

    try {
        verifyToken(req.cookies.auth_cookie);

        next();
    } catch (err: any) {
        res.send("We cannot authenticate you.");
    }
}
