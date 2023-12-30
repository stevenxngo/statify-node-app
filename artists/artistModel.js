import mongoose from "mongoose";
import schema from "./artistSchema.js";
const artistModel = mongoose.model("Artist", schema);
export default artistModel;
