import { pool } from "../../db/index.js";
import type { IUser } from "./user.interface.js";
import bcrypt from "bcryptjs";

// Create User Into Database
const createUserIntoDB = async (payload: IUser) => {
    const { name, email, password, age, role } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `
        INSERT INTO users (name, email, password, age, role) VALUES ($1, $2, $3, $4, COALESCE($5, 'user')) RETURNING *
        `,
        [name, email, hashedPassword, age, role],
    );
    delete result.rows[0].password;
    return result;
};

// Get All Users From Datebase
const getAllUsersFromDB = async () => {
    const result = await pool.query(`
            SELECT * FROM users
            `);

    // Remove password for every user
    result.rows.map((user) => {
        delete user.password;
        return user;
    });

    return result;
};

// Get Single User From Database
const getSingleUserFromDB = async (id: string) => {
    const result = await pool.query(
        `
            SELECT * FROM users WHERE id = $1;
            `,
        [id],
    );

    return result;
};

// Update User
const updateUserIntoDB = async (payload: any, id: string) => {
    const { name, password, age, is_active } = payload;
    const result = await pool.query(
        `
        UPDATE users SET
        name = COALESCE($1, name),
        password = COALESCE($2, password),
        age = COALESCE($3, age),   
        is_active = COALESCE($4, is_active),
        updated_at = NOW()
        WHERE id = $5 RETURNING *
            `,
        [name ?? null, password ?? null, age ?? null, is_active ?? null, id],
    );

    return result;
};

// Delete User
const deleteUserFromDB = async (id: string) => {
    const result = await pool.query(
        `
            DELETE FROM users WHERE id = $1
            `,
        [id],
    );

    return result;
};

export const UserService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
};
