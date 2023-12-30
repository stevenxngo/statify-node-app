import mongoose from "mongoose";
import schema from "./userSchema.js";
const userModel = mongoose.model("User", schema);
export default userModel;
