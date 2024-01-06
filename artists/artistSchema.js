import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    last_updated: Date,
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    popularity: Number,
    images: {
      type: [
        {
          url: String,
        },
      ],
      default: [
        {
          url: "https://raw.githubusercontent.com/stevenxngo/statify-node-app/main/images/default_artist.jpeg",
        },
      ],
    },
    genres: {
      type: [String],
      default: [""],
    },
  },
  { collection: "artists" }
);

export default artistSchema;
