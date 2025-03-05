const express = require("express");
const authenticateUser = require("./authMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/chatModel");
require("dotenv").config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", authenticateUser, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Use the correct Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const chatSession = model.startChat();
    const result = await chatSession.sendMessage(message);

    console.log("Gemini API Response:", result); // Debugging

    const botResponse = result.response.text() || "Sorry, I couldn't generate a response.";

    // Save chat history in MongoDB
    let chat = await Chat.findOne({ userId: req.user.userId });

    if (!chat) {
      chat = new Chat({ userId: req.user.userId, messages: [] });
    }

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "bot", content: botResponse });

    await chat.save();

    res.status(200).json({ botResponse });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
