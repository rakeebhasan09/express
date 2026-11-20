import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import jwt from "jsonwebtoken";
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
    // console.log(user.rows[0]);
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
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
        expiresIn: "1d",
    });

    const userData = user.rows[0];

    delete userData.password;

    return { accessToken, user: userData };
};

export const authService = { loginUserFromDB };
