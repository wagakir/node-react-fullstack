import express from "express";
import mongoose from "mongoose";
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

app.use(express.json());

app.post("/auth/login", loginValidation, UserController.login);

app.post("/auth/register", registerValidation, UserController.register);

app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", postCreateValidation, checkAuth, PostController.create);
app.delete("/posts/:id", PostController.remove);
// app.patch("/posts", PostController.update);

// app.get("/posts", PostController.getAll);
// app.get("/posts", PostController.getAll);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server start");
});
