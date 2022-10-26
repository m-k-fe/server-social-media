const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const { checkUser, requireAuth } = require("./middlewares/auth");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  preflightContinue: false,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
//jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(201).send(res.locals.user._id);
});
//Routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("public"));
  app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
} else {
  app.get("/", (req, res) => res.send("Api Running"));
}
//Server
const port = process.env.PORT;
app.listen(port, console.log(`Server Running On Port ${port}`));
