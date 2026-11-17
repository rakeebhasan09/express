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
    connectionString: "",
});

// console.log(pool);
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            age INT,
            is_Active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            );
            `);
        console.log("Database Connected!!");
    } catch (error) {
        console.log(error);
    }
};

initDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
    // console.log(req.body);
    try {
        const { name, email, password, age } = req.body;
        const result = await pool.query(
            `
        INSERT INTO users (name, email, password, age) VALUES ($1,$2,$3,$4) RETURNING *
        `,
            [name, email, password, age],
        );
        console.log(result);
        res.status(201).json({
            success: true,
            message: "User Created!!",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
