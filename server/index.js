import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import setupSocket from "./socket.js"; // Assuming this is the class for socket management

dotenv.config();

// Server Setup Class
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.databaseURL = process.env.DATABSE_URL;

    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocket();
    this.connectDatabase();
  }

  setupMiddleware() {
    // Middleware
    this.app.use(
      cors({
        origin: [process.env.ORIGIN],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
      })
    );

    this.app.use("/uploads/profiles", express.static("uploads/profiles"));
    this.app.use("/uploads/files", express.static("uploads/files"));

    this.app.use(cookieParser());
    this.app.use(express.json());
  }

  setupRoutes() {
    // Define Routes
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/contacts", contactsRoutes);
    this.app.use("/api/messages", messagesRoutes);
    this.app.use("/api/channel", channelRoutes);
  }

  setupSocket() {
    // Setup Socket
    this.server = this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });

    // Instantiate the SocketManager (assuming it's a class)
    new setupSocket(this.server);
  }

  connectDatabase() {
    // Connect to MongoDB
    mongoose
      .connect(this.databaseURL)
      .then(() => {
        console.log("DB Connection Successful");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}

// Initialize the server
new Server();
