const express = require("express");
const authenticateUser = require("./authMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/chatModel"); // Import chat model
require("dotenv").config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Protected Chatbot Route
router.post("/chat", authenticateUser, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Generate response using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const botResponse = result.response.text();

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

// Get Chat History for User
router.get("/history", authenticateUser, async (req, res) => {
    try {
      const chat = await Chat.findOne({ userId: req.user.userId });
  
      if (!chat) {
        return res.status(404).json({ message: "No chat history found" });
      }
  
      res.status(200).json({ chatHistory: chat.messages });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
  

module.exports = router;
