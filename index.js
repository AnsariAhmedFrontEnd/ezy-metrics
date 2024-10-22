require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const apiRoutes = require("./routes/api");

app.use(express.json());

//mongoDB connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("EzyMetrics Backend API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api", apiRoutes);
