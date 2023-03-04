import { useState } from "react";
import { Button } from "react-bootstrap";
import {GoogleMap, MarkerF, StreetViewPanorama, useLoadScript} from '@react-google-maps/api'

const MyMap = () => {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: 'AIzaSyB5Ze47MCUqSpm6JwVHGjwbeUsOlPrpAO0'
    })

    const [lat, setLat] = useState(43.0766);
    const [long, setLong] = useState(-89.4125);

    const mapContainerStyle = {
        height: "100vh",
        width: "90%"
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
        console.log('Your new location is\nLatitude:', latitude, '\nLongitude:', longitude);
        setLat(latitude);
        setLong(longitude);
    }

    if(isLoaded) {
        return <>
            <h1>Google Maps</h1>
            <p>Current location: {lat}, {long}</p>
            <GoogleMap zoom={15} center={{lat: lat, lng: long}} mapContainerStyle={mapContainerStyle}>
                <StreetViewPanorama
                    position={{lat: lat, lng: long}}
                    visible={true}
                    onLoad={() => {
                        console.log('Street View loaded')
                    }}
                />
            </GoogleMap>
            <GoogleMap zoom={15} center={{lat: lat, lng: long}} mapContainerStyle={mapContainerStyle}>
                <MarkerF position={{lat:lat, lng:long}}/>
            </GoogleMap>
            
            <Button onClick={getLocation}>Get Current Location</Button>
        </>
    }
    else{
        return <p>Loading Google Maps API...</p>
    }
    
}

export default MyMap;