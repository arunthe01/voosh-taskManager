const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();
const { Authrouter } = require("./Routes/AuthRoutes");
const connectDb = require("../DB/Utils/connectToDb");
const dotenv = require("dotenv");
const taskRoutes = require("./Routes/taskRoutes");
const ssoRouter = require("./Routes/ssoRoutes");
app.use(cors());

require("dotenv").config();

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
connectDb();

app.use("/taskManager", Authrouter);
app.use("/taskManager", taskRoutes);
app.use("/taskManager", ssoRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log("started listening on 8080");
});
