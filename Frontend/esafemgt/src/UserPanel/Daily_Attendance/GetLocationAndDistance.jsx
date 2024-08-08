import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';

const GetLocationDistance = ({ locationLoaded , setLocationLoaded , distance , setDistance , address , setAddress , distanceError , setDistanceError }) => {
    // const [location, setLocation] = useState({ lat: null, lon: null, accuracy: null });
    const [initialLoc , seInitialLoc]= useState({ lat: null, lon: null});
    const [error, setError] = useState(null);
    

    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const currentLat = position.coords.latitude;
              const currentLon = position.coords.longitude;
              seInitialLoc({ lat: currentLat, lon: currentLon });
              console.log(`Cuurent Location: ${currentLat}, ${currentLon}`);

              // console.log();
              fetchAddress(currentLat, currentLon);

              const homeLat = import.meta.env.VITE_COMPANY_LAT;
              const homeLong = import.meta.env.VITE_COMPANY_LONG;

              console.log("Company lat long = ", homeLat, homeLong);

              console.log(homeLat, homeLong, currentLat, currentLon);
              const distance = calculateDistance(parseFloat(homeLat) , parseFloat(homeLong) ,  currentLat , currentLon );

              if(distance.toFixed(2) > 100){
                setDistanceError('Go inside the office campus to check in');
              } else {
                setDistanceError('');
              }
              setDistance(distance.toFixed(2));
              console.log("locationLoaded  = ", locationLoaded)
              setLocationLoaded(true);
              // setLocationEnabled(true); 

              // getGoogleLocation();
            },
            (error) => {
              console.error('Error getting initial location:', error);
              setError('Turn on your location, Please go outdoor.');
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          setError('Geolocation is not supported by this browser.');
        }
      };

    useEffect(() => {
        getLocation();
      }, [locationLoaded]);


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


      const fetchAddress = async (lat, lng) => {
        console.log("Fetching address")
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
        const data = await response.json();
  
        if (data.status === 'OK' && data.results.length > 0) {
          const relevantResult = data.results.find(result => result.types.includes("street_address")) || data.results[0];
          console.log("Address = ", relevantResult.formatted_address)
          setAddress(relevantResult.formatted_address);
        } else {
          setError('Unable to retrieve address');
        }
      };
  
  
    

  return (
    <div className="d-flex justify-content-center align-items-center flex-column gap-2">
        <button type='button' onClick={()=>{seInitialLoc({ lat: null, lon: null}); setDistance('Loading...'); setAddress('Loading...'); getLocation()}} className='btn px-4 py-2 border rounded-3' >Get the distance </button>
        {/* <p>{`Initial Location: ${initialLoc.lat? initialLoc.lat : "Loading..."}, ${initialLoc.lon? initialLoc.lon : "Loading..."}`}</p> */}
        {/* {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Address: {address}</p>
      )} */}

      {error?  <p>Error: {error}</p> : ''}

        {/* <button>Get Distance</button> <br /><br />
        <button>Stop Distance finding</button><br /><br /> */}

        <div className="d-flex justify-content-center align-items-center">
          Distance : {distance} meters
        </div>
        {distanceError? <span className='text-danger fw-bold'>{distanceError}</span> : ''}
        

    </div>
  )
}

GetLocationDistance.propTypes = {
  locationLoaded: PropTypes.bool.isRequired,
  setLocationLoaded: PropTypes.func.isRequired,
  setDistance: PropTypes.func.isRequired,
  setAddress: PropTypes.func.isRequired,
  setDistanceError: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
  distance: PropTypes.string.isRequired,
  distanceError: PropTypes.string.isRequired,
};


export default GetLocationDistance;