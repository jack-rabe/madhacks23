import { useEffect, useState } from "react";
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

  function backToMain() {
    router.push("/");
  }

  function submitGuess() {
    setButtonClickable(false);

    // Increment attempts
    setRemainingAttempts(remainingAttempts - 1);

    // Send the guess location to backend
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(changeCoords, null, {
        enableHighAccuracy: true,
      });
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
    if (remainingAttempts === 1) {
      router.push(`/leaderboard?${distance}`);
    }

    setButtonClickable(true);
  }

  let button;
  if (buttonClickable) {
    button = (
      <button
        className="w-full text-xl font-bold py-4 mt-8 rounded-lg bg-red-800"
        onClick={
          buttonClickable
            ? submitGuess
            : () => {
                alert("Button disabled");
              }
        }
      >
        {remainingAttempts >= 3
          ? "Guess using your current location"
          : `You are ${distanceRemaining}m away!`}
      </button>
    );
  } else {
    button = (
      <button
        className="w-full text-xl font-bold py-4 mt-8 rounded-lg bg-red-800"
        onClick={() => {
          alert("Calculating distance from last guess...");
        }}
      >
        ...
      </button>
    );
  }

  if (isLoaded) {
    return (
      <>
        {winLoaded ? (
          <div>
            <div className="font-bold text-4xl navbar rounded-lg bg-red-800 mb-8 flex justify-between">
              <div className="text-4xl font-white m-3">WisGo</div>
              <div>
                <div
                  className={`m-2 border-4 border-gray-800 ${
                    remainingAttempts >= 3 ? "attempt-left" : "attempt-used"
                  }`}
                ></div>
                <div
                  className={`m-2 border-4 border-gray-800 ${
                    remainingAttempts >= 2 ? "attempt-left" : "attempt-used"
                  }`}
                ></div>
                <div
                  className={`m-2 border-4 border-gray-800  ${
                    remainingAttempts >= 1 ? "attempt-left" : "attempt-used"
                  }`}
                ></div>
              </div>
            </div>
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
                  }}
                  onPositionChanged={() => {
                    console.log("Position changed");
                  }}
                  options={{
                    linksControl: false,
                    enableCloseButton: false,
                    motionTrackingControl: true,
                    addressControl: false,
                  }}
                />
              </GoogleMap>
            </div>
            <div className="flex justify-center">{button}</div>
          </div>
        ) : (
          <div className="m-3 text-center font-bold text-4xl">Loading ...</div>
        )}
      </>
    );
  } else {
    return <p>Loading Google Maps API...</p>;
  }
};

export default MyMap;
