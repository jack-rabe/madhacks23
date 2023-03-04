import { User } from "./api/user";

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
    </div>
  );
}

// creates a new user
async function createUser(username: string) {
  const password = crypto.randomUUID();
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);

  const data = await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(getUser()),
  });
  const res = await data.json();
  console.log(res);
  console.log(`created user ${username}`);
}

export type UserLocation = { latitude: number; longitude: number };

// submits a guess for a user
async function guess(location: UserLocation) {
  const { username, password } = getUser();
  const body = JSON.stringify({
    username,
    password,
    location: location,
  });
  const data = await fetch("/api/guess", {
    method: "POST",
    body: body,
  });
  const res = await data.json();
  console.log(res);
}

// TODO - throw error or make user create an account if missing username or password
function getUser(): User {
  const username = localStorage.getItem("username") || "missing";
  const password = localStorage.getItem("password") || "missing";
  if (!username || !password) {
    console.error("username or password not set");
  }
  return { username: username, password: password };
}
