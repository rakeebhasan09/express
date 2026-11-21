import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config/index.js";

const loginUserFromDB = async (payload: {
    email: string;
    password: string;
}) => {
    const { email, password } = payload;
    const user = await pool.query(
        `
        SELECT * FROM users WHERE email = $1
        `,
        [email],
    );

    if (user.rowCount === 0) {
        throw new Error("Invalid Credentials!!");
    }

    const machedPassword = await bcrypt.compare(
        password,
        user.rows[0].password,
    );
    if (!machedPassword) {
        throw new Error("Invalid Credentials!!");
    }

    if (!user.rows[0].is_active) {
        throw new Error("Access Denied!!");
    }

    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
        expiresIn: "1h",
    });

    const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, {
        expiresIn: "10d",
    });

    const userData = user.rows[0];

    delete userData.password;

    return { accessToken, refreshToken, user: userData };
};

const generateAccessToken = async (token: string) => {
    if (!token) {
        throw new Error("Unauthorized Access!!");
    }

    // Verify Token
    const decode = jwt.verify(
        token as string,
        config.refresh_secret,
    ) as JwtPayload;

    // Fetch user and Check user exists in the database
    const user = await pool.query(
        `
        SELECT * FROM users WHERE email = $1
        `,
        [decode.email],
    );
    if (user.rowCount === 0) {
        throw new Error("User not found!!");
    }

    // Check user status active or deactive
    if (!user.rows[0].is_active) {
        throw new Error("Forbidden!!");
    }

    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
        expiresIn: "1h",
    });

    return { accessToken };
};

export const authService = { loginUserFromDB, generateAccessToken };
