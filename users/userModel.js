import mongoose from "mongoose";
import schema from "./userSchema.js";
const model = mongoose.model("User", schema);
export default model;
