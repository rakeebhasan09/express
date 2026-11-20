import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { userRoutes } from "./modules/users/user.route.js";
import { profileRoutes } from "./modules/profile/profile.route.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import fs from "fs";
const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    // console.log("Method -> URL -> Time:", req.method, req.url, Date.now());
    const log = `\n Method : ${req.method} | URL : ${req.url} | Time: ${Date.now()}\n`;

    fs.appendFile("logger.txt", log, (err) => {
        console.log(err);
    });
    next();
});

// User Router
app.use("/api/v1/users", userRoutes);

// Profile Router
app.use("/api/v1/profiles", profileRoutes);

// Auth Router
app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Yah! Server is running and this is root route...",
        author: "MD Rakeeb Hasan",
    });
});

export default app;
