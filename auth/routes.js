import axios from "axios";
import "dotenv/config";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const ACCOUNT_URL = "https://accounts.spotify.com";
const headers = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export const saveTokens = (req, access_token, expires_in, refresh_token) => {
  req.session["access_token"] = access_token;
  req.session["refresh_token"] = refresh_token;
  req.session["expiration_time"] = Date.now() + expires_in * 1000;
};

function AuthRoutes(app) {
  app.post("/api/auth/token", async (req, res) => {
    try {
      const queryURL = `${ACCOUNT_URL}/api/token`;
      const params = req.body;
      const response = await axios.post(queryURL, params, headers);
      const { access_token, expires_in, refresh_token } = response.data;
      saveTokens(req, access_token, expires_in, refresh_token);
      console.log("Logged in successfully");
      res.status(200).json("Logged in successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json("Error logging in");
    }
  });

  app.post("/api/auth/refresh", async (req, res) => {
    try {
      const queryURL = `${ACCOUNT_URL}/api/token`;
      const params = {
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: req.session["refresh_token"],
      };

      const response = await axios.post(queryURL, params, headers);
      const { access_token, expires_in, refresh_token } = response.data;
      saveTokens(req, access_token, expires_in, refresh_token);

      console.log("Refreshed successfully");
      res.status(200).json("Refreshed successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json("Error refreshing token");
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    try {
      req.session["access_token"] = null;
      req.session["refresh_token"] = null;
      req.session["expiration_time"] = null;
      req.session["account_id"] = null;
      req.session.destroy();
      res.status(200).json("Logged out successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json("Error logging out");
    }
  });
}

export default AuthRoutes;
