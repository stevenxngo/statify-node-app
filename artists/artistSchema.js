import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, unique: true },
    last_updated: Date,
    name: String,
    images: [{ url: String}],
    genres: [String],
  },
  { collection: "artists" }
);

export default artistSchema;
