import artistModel from "./artistModel.js";

const ONEDAY = 24 * 60 * 60 * 1000;

const createArtist = async (id, name, popularity, images, genres) => {
  console.log("Creating artist: ", name);
  await artistModel.create({
    last_updated: Date.now(),
    id: id,
    name: name,
    popularity: popularity,
    images: images,
    genres: genres,
  });
};

const updateArtist = async (id, name, popularity, images, genres) => {
  console.log(`Found artist ${name}`);
  const { last_updated } = artistData;
  const now = new Date().getTime();
  const lastUpdated = new Date(last_updated).getTime();
  if (now - lastUpdated > ONEDAY) {
    console.log(`Artist ${name} data is expired`);
    await artistModel.findOneAndUpdate(
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
    console.log(`Artist ${name} data updated`);
  } else {
    console.log(`Artist ${name} data is not expired`);
  }
};

export const updateArtists = async (artists) => {
  try {
    for (const artist of artists) {
      const { id, name, popularity, images, genres } = artist;
      const artistData = await artistModel.findOne({ id: id });
      if (!artistData) {
        await createArtist(id, name, popularity, images, genres);
      } else {
        await updateArtist(id, name, popularity, images, genres);
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
    return finalArtists;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getArtist = async (id) => {
  try {
    const artist = await artistModel.find({ id: id });
    return artist;
  } catch (err) {
    console.log(err);
    return null;
  }
};
