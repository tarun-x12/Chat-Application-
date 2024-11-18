class MessageSchema {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
        recipient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
          required: false,
        },
        messageType: {
          type: String,
          enum: ["text", "audio", "file"],
          required: true,
        },
        content: {
          type: String,
          required: function () {
            return this.messageType === "text";
          },
        },
        audioUrl: {
          type: String,
          required: function () {
            return this.messageType === "audio";
          },
        },
        fileUrl: {
          type: String,
          required: function () {
            return this.messageType === "file";
          },
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
      { timestamps: true }
    );
  }
}

class MessagesModel {
  constructor() {
    this.messageSchema = new MessageSchema().schema;
    this.Message = mongoose.model("Messages", this.messageSchema);
  }

  async createMessage(data) {
    try {
      const message = new this.Message(data);
      await message.save();
      return message;
    } catch (error) {
      throw new Error("Error creating message: " + error.message);
    }
  }

  async getMessageById(messageId) {
    try {
      const message = await this.Message.findById(messageId).exec();
      return message;
    } catch (error) {
      throw new Error("Error fetching message: " + error.message);
    }
  }

  async updateMessage(messageId, data) {
    try {
      const updatedMessage = await this.Message.findByIdAndUpdate(messageId, data, { new: true }).exec();
      return updatedMessage;
    } catch (error) {
      throw new Error("Error updating message: " + error.message);
    }
  }

  async deleteMessage(messageId) {
    try {
      await this.Message.findByIdAndDelete(messageId).exec();
      return "Message deleted successfully";
    } catch (error) {
      throw new Error("Error deleting message: " + error.message);
    }
  }
}

// Default export the model class
export default MessagesModel;
