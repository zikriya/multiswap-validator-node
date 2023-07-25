import mongoose from "mongoose";
import logger from "./logger";

export const connect = async () => {
  let url = process.env.MONGODB_URL ? process.env.MONGODB_URL : "";
  logger.info(mongoose.connection.readyState);
  if (
    mongoose.connection.readyState === 0 ||
    mongoose.connection.readyState === 3
  ) {
    await mongoose.connect(url).then(async () => {
      logger.info("New Connection established with MongoDB");
    });
  } else {
    logger.info("Aleardy Connected to MongoDB");
  }
};
