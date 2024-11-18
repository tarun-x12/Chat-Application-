import Message from "../model/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

class MessagesController {
  // Method to get messages between two users
  async getMessages(req, res, next) {
    try {
      const user1 = req.userId;
      const user2 = req.body.id;

      if (!user1 || !user2) {
        return res.status(400).send("Both user IDs are required.");
      }

      const messages = await Message.find({
        $or: [
          { sender: user1, recipient: user2 },
          { sender: user2, recipient: user1 },
        ],
      }).sort({ timestamp: 1 });

      return res.status(200).json({ messages });
    } catch (err) {
      console.log("Error retrieving messages:", err);
      return res.status(500).send("Internal Server Error");
    }
  }

  // Method to handle file upload
  async uploadFile(request, response, next) {
    try {
      if (request.file) {
        console.log("in try if");
        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${request.file.originalname}`;

        // Create directory if it doesn't exist
        mkdirSync(fileDir, { recursive: true });

        renameSync(request.file.path, fileName);
        return response.status(200).json({ filePath: fileName });
      } else {
        return response.status(404).send("File is required.");
      }
    } catch (error) {
      console.log("Error uploading file:", error);
      return response.status(500).send("Internal Server Error.");
    }
  }
}

// Export a single instance of MessagesController
export default new MessagesController();
