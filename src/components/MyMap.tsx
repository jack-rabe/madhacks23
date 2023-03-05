import { useContext, useEffect, useState } from "react";
import ScoreTracker from "./ScoreTracker";
import { getUser } from "../pages/leaderboard";
import { Button } from "react-bootstrap";
import {
  GoogleMap,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import { useRouter } from "next/router";

const MAX_ATTEMPTS = 3;

const MyMap = function F() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyB5Ze47MCUqSpm6JwVHGjwbeUsOlPrpAO0",
  });

  const router = useRouter();

  const [winLat, setWinLat] = useState(43.0766);
  const [winLng, setWinLong] = useState(-89.4125);
  const [winLoaded, setWinLoaded] = useState(false);

  const [buttonClickable, setButtonClickable] = useState(true);

  const [remainingAttempts, setRemainingAttempts] = useState(MAX_ATTEMPTS);
  const [distanceRemaining, setDistanceRemaining] = useState(null);

  useEffect(() => {
    async function fetchWinningCoords() {
      const res = await fetch("/api/location/winner");
      const { latitude, longitude } = (await res.json()).winner;
      setWinLat(latitude);
      setWinLong(longitude);
      setWinLoaded(true);
    }

    fetchWinningCoords();
  }, []);

  const streetViewContainerStyle = {
    height: "70vh",
    width: "90%",
  };

  useEffect(() => {
    if (remainingAttempts === 0) {
      console.log("You lose");
    }
  }, [remainingAttempts]);

  function backToMain() {
    router.push("/");
  }

  function submitGuess() {
    setButtonClickable(false);

    // Increment attempts
    setRemainingAttempts(remainingAttempts - 1);

    // Send the guess location to backend
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(changeCoords);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  async function changeCoords(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const user = getUser(localStorage);
    if (!user) {
      setButtonClickable(true);
      return;
    }
    const { username, password } = user;
    const body = JSON.stringify({
      username,
      password,
      location: { latitude: latitude, longitude: longitude },
    });
    const res = await fetch("/api/guess", {
      method: "POST",
      body: body,
    });
    const data = await res.json();
    const attempts = data.attempts;
    const distance = data.distance;
    setDistanceRemaining(distance);
    console.log(attempts);

    if (distance < 10) {
      console.log("You win");
    } else {
      console.log("Try again");
    }

    setButtonClickable(true);
  }

  if (isLoaded) {
    return (
      <>
        <div className="font-bold text-4xl navbar bg-primary mb-8">WisGo</div>
        {winLoaded ? (
          <div className="flex justify-center items-center">
            <GoogleMap
              zoom={15}
              center={{ lat: winLat, lng: winLng }}
              mapContainerStyle={streetViewContainerStyle}
            >
              <StreetViewPanorama
                // @ts-ignore
                position={{ lat: winLat, lng: winLng }}
                visible={true}
                onLoad={() => {
                  console.log("Street View loaded");
                  console.log(winLat);
                  console.log(winLng);
                }}
                onPositionChanged={() => {
                  console.log("Position changed");
                }}
                // onPovChanged={() => {
                //   console.log("POV changed");
                // }}
                options={{
                  linksControl: false,
                  enableCloseButton: false,
                  motionTrackingControl: true,
                  addressControl: false,
                }}
              />
            </GoogleMap>
          </div>
        ) : (
          <div className="text-center font-bold text-4xl">Loading ...</div>
        )}

        <div className="flex">
          <p>Remaining Attempts</p>
          <div
            className={remainingAttempts >= 3 ? "attempt-left" : "attempt-used"}
          ></div>
          <div
            className={remainingAttempts >= 2 ? "attempt-left" : "attempt-used"}
          ></div>
          <div
            className={remainingAttempts >= 1 ? "attempt-left" : "attempt-used"}
          ></div>
        </div>

        <div>
          {distanceRemaining != null && (
            <p>Distance Remaining: {distanceRemaining} m</p>
          )}
        </div>

        <div className="flex justify-center">
          {remainingAttempts > 0 && (
            <Button
              className="w-full mt-8"
              id="imherebutton"
              onClick={
                buttonClickable
                  ? submitGuess
                  : () => {
                      alert("Button disabled");
                    }
              }
            >
              I am here
            </Button>
          )}
          {remainingAttempts <= 0 && (
            <Button
              className="w-full mt-8"
              id="imherebutton"
              onClick={buttonClickable ? backToMain : () => {}}
            >
              Replay
            </Button>
          )}
        </div>
      </>
    );
  } else {
    return <p>Loading Google Maps API...</p>;
  }
};

export default MyMap;
