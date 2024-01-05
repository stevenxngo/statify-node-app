import userModel from "./userModel.js";
import { updateArtists, getArtists } from "../artists/artistDao.js";

const ONEDAY = 24 * 60 * 60 * 1000;

export const createUser = async (id) => {
  const user = await userModel.findOne({ id: id });
  if (!user) {
    console.log("Creating user: ", id);
    userModel.create({ id: id });
  }
};

export const getUserData = async (id, type, timespan) => {
  try {
    const user = await userModel.findOne({ id: id });
    const data = user[type][timespan];
    if (data && data.last_updated && data.items.length > 0) {
      const { last_updated, items } = data;
      const now = new Date().getTime();
      const lastUpdated = new Date(last_updated).getTime();
      if (now - lastUpdated > ONEDAY) {
        console.log("Data is expired");
        return [];
      } else {
        console.log("Data is not expired");
        if (type === "artists") {
          console.log(`Getting artists: ${items}`);
          return getArtists(items);
        } else if (type === "tracks") {
          return getTracks(items);
        } else {
          throw error("Invalid type: ", type);
        }
      }
    } else {
      console.log("Data not found in database");
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};

const updateUserArtists = async (id, timespan, ids) => {
  try {
    // console.log(`update user artists ids:`, ids);
    const updatedUser = await userModel.findOneAndUpdate(
      { id: id },
      {
        $set: {
          [`artists.${timespan}`]: { last_updated: Date.now(), items: ids },
        },
      },
      { new: true }
    );

    // console.log(`User updated: ${updatedUser}`);
    // console.log(`User artists updated: ${updatedUser.artists[timespan]}`);
    console.log(`User artists updated for ${timespan}`);
  } catch (error) {
    console.error(`Error updating user artists: ${error}`);
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
    // await user.save();
  } catch (err) {
    console.log(`Error saving data to database: ${err}`);
  }
};