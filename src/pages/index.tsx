import { useRouter } from "next/router";
import { getUser } from "./leaderboard";
import React from "react";
import ReactPlayer from "react-player";

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
            else
              alert(
                "If you entered a username, your account is being created now"
              );
          }}
        >
          PLAY
        </p>
      </div>
      <input
        placeholder="Input username here..."
        className="input"
        onBlur={(e) => {
          if (!localStorage.getItem("username")) createUser(e.target.value);
        }}
      ></input>
      <video src="/videos/videoslow.mp4" preload="auto" autoPlay loop muted />
    </div>
  );
}

async function createUser(username: string) {
  if (username === "") return;
  const password = crypto.randomUUID();

  const data = await fetch("/api/user/create", {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });
  const res = await data.json();
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
  console.log(res);
  console.log(`created user ${username}`);
}
