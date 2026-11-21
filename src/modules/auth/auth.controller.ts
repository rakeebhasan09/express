import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserFromDB(req.body);
        const { refreshToken } = result;

        res.cookie("refreshToken", refreshToken, {
            secure: false, // http -> false, https -> true; development -> false, production -> true
            httpOnly: true, // Prevent XSS attack
            sameSite: "lax", // 'none' , 'strict', 'lax'
            path: "/",
            domain: "localhost", // Main domain name in production
        });

        // res.status(200).json({
        //     success: true,
        //     message: "User logged in successfully!",
        //     data: result,
        // });
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User logged in successfully!",
            data: result,
        });
    } catch (error: any) {
        // res.status(500).json({
        //     success: false,
        //     message: error?.message,
        //     error: error,
        // });

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

const generateToken = async (req: Request, res: Response) => {
    try {
        const result = await authService.generateAccessToken(
            req.cookies.refreshToken,
        );

        res.status(200).json({
            success: true,
            message: "Access token generated successfully!",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

export const authController = { loginUser, generateToken };
