import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationDetector = () => {
  const [location, setLocation] = useState({ lat: null, lon: null, accuracy: null });
  const [initialLoc , seInitialLoc]= useState({ lat: null, lon: null});
  const [error, setError] = useState(null);

  const [distance , setDistance] = useState('');
  const companyLat = 13.0482176; // Company latitude
  const companyLon = 80.2193408; // Company longitude

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters
    return distance;
  };

  const getGoogleLocation = async () => {
    try {
      const googleApiKey = 'AIzaSyD-lPCCb7AFv6j-q4LtWbdKouyWxYTVqMw'; // Replace with your Google API key
      const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleApiKey}`;

      const response = await axios.post(url, { considerIp: true });
      const refinedLat = response.data.location.lat;
      const refinedLon = response.data.location.lng;
      const accuracy = response.data.accuracy;

      setLocation({ lat: refinedLat, lon: refinedLon, accuracy });
      console.log(`Refined Location: ${refinedLat}, ${refinedLon}`);
    //   Refined Location: 11.1271225, 78.6568942

    //my data
    // Refined Location: 13.0482176, 80.2193408


      const distance = calculateDistance(refinedLat, refinedLon, companyLat, companyLon);
      console.log(`Distance from company: ${distance} meters`);
      setDistance(distance);
    } catch (error) {
      console.error('Error refining location:', error);
      setError('Error refining location');
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLat = position.coords.latitude;
            const currentLon = position.coords.longitude;
            seInitialLoc({ lat: currentLat, lon: currentLon });
            console.log(`Initial Location: ${currentLat}, ${currentLon}`);
            getGoogleLocation();
          },
          (error) => {
            console.error('Error getting initial location:', error);
            setError('Error getting initial location');
            // In case of an error, fall back to Google location directly
            getGoogleLocation();
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        // Fall back to Google location if Geolocation API is not supported
        getGoogleLocation();
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      <h1>Location Detector</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <p>

        Our Inital Location calculated by our device: <br />
        latitude: {initialLoc.lat}, <br />
        longitude : {initialLoc.lon} <br /><br />


        Redefined by google <br />
          Latitude: {location.lat}<br />
          Longitude: {location.lon}<br />
          Accuracy: {location.accuracy} meters <br /> <br />

          company location = 13.0482176, 80.2193408 <br />

          Distance : {distance} meters


        </p>
      )}
    </div>
  );
};

export default LocationDetector;
