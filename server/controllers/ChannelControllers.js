import mongoose from "mongoose";
import Channel from "../model/ChannelModel.js";
import User from "../model/UserModel.js";

class ChannelController {
  // Method to create a new channel
  async createChannel(request, response, next) {
    try {
      const { name, members } = request.body;
      const userId = request.userId;
      const admin = await User.findById(userId);
      
      if (!admin) {
        return response.status(400).json({ message: "Admin user not found." });
      }

      const validMembers = await User.find({ _id: { $in: members } });
      if (validMembers.length !== members.length) {
        return response
          .status(400)
          .json({ message: "Some members are not valid users." });
      }

      const newChannel = new Channel({
        name,
        members,
        admin: userId,
      });

      await newChannel.save();
      return response.status(201).json({ channel: newChannel });
    } catch (error) {
      console.error("Error creating channel:", error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Method to get channels for a specific user
  async getUserChannels(req, res) {
    try {
      const userId = new mongoose.Types.ObjectId(req.userId);
      const channels = await Channel.find({
        $or: [{ admin: userId }, { members: userId }],
      }).sort({ updatedAt: -1 });

      return res.status(200).json({ channels });
    } catch (error) {
      console.error("Error getting user channels:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Method to get messages for a specific channel
  async getChannelMessages(req, res, next) {
    try {
      const { channelId } = req.params;

      const channel = await Channel.findById(channelId).populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "firstName lastName email _id image color",
        },
      });

      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }

      const messages = channel.messages;
      return res.status(200).json({ messages });
    } catch (error) {
      console.error("Error getting channel messages:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

// Export a single instance of ChannelController
export default new ChannelController();
