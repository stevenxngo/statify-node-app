import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
  {
    last_updated: Date,
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    images: {
      type: [{ url: String }],
      default: [
        "https://raw.githubusercontent.com/stevenxngo/statify-node-app/main/images/default_track.png",
      ],
    },
    artists: [
      {
        name: String,
        artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
      },
    ],
  },
  { collection: "tracks" }
);

export default trackSchema;
