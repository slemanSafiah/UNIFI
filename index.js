const app = require("express")();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./src/router/user.router");
const todoRoutes = require("./src/router/todo.router");

// prepare the .env config
dotenv.config();

// parse json request body
app.use(bodyParser.json({ limit: "50mb" }));

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

//************************** Access Origin ****************************************/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

// enable cors
app.use(cors());
app.options("*", cors());

//************************** connect to MongoDB ****************************************/
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  keepAlive: true,
  socketTimeoutMS: 36000,
  connectTimeoutMS: 36000,
});

mongoose.connection.on("open", () => {
  console.log("Connect to DB .....");
});
mongoose.connection.on("error", (err) => {
  console.log("Error in DB ...\n", err);
});

//************************ Prepare Routes *****************************************/

app.use("/user", userRoutes);
app.use("/todo", todoRoutes);

//************************ Create SERVER *****************************************/

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is Running at PORT : ${port} ...`);
});
