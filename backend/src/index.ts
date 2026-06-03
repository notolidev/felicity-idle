import express from "express";
import cors from "cors";
import { insertPlayer } from "./db/index";
import { maxUsernameLength } from "./db/schema";

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World!");
});

app.post("/api/signin", (req: express.Request, res: express.Response) => {});

app.post("/api/signup", async (req: express.Request, res: express.Response) => {
    try {
        await insertPlayer(req.body.username, req.body.password);
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

app.listen(port, () => {
    console.log(`Felicity Idle listening on port ${port}`);
});
