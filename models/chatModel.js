const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "bot"], required: true }, // user or bot
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
