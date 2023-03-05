import { useEffect, useState } from "react";
import { User } from "./api/user/create";

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState(false);
  let currentUser: null | User = null;
  if (typeof window != "undefined") {
    currentUser = getUser(localStorage);
  }

  useEffect(() => {
    async function fetchUsers() {
      const fetchedUsers = await getAllUsers();
      setLoaded(true);
      setUsers(fetchedUsers);
    }
    fetchUsers();
  }, []);

  if (!loaded) {
    return <div>loading...</div>;
  }
  const userCards = users.map((user) => {
    return (
      <PlayerCard
        key={user.username}
        name={user.username}
        score={user.score || 0}
        isCurrent={user.username === currentUser!.username}
      />
    );
  });
  return (
    <>
      <h1 className="text-center text-primary text-xl font-bold">
        Leaderboard
      </h1>
      {userCards}
    </>
  );
}

function PlayerCard({
  name,
  score,
  isCurrent,
}: {
  name: string;
  score: number;
  isCurrent: boolean;
}) {
  return (
    <div
      className={`rounded-md flex justify-center bg-primary m-3 w-32 px-12 ${
        isCurrent ? "text-black" : ""
      }`}
    >
      <>{name}</>
      <div className="divider divider-horizontal h-100"></div>
      <>{score}</>
    </div>
  );
}

export async function getAllUsers() {
  const data = await fetch("/api/user/users");
  const res = await data.json();
  return JSON.parse(res) as User[];
}

// TODO - throw error or make user create an account if missing username or password
export function getUser(storage: Storage): User {
  const username = storage.getItem("username") || "missing";
  const password = storage.getItem("password") || "missing";
  if (!username || !password) {
    console.error("username or password not set");
  }
  return { username: username, password: password };
}
