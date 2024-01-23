const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv");
const quizRoutes = require("./routes/quizRoutes");
const logger = require("./Middleware/logger");
const questionRoutes = require("./routes/questionRoutes");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

// app.use((error, req, res, next) => {
//   if (error.type === "entity.parse.failed") {
//     // Log the error for debugging purposes
//     console.error("Bad JSON", error);

//     // Respond with a 400 Bad Request to the client
//     return res.status(400).send({ message: "Bad request: Invalid JSON" });
//   }
//   next();
// });

// Connect to MongoDB
app.get("/", (req, res) => {
  res.send({ message: "welcome" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log(`Server running on http://localhost:${PORT}`))
    .catch((err) => console.log(err));
});
