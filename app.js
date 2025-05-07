require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

// parse comma‑separated origins, trimming whitespace
const rawOrigins = process.env.CORS_ORIGINS || "";
const allowedOrigins = rawOrigins
  .split(",")
  .map((url) => url.trim())
  .filter((url) => url.length);

const app = express();

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!incomingOrigin) return callback(null, true);

      if (allowedOrigins.includes(incomingOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy denies access from ${incomingOrigin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.error(err));
