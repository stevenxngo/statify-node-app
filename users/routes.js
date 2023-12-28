import axios from "axios";
import { spotifyGet, checkExpiration } from "../common/spotifyApiUtils.js";
import "dotenv/config";

const SPOTIFY_V1_ENDPOINT = "https://api.spotify.com/v1";

function UserRoutes(app) {
  app.get("/api/user", async (req, res) => {
    try {
      const accountId = req.session["account_id"];
      res.json(accountId);
    } catch (err) {
      console.log(err);
      res.status(500).json("Error getting logged in status");
    }
  });

  app.post("/api/user/me", async (req, res) => {
    try {
      await checkExpiration(req);
      const queryURL = `${SPOTIFY_V1_ENDPOINT}/me`;
      const params = {
        headers: {
          Authorization: `Bearer ${req.session["access_token"]}`,
        },
      };
      // const response = await axios.get(queryURL, params);
      const response = await spotifyGet(req, queryURL, params);
      const { id } = response.data;
      req.session["account_id"] = id;
      res.status(200).json("Account saved successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json("Error getting user data");
    }
  });

  const filterArtists = (artists) => {
    return artists.map((artist, index) => ({
      rank: index,
      id: artist.id,
      name: artist.name,
      images: artist.images,
      genres: artist.genres,
    }));
  };

  const filterItems = (items, type) => {
    if (type === "artists") {
      return filterArtists(items);
    } else if (type === "tracks") {
      return items.map((track, index) => ({
        rank: index,
        id: track.id,
        name: track.name,
        images: track.album.images,
        artists: filterArtists(track.artists),
      }));
    } else {
      throw error("Invalid type: ", type);
    }
  };

  app.get("/api/user/top/:type/:time_range", async (req, res) => {
    const { type, time_range } = req.params;
    try {
      await checkExpiration(req);
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
      // const response = await axios.get(queryURL, params);
      const response = await spotifyGet(req, queryURL, params);
      const filteredItems = filterItems(response.data.items, type);
      response.data.items = filteredItems;
      res.json(response.data);
    } catch (err) {
      console.log(err);
      const { type, time_range } = req.params;
      res.status(500).json(`Error getting top ${type} for ${time_range}`);
    }
  });
}

export default UserRoutes;
