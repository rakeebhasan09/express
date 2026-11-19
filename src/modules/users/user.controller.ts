import type { Request, Response } from "express";
import { UserService } from "./user.service.js";

// Create New User
const createUser = async (req: Request, res: Response) => {
    try {
        const result = await UserService.createUserIntoDB(req.body);
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
};

// Get All Users
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await UserService.getAllUsersFromDB();

        res.status(200).json({
            success: true,
            message: "Users retrived successfull!!!",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

// Get Single User By ID
const getSingleUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await UserService.getSingleUserFromDB(id as string);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!!",
            });
        }

        res.status(200).json({
            success: true,
            message: "User Retrived Successfully!!",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

// Update User
const updateUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await UserService.updateUserIntoDB(
            req.body,
            id as string,
        );

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!!",
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully!!",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

// Delete User
const deleteUserFromDB = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await UserService.deleteUserFromDB(id as string);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!!",
            });
        }

        res.status(200).json({
            success: true,
            message: "User delete successfully!!",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

export const userController = {
    createUser,
    getAllUsers,
    getSingleUserById,
    updateUserById,
    deleteUserFromDB,
};
