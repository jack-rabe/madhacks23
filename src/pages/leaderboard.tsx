import { useEffect, useState } from "react";
import { User } from "./api/user/create";

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState(false);
  let currentUser: null | User = null;
  if (typeof window != "undefined") {
    currentUser = getUser(localStorage)!;
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
  let cardNum = 0;
  const userCards = users.map((user) => {
    cardNum++;
    return (
      <PlayerCard
        key={cardNum}
        number={cardNum}
        name={user.username}
        score={user.score || 0}
        isCurrent={user.username === currentUser!.username}
      />
    );
  });
  return (
    <>
      <h1 className="text-center text-4xl m-3 font-bold text-red-800">
        Leaderboard
      </h1>
      <div className="mx-auto rounded-md flex hover:bg-red-900 justify-center bg-red-800 my-1 px-4 text-black w-3/4 ">
        <>Position</>
        <div className="divider divider-horizontal h-100"></div>
        <>Name</>
        <div className="divider divider-horizontal h-100"></div>
        <>Score</>
      </div>
      <div className="flex flex-col items-center overflow-scroll">
        {userCards}
      </div>
    </>
  );
}

function PlayerCard({
  name,
  score,
  isCurrent,
  number,
}: {
  name: string;
  score: number;
  isCurrent: boolean;
  number: number;
}) {
  return (
    <div
      className={`rounded-md flex hover:bg-red-900 justify-center bg-red-800 m-1 px-4 text-black ${
        isCurrent ? "text-white" : ""
      }`}
    >
      <>{number}.</>
      <div className="divider divider-horizontal h-100"></div>
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
export function getUser(storage: Storage): User | undefined {
  const username = storage.getItem("username");
  const password = storage.getItem("password");
  if (!username || !password) {
    console.error("username or password not set");
    return undefined;
  }
  return { username: username, password: password };
}
