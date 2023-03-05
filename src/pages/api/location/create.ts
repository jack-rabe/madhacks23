import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToMongo } from "../user/create";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const UserLocation = defineLocation();
  await connectToMongo(res);
  await UserLocation.create({ latitude: 43.073382, longitude: -89.406353 });

  mongoose.connection.close();
  res.status(200).json({ status: "success" });
}

export function defineLocation() {
  const locationSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
  });
  return mongoose.models.Location || mongoose.model("Location", locationSchema);
}
