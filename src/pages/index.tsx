import { useRouter } from "next/router";
import { getUser } from "./leaderboard";
import React from "react";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className="mainbox">
        <p className="titlegame">WISGO</p>
        <p className="titlegamemini">Explore UW Madison like never before!</p>
      </div>
      <div className="buttonplay hover:bg-black">
        <p
          className="buttontext"
          onClick={() => {
            if (localStorage.getItem("username")) router.push("/play");
            else alert("You must enter a username first");
          }}
        >
          PLAY
        </p>
        <input
          className="input"
          onBlur={(e) => {
            if (!localStorage.getItem("username")) createUser(e.target.value);
          }}
        ></input>
      </div>
      <video width="100%" height="100%" preload="auto">
        <source src="/videos/videoslow.mp4" type="video/mp4" />
      </video>
    </>
  );
}

async function createUser(username: string) {
  if (username === "") return;
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
