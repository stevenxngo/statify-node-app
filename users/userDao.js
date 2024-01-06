import userModel from "./userModel.js";
import { updateArtists, getArtists } from "../artists/artistDao.js";
import { updateTracks, getTracks } from "../tracks/trackDao.js";

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
        ? getArtists(items)
        : type === "tracks"
        ? getTracks(items)
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

const updateUser = async (id, timespan, type, ids, updateFunction) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { id: id },
      {
        $set: {
          [`${type}.${timespan}`]: { last_updated: Date.now(), items: ids },
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
