export const convertMinutesToHMS = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m`;
  };

export const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight and handle noon.
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
};
