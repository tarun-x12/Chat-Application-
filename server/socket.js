import { Server as SocketIOServer } from "socket.io";
import Message from "./model/MessagesModel.js";
import Channel from "./model/ChannelModel.js";

class SocketManager {
  constructor(server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.userSocketMap = new Map();
    this.messageHandler = new MessageHandler(this.io, this.userSocketMap);
    this.channelHandler = new ChannelHandler(this.io, this.userSocketMap);
    this.setup();
  }

  setup() {
    this.io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId;

      if (userId) {
        this.userSocketMap.set(userId, socket.id);
        console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
      } else {
        console.log("User ID not provided during connection.");
      }

      socket.on("add-channel-notify", (channel) => this.channelHandler.addChannelNotify(channel));
      socket.on("sendMessage", (message) => this.messageHandler.sendMessage(message));
      socket.on("send-channel-message", (message) => this.channelHandler.sendChannelMessage(message));
      socket.on("disconnect", () => this.disconnect(socket));
    });
  }

  disconnect(socket) {
    console.log("Client disconnected", socket.id);
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === socket.id) {
        this.userSocketMap.delete(userId);
        break;
      }
    }
  }
}

class MessageHandler {
  constructor(io, userSocketMap) {
    this.io = io;
    this.userSocketMap = userSocketMap;
  }

  async sendMessage(message) {
    const recipientSocketId = this.userSocketMap.get(message.recipient);
    const senderSocketId = this.userSocketMap.get(message.sender);

    // Create the message
    const createdMessage = await Message.create(message);

    // Find the created message by its ID and populate sender and recipient details
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color")
      .exec();

    if (recipientSocketId) {
      this.io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    // Optionally, send the message back to the sender (e.g., for message confirmation)
    if (senderSocketId) {
      this.io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  }
}

class ChannelHandler {
  constructor(io, userSocketMap) {
    this.io = io;
    this.userSocketMap = userSocketMap;
  }

  async addChannelNotify(channel) {
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = this.userSocketMap.get(member.toString());
        if (memberSocketId) {
          this.io.to(memberSocketId).emit("new-channel-added", channel);
        }
      });
    }
  }

  async sendChannelMessage(message) {
    const { channelId, sender, content, messageType, fileUrl } = message;

    // Create and save the message
    const createdMessage = await Message.create({
      sender,
      recipient: null, // Channel messages don't have a single recipient
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();

    // Add message to the channel
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    // Fetch all members of the channel
    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id };
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = this.userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          this.io.to(memberSocketId).emit("recieve-channel-message", finalData);
        }
      });
      const adminSocketId = this.userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        this.io.to(adminSocketId).emit("recieve-channel-message", finalData);
      }
    }
  }
}

export default SocketManager;
