import express from "express";
import ChannelController from "../controllers/ChannelControllers.js";

const router = express.Router();

router.post("/create", (req, res, next) => ChannelController.createChannel(req, res, next));
router.get("/userChannels", (req, res) => ChannelController.getUserChannels(req, res));
router.get("/:channelId/messages", (req, res, next) => ChannelController.getChannelMessages(req, res, next));

export default router;
