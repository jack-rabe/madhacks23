import { getUser, getAllUsers } from "./leaderboard";

export default function Test() {
  return (
    <div>
      <button className="btn" onClick={createUser.bind(null, "jack")}>
        create user
      </button>
      <button
        className="btn"
        onClick={guess.bind(null, { latitude: 3, longitude: 10 })}
      >
        submit guess
      </button>
      <button
        className={"btn"}
        onClick={() => {
          getAllUsers().then((users) => {
            console.log(users);
          });
        }}
      >
        get all users
      </button>
      <button className="btn" onClick={createLocation}>
        create location
      </button>
    </div>
  );
}

// creates a new user
async function createUser(username: string) {
  const password = crypto.randomUUID();
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);

  const data = await fetch("/api/user/create", {
    method: "POST",
    body: JSON.stringify(getUser(localStorage)),
  });
  const res = await data.json();
  console.log(res);
  console.log(`created user ${username}`);
}

export type UserLocation = { latitude: number; longitude: number };

// submits a guess for a user
async function guess(location: UserLocation) {
  const user = getUser(localStorage);
  if (!user) return;
  const body = JSON.stringify({
    username: user.username,
    password: user.password,
    location: location,
  });
  const data = await fetch("/api/guess", {
    method: "POST",
    body: body,
  });
  const res = await data.json();
  console.log(res);
}
function createLocation() {
  fetch("/api/location/create").then(() => console.log("location created"));
}
