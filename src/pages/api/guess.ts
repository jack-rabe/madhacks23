import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { defineUser, getUser, connectToMongo } from "./user/create";
import { UserLocation } from "../testing";
import { defineLocation } from "./location/create";

var distanceCalc = require("gps-distance");

type Data = { distance: number; guessesLeft: number } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password } = getUser(req, res);
  const User = defineUser();
  const UserLocation = defineLocation();
  const locationGuess = JSON.parse(req.body).location as UserLocation;

  await connectToMongo(res);
  // ensure the user has the correct credentials
  const user = await validateUserAgainstDB({
    username: username!,
    password: password!,
  });
  if (!user) {
    mongoose.connection.close();
    res.status(404).json({ error: "incorrect credentials" });
  }

  const answer = await UserLocation.findOne();
  // const distance = getDistance(
  //   locationGuess.latitude,
  //   locationGuess.longitude,
  //   answer.latitude,
  //   answer.longitude
  // );

  let distance = distanceCalc(
    locationGuess.latitude,
    locationGuess.longitude,
    answer.latitude,
    answer.longitude
  );
  distance = (distance * 1000).toFixed(2);

  // decrement number of guesses left
  await User.findOneAndUpdate(
    { username: username, password: password },
    { $inc: { guessesLeft: -1 } }
  );
  // add score for user on last guess
  if (user.guessesLeft === 1) {
    const scoreBump = Math.ceil(1000 / distance);
    await User.findOneAndUpdate(
      { username: username, password: password },
      { $inc: { score: scoreBump } }
    );
  }

  mongoose.connection.close();
  // @ts-ignore
  res.status(200).json({ distance: distance, attempts: user.guessesLeft });
}

async function validateUserAgainstDB({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const User = defineUser();
  const user = await User.findOne({ username: username, password: password });
  console.log(user);
  return user;
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
