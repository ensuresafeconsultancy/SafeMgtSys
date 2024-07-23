export const convertMinutesToHMS = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m`;
  };
