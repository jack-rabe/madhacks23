import { use, useEffect, useState } from "react";
import { getUser } from "../pages/leaderboard";
import { Button } from "react-bootstrap";
import {
  GoogleMap,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";

const MyMap = function F() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyB5Ze47MCUqSpm6JwVHGjwbeUsOlPrpAO0",
  });

  const [winLat, setWinLat] = useState(43.0766);
  const [winLng, setWinLong] = useState(-89.4125);
  const [winLoaded, setWinLoaded] = useState(false);

  useEffect(() => {
    async function fetchWinningCoords() {
      const res = await fetch("/api/location/winner");
      const { latitude, longitude } = (await res.json()).winner;
      //   setWinLat(latitude);
      //   setWinLong(longitude);
      setWinLoaded(true);
    }
    fetchWinningCoords();
  }, []);

  const streetViewContainerStyle = {
    height: "70vh",
    width: "90%",
  };

  function submitGuess() {
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
    if (!user) return;
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
    console.log(attempts);

    if (distance < 10) {
      console.log("You win");
    } else {
      console.log("Try again");
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
                onPovChanged={() => {
                  console.log("POV changed");
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
        )}

        <div className="flex justify-center">
          <Button
            onClick={submitGuess}
            className="w-full mt-8 mx-3 bg-blue-700 border-5 border-rose-600"
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
