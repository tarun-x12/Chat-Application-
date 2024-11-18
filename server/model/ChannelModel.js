import mongoose from "mongoose";

// ChannelSchema Class: Responsible for defining the schema structure
class ChannelSchema {
  constructor() {
    this.schema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
      ],
      admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Messages",
          required: false,
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    });

    this.addPreSaveHooks();
    this.addPreUpdateHooks();
  }

  // Add pre-save hook
  addPreSaveHooks() {
    this.schema.pre("save", function (next) {
      this.updatedAt = Date.now();
      next();
    });
  }

  // Add pre-update hook
  addPreUpdateHooks() {
    this.schema.pre("findOneAndUpdate", function (next) {
      this.set({ updatedAt: Date.now() });
      next();
    });
  }

  // Return the schema
  getSchema() {
    return this.schema;
  }
}

// Channel Class: Handles operations related to Channel
class Channel {
  constructor() {
    const channelSchema = new ChannelSchema();
    this.model = mongoose.model("Channels", channelSchema.getSchema());
  }

  // Create a new channel
  async createChannel(channelData) {
    const channel = new this.model(channelData);
    await channel.save();
    return channel;
  }

  // Get a channel by ID
  async getChannelById(channelId) {
    return await this.model.findById(channelId).populate("members admin messages");
  }

  // Update a channel
  async updateChannel(channelId, updateData) {
    return await this.model.findByIdAndUpdate(channelId, updateData, { new: true });
  }

  // Delete a channel
  async deleteChannel(channelId) {
    return await this.model.findByIdAndDelete(channelId);
  }

  // Add message to a channel
  async addMessageToChannel(channelId, messageId) {
    return await this.model.findByIdAndUpdate(channelId, {
      $push: { messages: messageId },
    });
  }

  // Get all channels
  async getAllChannels() {
    return await this.model.find().populate("members admin messages");
  }
}

// Exporting both the schema and the class for use
export { ChannelSchema, Channel };
export default Channel;
