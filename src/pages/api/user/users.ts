import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToMongo, defineUser, User } from "./create";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const User = defineUser();
  await connectToMongo(res);
  let users = (await User.find({})) as User[];
  users = users
    .map((user) => {
      return { username: user.username, score: user.score || 0 };
    })
    .sort((userOne, userTwo) => {
      return userTwo.score - userOne.score;
    });

  mongoose.connection.close();
  res.status(200).json(JSON.stringify(users));
}
