import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, unique: true },
    last_updated: Date,
    name: String,
    images: [{ url: String}],
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
  },
  { collection: "tracks" }
);

export default trackSchema;
