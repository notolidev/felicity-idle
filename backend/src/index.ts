import express from "express";
import cors from "cors";
import * as auth from "./routes/auth";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", auth.router);

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Felicity Idle listening on port ${port}`);
});
