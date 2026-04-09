const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ==================== IN-MEMORY STORAGE ====================
let demoUsers = [];
let mongoConnected = false;

// ==================== MONGODB CONNECTION ====================
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    mongoConnected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    mongoConnected = false;
    console.error("⚠️  MongoDB connection failed:", err.message);
    if (err.stack) console.error(err.stack.split('\n').slice(0,2).join('\n'));
    console.log("ℹ️  Falling back to DEMO MODE (in-memory storage).");
    console.log("➡️  To fix: ensure MongoDB is running locally (run 'mongod' or start the MongoDB service), or set a valid MONGODB_URI in Server/.env pointing to a reachable MongoDB instance.");
  }
};

const startServer = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log(`🔐 Mode: ${mongoConnected ? "Production (MongoDB)" : "Demo (In-Memory)"}\n`);
  });
};

connectMongoDB().finally(startServer);

// ==================== HELPER FUNCTIONS ====================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "demo_secret_key", {
    expiresIn: "7d",
  });
};

// ==================== AUTH ROUTES ====================

// Sign Up Endpoint
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email",
      });
    }

    if (mongoConnected) {
      // Use MongoDB
      const User = require("./models/User");
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already registered",
        });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      // Use Demo Mode (In-Memory)
      const existingUser = demoUsers.find((u) => u.email === email);

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already registered",
        });
      }

      const user = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
      };

      demoUsers.push(user);
      const token = generateToken(user.id);

      res.status(201).json({
        success: true,
        message: "User registered successfully (Demo Mode)",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error) {
    console.error("❌ Signup Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Server error during signup",
    });
  }
});

// Login Endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    if (mongoConnected) {
      // Use MongoDB
      const User = require("./models/User");
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      // Use Demo Mode (In-Memory)
      const user = demoUsers.find((u) => u.email === email && u.password === password);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const token = generateToken(user.id);

      res.status(200).json({
        success: true,
        message: "Logged in successfully (Demo Mode)",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Server error during login",
    });
  }
});
// ==================== CERTIFICATE VALIDATION ROUTE ====================
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

app.post("/validate-cert", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const pem = req.file.buffer.toString();

    // Validate certificate format
    if (!pem.includes("BEGIN")) {
      return res.status(400).json({
        success: false,
        error: "Invalid certificate file format",
      });
    }

    // Extract issuer and expiry (demo parsing)
    let issuer = "Self-Signed Certificate";
    let expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

    // Try to extract issuer from certificate
    if (pem.includes("Subject:")) {
      const subjectMatch = pem.match(/Subject:(.*?)(?:\n|$)/);
      if (subjectMatch) {
        issuer = subjectMatch[1].trim();
      }
    }

    // Determine status
    let status = "VALID";
    const now = new Date();

    if (now > expiry) {
      status = "EXPIRED";
    }

    return res.json({
      success: true,
      data: {
        issuer: issuer,
        expiry: expiry.toISOString(),
        status: status,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      },
    });
  } catch (err) {
    console.error("❌ Certificate Validation Error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Error processing certificate: " + err.message,
    });
  }
});

// ==================== HEALTH CHECK ====================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    mongodb: mongoConnected ? "Connected" : "Disconnected (Demo Mode)",
    mode: mongoConnected ? "Production" : "Demo",
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔐 Mode: ${mongoConnected ? "Production (MongoDB)" : "Demo (In-Memory)"}\n`);
});

module.exports = app;