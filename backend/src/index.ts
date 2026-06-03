import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Felicity Idle listening on port ${port}`);
});
