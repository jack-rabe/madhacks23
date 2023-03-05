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

  const mapContainerStyle = {
    height: "50vh",
    width: "90%",
  };

  function submitGuess() {
    if (navigator.geolocation) {
      const x = navigator.geolocation.getCurrentPosition(changeCoords, null, {
        maximumAge: 100 * 1000,
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  async function changeCoords(position: any) {
    console.log("hi");
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
          mapContainerStyle={mapContainerStyle}
        >
          <StreetViewPanorama
            // @ts-ignore
            position={{ lat: lat, lng: long }}
            visible={true}
            onLoad={() => {
              console.log("Street View loaded");
            }}
          />
        </GoogleMap>
        <GoogleMap
          zoom={15}
          center={{ lat: lat, lng: long }}
          mapContainerStyle={mapContainerStyle}
        >
          <MarkerF position={{ lat: lat, lng: long }} />
        </GoogleMap>

        <Button onClick={submitGuess}>I am here</Button>
      </>
    );
  } else {
    return <p>Loading Google Maps API...</p>;
  }
};

export default MyMap;
