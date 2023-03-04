import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { defineUser, getUser, connectToMongo } from "./user";
import { UserLocation } from "../testing";

type Data = { username: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password } = getUser(req, res);
  const User = defineUser();

  // TODO check the users guess against the database
  const location = JSON.parse(req.body).location as UserLocation;
  console.log(location);

  // decrement number of guesses left
  await connectToMongo(res);
  await User.findOneAndUpdate(
    { username: username, password: password },
    { $inc: { guessesLeft: -1 } }
  );

  mongoose.connection.close();
  res.status(200).json({ username: username });
}
