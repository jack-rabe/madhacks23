import { useState } from "react";
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

  const mapContainerStyle = {
    height: "20vh",
    width: "100%",
  };

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(changeCoords);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function changeCoords(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(
      "Your new location is\nLatitude:",
      latitude,
      "\nLongitude:",
      longitude
    );
    setLat(latitude);
    setLong(longitude);
  }

  if (isLoaded) {
    return (
      <>
        {/* <h1>Google Maps</h1>
            <p>Current location: {lat}, {long}</p> */}
        <GoogleMap
          zoom={15}
          center={{ lat: lat, lng: long }}
          mapContainerStyle={streetViewContainerStyle}
        >
          <StreetViewPanorama
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
        {/* <GoogleMap
          zoom={15}
          center={{ lat: lat, lng: long }}
          mapContainerStyle={mapContainerStyle}
        >
          <MarkerF position={{ lat: lat, lng: long }} />
        </GoogleMap> */}

        <div className="flex justify-center">
          <Button
            onClick={getLocation}
            className="w-full mt-2 bg-blue-700 border-5 border-rose-600"
          >
            Get Current Location
          </Button>
        </div>
      </>
    );
  } else {
    return <p>Loading Google Maps API...</p>;
  }
};

export default MyMap;
