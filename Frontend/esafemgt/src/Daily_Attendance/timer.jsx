import{ useState, useEffect } from 'react';
import PropTypes from 'prop-types';
const Timer = ({ startTime })=>{
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime); // Convert startTime to a Date object
      const difference = now - start;
      const seconds = Math.floor(difference / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds - hours * 3600) / 60);
      const secondsLeft = seconds - hours * 3600 - minutes * 60;
      setTimer(`${hours}hrs : ${minutes}min : ${secondsLeft}sec`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime]);

  return (
    <div>{timer}</div>
  );
}

Timer.propTypes = {
    startTime : PropTypes.string.isRequired,
}

export default Timer;
