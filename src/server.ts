import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString:
        "postgresql://neondb_owner:npg_GJhdNMeQ6S3i@ep-frosty-cherry-b3ffysbe.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

console.log(pool);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.post("/", async (req: Request, res: Response) => {
    // console.log(req.body);
    const body = req.body;
    res.status(200).json({
        success: true,
        message: "This is body data.",
        data: body,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
