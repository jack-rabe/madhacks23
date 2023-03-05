import { use, useContext, useEffect, useState } from "react";
import ScoreTracker from "./ScoreTracker";
import { getUser } from "../pages/leaderboard";
import { Button } from "react-bootstrap";
import {
  GoogleMap,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";

const MAX_ATTEMPTS = 3;

const MyMap = function F() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyB5Ze47MCUqSpm6JwVHGjwbeUsOlPrpAO0",
  });

  const [winLat, setWinLat] = useState(43.0766);
  const [winLng, setWinLong] = useState(-89.4125);
  const [winLoaded, setWinLoaded] = useState(false);

  const [remainingAttempts, setRemainingAttempts] = useState(MAX_ATTEMPTS);

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

  function submitGuess() {
    // If no remaining guesses send to lose screen
    if (remainingAttempts <= 0) {
      console.log("You Lose");
    }

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
    const { username, password } = getUser(localStorage);
    const body = JSON.stringify({
      username,
      password,
      location: { latitude: latitude, longitude: longitude },
    });
    const res = await fetch("/api/guess", {
      method: "POST",
      body: body,
    });
    const distance_left = await res.json();

    if (distance_left < 10) {
      console.log("You win");
    } else {
      console.log("Try again");
      console.log(distance_left);
    }
  }

  if (isLoaded) {
    return (
      <>
        <div className="font-bold text-4xl navbar bg-primary mb-8">
          WisGo logo
        </div>

        {winLoaded && (
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
        )}

        <div>
          <p>Remaining Attempts: {remainingAttempts}</p>
          <div className="rounded-full bg-blue-700"></div>
          <div className="rounded-full"></div>
          <div className="rounded-full"></div>
        </div>

        <div className="flex justify-center">
          <Button
            className="w-full mt-8"
            id="imherebutton"
            onClick={submitGuess}
          >
            I am here
          </Button>
        </div>
      </>
    );
  } else {
    return <p>Loading Google Maps API...</p>;
  }
};

export default MyMap;
