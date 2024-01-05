import "dotenv/config";
import * as dao from "./userDao.js";
import { spotifyGet, checkExpiration } from "../common/spotifyApiUtils.js";

const SPOTIFY_V1_ENDPOINT = "https://api.spotify.com/v1";

const getAccountParams = (req) => {
  const params = {
    headers: {
      Authorization: `Bearer ${req.session["access_token"]}`,
    },
  };
  return params;
};

const filterArtists = (artists) => {
  return artists.map((artist, index) => ({
    rank: index,
    id: artist.id,
    name: artist.name,
    popularity: artist.popularity,
    images: artist.images,
    genres: artist.genres,
  }));
};

const filterTracks = (tracks) => {
  return tracks.map((track, index) => ({
    rank: index,
    id: track.id,
    name: track.name,
    popularity: track.popularity,
    images: track.album.images,
    artists: filterArtists(track.artists),
  }));
};

const filterItems = (items, type) => {
  if (type === "artists") {
    return filterArtists(items);
  } else if (type === "tracks") {
    return filterTracks(items);
  } else {
    throw error("Invalid type: ", type);
  }
};

const getIds = (items) => {
  return items.map((item, index) => ({ rank: index, id: item.id }));
};

const getTopParams = (req, time_range) => {
  const params = {
    params: {
      time_range: time_range,
      limit: 50,
    },
    headers: {
      Authorization: `Bearer ${req.session["access_token"]}`,
    },
  };
  return params;
};

const getTopData = async (req, res, type, time_range) => {
  await checkExpiration(req);
  const queryURL = `${SPOTIFY_V1_ENDPOINT}/me/top/${type}`;
  const params = getTopParams(req, time_range);
  const response = await spotifyGet(req, queryURL, params);
  const filteredItems = filterItems(response.data.items, type);
  const ids = getIds(filteredItems);
  console.log("ids: ", ids);
  await dao.updateUserData(
    req.session["account_id"],
    type,
    time_range,
    ids,
    filteredItems
  );
  res.json(filteredItems);
};

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
      const params = getAccountParams(req);
      const response = await spotifyGet(req, queryURL, params);
      const { id } = response.data;
      req.session["account_id"] = id;
      await dao.createUser(id);
      res.status(200).json("Account saved successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json("Error getting user data");
    }
  });

  app.get("/api/user/top/:type/:time_range", async (req, res) => {
    const { type, time_range } = req.params;
    try {
      // check database for data
      const dbData = await dao.getUserData(
        req.session["account_id"],
        type,
        time_range
      );

      if (dbData && dbData.length > 0) {
        // found data in database
        console.log(`Found data in database for ${type} ${time_range}`);
        res.json(dbData);
      } else {
        // get data from spotify api
        console.log(`Data not found in database for ${type} ${time_range}`);
        await getTopData(req, res, type, time_range);
      }
    } catch (err) {
      console.log(err);
      const { type, time_range } = req.params;
      res.status(500).json(`Error getting top ${type} for ${time_range}`);
    }
  });
}

export default UserRoutes;
