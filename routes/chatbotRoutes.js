const express = require("express");
const authenticateUser = require('./authRoutes');

const router = express.Router();

// Protected Chatbot Route (POST request)
router.post("/chat", authenticateUser, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Simulated chatbot response (Replace with AI API)
    const botResponse = `Chatbot: You said "${message}"`;

    res.status(200).json({ botResponse });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
