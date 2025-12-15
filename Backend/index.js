const express = require("express");
require("dotenv").config();
require("colors");
const connectDB = require("./config/connectdb");
const cors = require("cors");
const app = express();
const path = require("path");


connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: "10mb" })); // default 1mb → 10mb
app.use(express.urlencoded({ extended: false, limit: "10mb" }));


// Product routes
app.use("/api", require("./routes/productRoutes"));

// Error middleware
app.use(require("./middleware/errorMiddleware"));

app.listen(process.env.PORT, () =>
  console.log(`server start on port ${process.env.PORT.yellow}`)
);
