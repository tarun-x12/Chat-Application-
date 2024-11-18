import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.post("/signup", (req, res, next) => AuthController.signup(req, res, next));
router.post("/login", (req, res, next) => AuthController.login(req, res, next));
router.get("/user", (req, res, next) => AuthController.getUserInfo(req, res, next));
router.post("/logout", (req, res, next) => AuthController.logout(req, res, next));
router.put("/updateProfile", (req, res, next) => AuthController.updateProfile(req, res, next));
router.post("/addProfileImage", (req, res, next) => AuthController.addProfileImage(req, res, next));
router.delete("/removeProfileImage", (req, res, next) => AuthController.removeProfileImage(req, res, next));

export default router;
