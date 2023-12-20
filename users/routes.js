import axios from "axios";
import "dotenv/config";

const SPOTIFY_V1_ENDPOINT = "https://api.spotify.com/v1";

function UserRoutes(app) {
  app.get("/api/top/:type/:time_range", async (req, res) => {
    const { type, time_range } = req.params;
    console.log(`GET /top/${type}/${time_range}`);
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
    // console.log("Access Token: ", req.session["access_token"])
    console.log("Header: ", params.headers);
    const response = await axios.get(queryURL, params);
    console.log(response.data);
    res.json(response.data);
  });
}

export default UserRoutes;
