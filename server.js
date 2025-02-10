const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require('./routes/authRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/chatbot", chatbotRoutes);


// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected !!!"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Set the port to listen on
const PORT = process.env.PORT || 5000;  // Default port 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
