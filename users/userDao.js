import model from "./userModel.js";

export const createUser = async (id) => {
  const user = await model.findById(id);
  if (!user) {
    console.log("Creating user: ", id);
    model.create({ _id: id });
  }
};
