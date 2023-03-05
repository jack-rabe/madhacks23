import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { defineUser, getUser, connectToMongo } from "./user/create";
import { UserLocation } from "../testing";
import { defineLocation } from "./location/create";

type Data = { distance: number } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password } = getUser(req, res);
  const User = defineUser();
  const UserLocation = defineLocation();
  const locationGuess = JSON.parse(req.body).location as UserLocation;

  await connectToMongo(res);
  const answer = await UserLocation.findOne();
  const distance = getDistance(
    locationGuess.latitude,
    locationGuess.longitude,
    answer.latitude,
    answer.longitude
  );
  // decrement number of guesses left
  await User.findOneAndUpdate(
    { username: username, password: password },
    { $inc: { guessesLeft: -1 } }
  );

  mongoose.connection.close();
  res.status(200).json({ distance: distance });
}

// see https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return Math.round(d * 1000);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
