import trackModel from "./trackModel.js";

const ONEDAY = 24 * 60 * 60 * 1000;

const createTrack = async (id, name, popularity, images, artists) => {
  try {
    console.log("Creating track: ", name);
    await trackModel.create({
      last_updated: Date.now(),
      id: id,
      name: name,
      popularity: popularity,
      images: images,
      artists: artists,
    });
  } catch (err) {
    console.log(`Error creating track ${name}: ${err}`);
  }
};

const updateTrack = async (id, name, popularity, images, artists, last_updated) => {
  try {
    console.log(`Found track ${name}`);
    const now = new Date().getTime();
    const lastUpdated = new Date(last_updated).getTime();
    if (now - lastUpdated > ONEDAY) {
      console.log(`Track ${name} data is expired`);
      await trackModel.findOneAndUpdate(
        { id: id },
        {
          last_updated: Date.now(),
          id: id,
          name: name,
          popularity: popularity,
          images: images,
          artists: artists,
        }
      );
      console.log(`Track ${name} data updated`);
    } else {
      console.log(`Track ${name} data is not expired`);
    }
  } catch (err) {
    console.log(`Error updating track ${name}: ${err}`);
  }
};

export const updateTracks = async (tracks) => {
  try {
    for (let track of tracks) {
      const { id, name, popularity, images, artists } = track;
      const trackData = await trackModel.findOne({ id: id });
      if (!trackData) {
        await createTrack(id, name, popularity, images, artists);
      } else {
        const { last_updated } = trackData;
        await updateTrack(id, name, popularity, images, artists, last_updated);
      }
    }
  } catch (err) {
    console.log(`Error updating tracks: ${err}`);
  }
};

export const getTracks = async (items) => {
  try {
    const ids = items.map((item) => item.id);
    const tracks = await trackModel.find({ id: { $in: ids } });
    const finalTracks = items.map((item) => {
      const matchingTrack = tracks.find((track) => track.id === item.id);
      return {
        id: item.id,
        rank: item.rank,
        name: matchingTrack.name,
        images: matchingTrack.images,
        artists: matchingTrack.artists,
      };
    });
    return finalTracks;
  } catch (err) {
    if (!(err instanceof TypeError)) {
      console.error(`Error getting tracks: ${err}`);
    }
    return [];
  }
};
