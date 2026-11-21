import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1-> Check is the token exists
            // 2-> Verify Token
            // 3-> Check if the user exists
            // 4-> Is the user status active

            // Get & Check the token
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access!!",
                });
            }

            // Verify Token
            const decode = jwt.verify(
                token as string,
                config.jwt_secret,
            ) as JwtPayload;

            // Fetch user and Check user exists in the database
            const user = await pool.query(
                `
        SELECT * FROM users WHERE email = $1
        `,
                [decode.email],
            );
            if (user.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found!!",
                });
            }

            // Check user status active or deactive
            if (!user.rows[0].is_active) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden!!",
                });
            }

            if (roles.length && !roles.includes(user.rows[0].role)) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorize Access!!",
                });
            }

            req.user = decode;

            next();
        } catch (error: any) {
            next(error);
        }
    };
};

export default auth;
