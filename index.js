import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import { loginValidation, registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import { postCreateValidation } from "./validations/post.js";

mongoose
  .connect(
    "mongodb+srv://admin:g4rczrDPlot30XBP@cluster0.1zx4t.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(console.log("db connected"))
  .catch((err) => console.log("db error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    const now = new Date();
    cb(
      null,
      file.originalname.slice(0, -4) +
        now.getTime() +
        file.originalname.slice(-4)
    );
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), async (req, res) => {
  try {
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Не удалось получить статьи" });
  }
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", postCreateValidation, checkAuth, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server start");
});
