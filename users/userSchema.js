import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, unique: true },
    tracks: {
      short_term: {
        last_updated: Date,
        items: [
          {
            rank: Number,
            track: { type: mongoose.Schema.Types.ObjectId, ref: "Track" },
          },
        ],
      },
      medium_term: {
        last_updated: Date,
        items: [
          {
            rank: Number,
            track: { type: mongoose.Schema.Types.ObjectId, ref: "Track" },
          },
        ],
      },
      long_term: {
        last_updated: Date,
        items: [
          {
            rank: Number,
            track: { type: mongoose.Schema.Types.ObjectId, ref: "Track" },
          },
        ],
      },
      default: { short_term: {}, medium_term: {}, long_term: {} },
    },
    artists: {
      short_term: {
        last_updated: Date,
        items: [
          {
            rank: Number,
            track: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
          },
        ],
      },
      medium_term: {
        last_updated: Date,
        items: [
          {
            rank: Number,
            track: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
          },
        ],
      },
      long_term: {
        last_updated: Date,
        items: [
          {
            rank: Number,
            track: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
          },
        ],
      },
      default: { short_term: {}, medium_term: {}, long_term: {} },
    },
  },
  { collection: "users" }
);

export default userSchema;
