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
      const distance = window.location.href.split("?")[1];
      if (distance) {
        setTimeout(() => {
          alert(`Good job! you were ${distance} meters away :)`);
        }, 1000);
      }
    }
    fetchUsers();
  }, []);

  if (!loaded) {
    return (
      <div className="flex justify-center">
        <div className="m-3 text-4xl font-bold">Loading...</div>
      </div>
    );
  }
  let userNum = 0;

  return (
    <>
      <h1 className="text-center text-4xl m-3 font-bold text-white">
        Leaderboard
      </h1>
      <div className="overflow-x-auto">
        <table className="table w-4/5 m-auto border-4 border-red-800">
          <thead>
            <tr>
              <th className="text-center">Place</th>
              <th className="text-center">Name</th>
              <th className="text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              userNum++;
              return (
                <tr
                  key={userNum}
                  className={
                    user.username === currentUser?.username
                      ? "active font-bold"
                      : ""
                  }
                >
                  <td className="text-center">{userNum}</td>
                  <td className="text-center">{user.username}</td>
                  <td className="text-center">{user.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
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
