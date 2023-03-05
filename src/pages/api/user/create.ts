import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = { username: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password } = getUser(req, res);
  const User = defineUser();
  await connectToMongo(res);
  const _user = await User.create({
    username: username,
    password: password,
    score: 0,
    distanceTraveled: 0,
    guessesLeft: 3,
  });

  mongoose.connection.close();
  res.status(200).json({ username: username });
}

// connect to mongodb database
export async function connectToMongo(res: NextApiResponse) {
  const mongo_user = process.env.MONGO_USER;
  const mongo_password = process.env.MONGO_PASS;
  if (!mongo_user || !mongo_password) {
    res.status(404).json({ error: "missing mongo credentials" });
  }
  const uri = `mongodb+srv://${mongo_user}:${mongo_password}@cluster0.bcacmvv.mongodb.net/test?retryWrites=true&w=majority`;
  await mongoose.connect(uri).catch((err) => console.error(err));
}

export type User = {
  username: string;
  password?: string;
  score?: number;
  guessesLeft?: number;
  distanceTraveled?: number;
};

// extract user from request body
export function getUser(req: NextApiRequest, res: NextApiResponse): User {
  const body = JSON.parse(req.body);
  const username = body.username;
  const password = body.password;
  if (!username || !password) {
    res.status(404).json({ error: "missing username or password" });
  }
  return { username: username, password: password };
}

export function defineUser() {
  const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    score: Number,
    guessesLeft: Number,
    distanceTraveled: Number,
  });
  return mongoose.models.User || mongoose.model("User", userSchema);
}
