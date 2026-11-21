import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { userRoutes } from "./modules/users/user.route.js";
import { profileRoutes } from "./modules/profile/profile.route.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import logger from "./middleware/logger.js";
import globalErrorHanderl from "./middleware/globalErrorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

const corsOptions = {
    origin: ["http://localhost:300"],
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);

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

app.use(globalErrorHanderl);

export default app;
