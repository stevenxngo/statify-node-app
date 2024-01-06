import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
  {
    last_updated: Date,
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    popularity: Number,
    images: {
      type: [
        {
          url: String,
        },
      ],
      default: [
        {
          url: "https://raw.githubusercontent.com/stevenxngo/statify-node-app/main/images/default_track.png",
        },
      ],
    },
    artists: [
      {
        id: { type: String, ref: "Artist" },
        name: String,
      },
    ],
  },
  { collection: "tracks" }
);

export default trackSchema;
