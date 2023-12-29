import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, unique: true },
    tracks: {
      short_term: {
        last_updated: Date,
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
      },
      medium_term: {
        last_updated: Date,
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
      },
      long_term: {
        last_updated: Date,
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
      },
    },
    artists: {
      short_term: {
        last_updated: Date,
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
      },
      medium_term: {
        last_updated: Date,
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
      },
      long_term: {
        last_updated: Date,
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
      },
    },
  },
  { collection: "users" }
);

export default userSchema;
