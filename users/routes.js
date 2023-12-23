import axios from "axios";
import "dotenv/config";

const SPOTIFY_V1_ENDPOINT = "https://api.spotify.com/v1";

function UserRoutes(app) {
  app.get("/api/user", async (req, res) => {
    try {
      const accountId = req.session["account_id"];
      // console.log("Account id in /api/user:", accountId);
      res.json(accountId);
    } catch (err) {
      console.log(err);
      res.status(500).json("Error getting logged in status");
    }
  });

  app.get("/api/user/me", async (req, res) => {
    try {
      const queryURL = `${SPOTIFY_V1_ENDPOINT}/me`;
      const params = {
        headers: {
          Authorization: `Bearer ${req.session["access_token"]}`,
        },
      };
      const response = await axios.get(queryURL, params);
      console.log("User data:", response.data);
      res.json(response.data);
    } catch (err) {
      console.log(err);
      res.status(500).json("Error getting user data");
    }
  });

  app.get("/api/user/top/:type/:time_range", async (req, res) => {
    try {
      const { type, time_range } = req.params;
      const queryURL = `${SPOTIFY_V1_ENDPOINT}/me/top/${type}`;
      const params = {
        params: {
          time_range: time_range,
          limit: 50,
        },
        headers: {
          Authorization: `Bearer ${req.session["access_token"]}`,
        },
      };
      const response = await axios.get(queryURL, params);
      console.log(`Top ${type} for ${time_range}`);
      // console.log(`Top ${type} for ${time_range}:`, response.data);
      res.json(response.data);
    } catch (err) {
      console.log(err);
      res.status(500).json(`Error getting top ${type} for ${time_range}`);
    }
  });
}

export default UserRoutes;
