import trackModel from "./trackModel.js";

const ONEDAY = 24 * 60 * 60 * 1000;

export const updateTracks = async (tracks) => {
  try {
    for (let track of tracks) {
      const { id, name, popularity, images, artists } = track;
      const trackData = await trackModel.findOne({ id: id });
      if (!trackData) {
        console.log("Creating track: ", name);
        await trackModel.create({
          last_updated: Date.now(),
          id: id,
          name: name,
          popularity: popularity,
          images: images,
          artists: artists,
        });
      } else {
        console.log(`Found track ${name}`);
        const { last_updated } = trackData;
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
      }
    }
  } catch (err) {
    console.log(err);
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
    console.log(err);
    return [];
  }
};
