import mongoose from "mongoose";
import schema from "./trackSchema.js";
const trackModel = mongoose.model("Track", schema);
export default trackModel;
