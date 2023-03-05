import { useState } from "react";
import { getUser } from "../pages/leaderboard";
import { Button } from "react-bootstrap";
import {
  GoogleMap,
  MarkerF,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";

const MyMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyB5Ze47MCUqSpm6JwVHGjwbeUsOlPrpAO0",
  });

  const [lat, setLat] = useState(43.0766);
  const [long, setLong] = useState(-89.4125);

  const streetViewContainerStyle = {
    height: "70vh",
    width: "100%",
  };

  function submitGuess() {
    if (navigator.geolocation) {
      const x = navigator.geolocation.getCurrentPosition(changeCoords);
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
    const data = await res.json();
    console.log(data);
    setLat(latitude);
    setLong(longitude);
  }

  if (isLoaded) {
    return (
      <>
        <h1>Google Maps</h1>
        <p>
          Current location: {lat}, {long}
        </p>
        <GoogleMap
          zoom={15}
          center={{ lat: lat, lng: long }}
          mapContainerStyle={streetViewContainerStyle}
        >
          <StreetViewPanorama
            // @ts-ignore
            position={{ lat: lat, lng: long }}
            visible={true}
            onLoad={() => {
              console.log("Street View loaded");
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
            }}
          />
        </GoogleMap>

        <div className="flex justify-center">
          <Button
            onClick={submitGuess}
            className="w-full mt-2 bg-blue-700 border-5 border-rose-600"
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
