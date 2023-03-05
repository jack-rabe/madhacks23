import { useRouter } from "next/router";
import { getUser } from "./leaderboard";
import React from "react";
import ReactPlayer from 'react-player';



export default function Home() {
  const router = useRouter();

  return (
    <div className="video-wrapper">
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
      <video src="/videos/videoslow.mp4" preload='auto' autoPlay loop muted />
    </div>
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
