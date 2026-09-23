require("dotenv").config();
const express = require("express");
const { PORT = 5001 } = process.env;
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

console.log("Resend key loaded:", Boolean(process.env.RESEND_API_KEY));

console.log(
  "Resend key starts correctly:",
  process.env.RESEND_API_KEY?.startsWith("re_"),
);

mongoose
  .connect("mongodb://127.0.0.1:27017/tab_application")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());

app.get("/", (req, res) => {
  res.send("Tracking Application API is running");
});

app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
