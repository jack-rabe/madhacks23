import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToMongo } from "../user/create";
import { defineLocation } from "./create";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const UserLocation = defineLocation();
  await connectToMongo(res);
  const winner = await UserLocation.findOne();

  mongoose.connection.close();
  res.status(200).json({ winner: winner });
}
