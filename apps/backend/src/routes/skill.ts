import express from "express";
import authenticateUser from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

router.post("/combat", (req: express.Request, res: express.Response) => {
    res.send("hello world");
});

export { router };
