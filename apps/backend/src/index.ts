import cookieParser from "cookie-parser";
import * as auth from "./routes/auth";
import * as skill from "./routes/skill";
import express from "express";
import cors from "cors";
import authenticateUser from "./middleware/auth";

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(cookieParser());
// app.use(authenticateUser);

app.use("/auth", auth.router);
app.use("/skill", skill.router);

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Felicity Idle listening on port ${port}`);
});
