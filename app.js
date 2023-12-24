import express from "express";
import session from "express-session";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import AuthRoutes from "./auth/routes.js";
import UserRoutes from "./users/routes.js";

// const dbName = "statify";
// const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
// const DB_LOCAL_STRING = `mongodb://127.0.0.1:27017/${dbName}`;

// process.env.DB_CONNECTION_STRING
//   ? mongoose.connect(DB_CONNECTION_STRING, { dbName: dbName })
//   : mongoose.connect(DB_LOCAL_STRING);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

const sessionOptions = {
  secret: "NewJeans73HanniPham",
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

AuthRoutes(app);
UserRoutes(app);

app.listen(process.env.PORT || 4000);
