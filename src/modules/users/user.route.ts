import { Router } from "express";
// import { userController } from "./user.controller.js";
import { userController } from "./user.controller";

const router = Router();

// Create New Student
router.post("/", userController.createUser);

// Get All Students
router.get("/", userController.getAllUsers);

// Get Single Student
router.get("/:id", userController.getSingleUserById);

// Update User
router.put("/:id", userController.updateUserById);

// Delete User
router.delete("/:id", userController.deleteUserFromDB);

export const UserRoutes = router;
