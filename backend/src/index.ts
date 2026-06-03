import express from "express";
import cors from "cors";
import insertPlayer from "./db/index";

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World!");
});

app.post("/api/signin", (req: express.Request, res: express.Response) => {
    console.log(req);
});

app.post("/api/signup", (req: express.Request, res: express.Response) => {
    insertPlayer(req.body.username, req.body.password);
});

app.listen(port, () => {
    console.log(`Felicity Idle listening on port ${port}`);
});
