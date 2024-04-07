const express = require("express");
const app = express();
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const listingRouter = require("./routes/listing.route");
const cookieParser = require("cookie-parser");
const path = require("path");

const dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

const cors = require("cors");
// const { execArgv } = require("process");
const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join((dirname, "client", "dist", "index.html")));
});

app.listen(3000, () => {
  console.log("Port is runnin on 3000");
});
