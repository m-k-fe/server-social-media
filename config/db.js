const mongoose = require("mongoose");
const url = process.env.DB_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connection Successfull..."))
  .catch((err) => console.log("MongoDB Connection Failed", err));
