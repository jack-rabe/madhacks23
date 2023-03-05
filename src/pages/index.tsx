import { useRouter } from "next/router";
import React from "react";



export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="mainbox">
        <p className="titlegame">WISGO</p>
        <p className="titlegamemini">Explore UW Madison like never before!</p>
      </div>
      <div className="buttonplay">
        <p className="buttontext" onClick={() => router.push("/play")}>
          PLAY
        </p>
      </div>
      <video width="100%" height="100%"  preload='auto'>
        <source src="/videos/videoslow.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
