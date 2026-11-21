import { Router } from "express";
// import { userController } from "./user.controller.js";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();

// Create New Student
router.post("/", userController.createUser);

// Get All Students
router.get(
    "/",
    auth(USER_ROLE.admin, USER_ROLE.agent),
    userController.getAllUsers,
);

// Get Single Student
router.get(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
    userController.getSingleUserById,
);

// Update User
router.put(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.user),
    userController.updateUserById,
);

// Delete User
router.delete("/:id", userController.deleteUserFromDB);

export const userRoutes = router;
