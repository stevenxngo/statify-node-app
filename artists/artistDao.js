import artistModel from "./artistModel.js";

const ONEDAY = 24 * 60 * 60 * 1000;

export const updateArtists = async (artists) => {
  try {
    for (const artist of artists) {
      const { _id, name, popularity, images, genres } = artist;
      const artistData = await artistModel.findById(_id);
      if (!artistData) {
        console.log("Creating artist: ", name);
        artistModel.create({
          last_updated: Date.now(),
          _id: _id,
          name: name,
          popularity: popularity,
          images: images,
          genres: genres,
        });
      } else {
        console.log(`Found artist ${name}`);
        const { last_updated } = artistData;
        const now = new Date().getTime();
        const lastUpdated = new Date(last_updated).getTime();
        if (now - lastUpdated > ONEDAY) {
          console.log(`Artist ${name} data is expired`);
          artistModel.findByIdAndUpdate(_id, {
            last_updated: Date.now(),
            _id: id,
            name: name,
            popularity: popularity,
            images: images,
            genres: genres,
          });
        } else {
          console.log(`Artist ${name} data is not expired`);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const getArtists = async (items) => {
  try {
    const ids = items.map((item) => item._id);
    const artists = await artistModel.find({ _id: { $in: ids } });
    return artists;
  } catch (err) {
    console.log(err);
    return [];
  }
};