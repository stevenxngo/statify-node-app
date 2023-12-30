import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    last_updated: Date,
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    popularity: Number,
    images: {
      type: [{ url: String }],
      default: [
        "https://raw.githubusercontent.com/stevenxngo/statify-node-app/main/images/default_artist.jpeg",
      ],
    },
    genres: [String],
  },
  { collection: "artists" }
);

export default artistSchema;
