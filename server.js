require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());




// IMPORT ROUTE
const transactions = require("./routes/transactions");
const authRoutes = require("./routes/auth");

// USE ROUTE
app.use("/api/transactions", transactions);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("CrediTrack API is running...");
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });


