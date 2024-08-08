import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CheckLot = () => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
//   const companyLat = 11.5424; // Company's latitude - vadalur
//   const companyLng = 79.5097; // Company's longitude
//   const companyLat = 11.534117; // Company's latitude - my location , but showing wrong
//   const companyLng = 79.484058; // Company's longitude
  const companyLat = 11.534117; // Company's latitude
  const companyLng = 79.484058; // Company's longitude
  const radius = 200; // Radius in meters

//   current location 11.1271225 78.6568942

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };

    const successCallback = (position) => {
    //   const { latitude, longitude } = position.coords;
    //   let latitude = 11.6086;
    //   let longitude = 79.4864;
      let latitude = 11.127122;
      let longitude = 78.656894;

      console.log("company location = ", companyLat, companyLng);
      console.log("current location = ", latitude, longitude);
      const distance = calculateDistance(latitude, longitude, companyLat, companyLng);
      console.log('distance = ', distance); // Log distance to verify
      if (distance <= radius) {
        fetchAddress(latitude, longitude);
        saveCheckIn(latitude, longitude);
      } else {
        setError(`You are not within the allowed check-in radius. Distance: ${distance.toFixed(2)} meters`);
      }
    };

    const errorCallback = (error) => {
      setError(error.message);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3; // metres
      const φ1 = lat1 * Math.PI/180; // φ, λ in radians
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2 - lat1) * Math.PI/180;
      const Δλ = (lon2 - lon1) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      const distance = R * c; // in metres
      return distance;
    };

    const fetchAddress = async (lat, lng) => {
      const apiKey = 'AIzaSyD-lPCCb7AFv6j-q4LtWbdKouyWxYTVqMw';
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const relevantResult = data.results.find(result => result.types.includes("street_address")) || data.results[0];
        setAddress(relevantResult.formatted_address);
      } else {
        setError('Unable to retrieve address');
      }
    };

    const saveCheckIn = async (latitude, longitude) => {
      try {
        // const response = await axios.post('/api/checkin', { latitude, longitude });
        console.log('Check-in successful:');
      } catch (err) {
        console.error('Error saving check-in:', err);
        setError('Error saving check-in');
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <div>
      <h1>CheckLot</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Address: {address}</p>
      )}
    </div>
  );
};

export default CheckLot;
