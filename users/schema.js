import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    accountId: { type: String, required: true, unique: true },
  },
  { collection: "users" }
);

export default userSchema;
