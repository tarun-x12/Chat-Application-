import express from "express";
import MessagesController from "../controllers/MessagesController.js";

const router = express.Router();

router.get("/messages", (req, res, next) => MessagesController.getMessages(req, res, next));
router.post("/upload", (req, res, next) => MessagesController.uploadFile(req, res, next));

export default router;
