import userModel from "./userModel.js";
import { updateArtists, getArtists } from "../artists/artistDao.js";
import { updateTracks, getTracks } from "../tracks/trackDao.js";
import { getTopData } from "./routes.js";

const ONEDAY = 24 * 60 * 60 * 1000;

export const createUser = async (id) => {
  try {
    if (!(await userModel.findOne({ id: id }))) {
      console.log("Creating user: ", id);
      userModel.create({ id: id });
    }
  } catch (err) {
    console.log(`Error creating user ${id}: ${err}`);
  }
};

export const getUserData = async (id, type, timespan) => {
  try {
    const user = await userModel.findOne({ id: id });
    const data = user?.[type]?.[timespan];

    if (data?.last_updated && data.items.length > 0) {
      const { last_updated, items } = data;
      const now = new Date().getTime();
      const lastUpdated = new Date(last_updated).getTime();

      if (now - lastUpdated > ONEDAY) {
        console.log("Data is expired");
        return [];
      }
      console.log("Data is not expired");
      return type === "artists"
        ? await getArtists(items)
        : type === "tracks"
        ? await getTracks(items)
        : type === "genres"
        ? items
        : [];
    } else {
      console.log(`No data found for ${type} ${timespan}`);
      return [];
    }
  } catch (err) {
    console.log(`Error getting user ${type} ${timespan}: ${err}`);
    return [];
  }
};

const updateUser = async (id, timespan, type, items) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { id: id },
      {
        $set: {
          [`${type}.${timespan}`]: { last_updated: Date.now(), items: items },
        },
      },
      { new: true }
    );
    console.log(`User ${type} updated for ${timespan}`);
  } catch (error) {
    console.error(`Error updating user ${type}: ${error}`);
  }
};

export const updateUserTracks = async (id, timespan, ids) => {
  updateUser(id, timespan, "tracks", ids);
};

export const updateUserArtists = async (id, timespan, ids) => {
  updateUser(id, timespan, "artists", ids);
};

export const updateUserGenres = async (id, timespan, genres) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { id: id },
      {
        $set: {
          [`genres.${timespan}`]: { last_updated: Date.now(), items: genres },
        },
      },
      { new: true }
    );
    console.log(`User genres updated for ${timespan}`);
  } catch (error) {
    console.error(`Error updating user genres: ${error}`);
  }
};

export const updateUserData = async (id, type, timespan, ids, data) => {
  try {
    if (type === "tracks") {
      updateTracks(data);
      updateUserTracks(id, timespan, ids);
    } else if (type === "artists") {
      updateArtists(data);
      updateUserArtists(id, timespan, ids);
    }
  } catch (err) {
    console.log(`Error saving data to database: ${err}`);
  }
};

export const calculateGenres = async (req, timespan) => {
  try {
    const user = await userModel.findOne({ id: req.session["account_id"] });
    const data = user?.["artists"]?.[timespan];
    if (data.items.length > 0) {
      const { items } = data;
      const artists = await getArtists(items);
      console.log("Artists in genres: ", artists);
      const genreCounts = {};
      artists.forEach((artist) => {
        const genres = artist.genres;

        genres.forEach((genre) => {
          if (!genreCounts[genre]) {
            genreCounts[genre] = { count: 0, artists: [] };
          }

          genreCounts[genre].count++;
          genreCounts[genre].artists.push(artist.name);
        });
      });

      const genreArray = Object.entries(genreCounts).map(([genre, data]) => ({
        genre,
        count: data.count,
        artists: data.artists,
      }));

      genreArray.sort((a, b) => b.count - a.count);
      genreArray.forEach((genre, index) => {
        genre.rank = index + 1;
      });
      console.log("Genres: ", genreArray);
      return genreArray;
    } else {
      await getTopData(req, "artists", timespan);
      calculateGenres(req, timespan);
    }
  } catch (err) {
    console.log(`Error calculating genres: ${err}`);
  }
};
