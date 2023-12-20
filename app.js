import express from "express";
import session from "express-session";
import cors from "cors";
import "dotenv/config";
import AuthRoutes from "./auth/routes.js";

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

app.listen(process.env.PORT || 4000);
