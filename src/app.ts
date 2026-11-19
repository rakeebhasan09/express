import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { pool } from "./db/index.js";
import { UserRoutes } from "./modules/users/user.route.js";
const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", UserRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Yah! Server is running and this is root route...",
        author: "MD Rakeeb Hasan",
    });
});

export default app;
