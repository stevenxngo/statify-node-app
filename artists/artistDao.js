import artistModel from "./artistModel.js";

const ONEDAY = 24 * 60 * 60 * 1000;

export const updateArtists = async (artists) => {
  try {
    for (const artist of artists) {
      const { id, name, popularity, images, genres } = artist;
      const artistData = await artistModel.findOne({ id: id });
      if (!artistData) {
        console.log("Creating artist: ", name);
        artistModel.create({
          last_updated: Date.now(),
          id: id,
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
          artistModel.findOneAndUpdate(
            { id: id },
            {
              last_updated: Date.now(),
              id: id,
              name: name,
              popularity: popularity,
              images: images,
              genres: genres,
            }
          );
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
    const ids = items.map((item) => item.id);
    const artists = await artistModel.find({ id: { $in: ids } });
    const finalArtists = items.map((item) => {
      const matchingArtist = artists.find((artist) => artist.id === item.id);
      return {
        id: item.id,
        rank: item.rank,
        name: matchingArtist.name,
        popularity: matchingArtist.popularity,
        images: matchingArtist.images,
        genres: matchingArtist.genres,
      };
    });
    finalArtists.sort((a, b) => a.rank - b.rank);
    // console.log("Final artists: ", finalArtists);
    return finalArtists;
  } catch (err) {
    console.log(err);
    return [];
  }
};