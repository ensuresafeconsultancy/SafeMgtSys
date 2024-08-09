const moment = require('moment-timezone');

const getCurrentDateTime = () => {
    const timeZone = process.env.TIMEZONE || 'UTC'; // Default to UTC if TIMEZONE is not set
    const dateAndTime = moment().tz(timeZone);
    const currentDate = dateAndTime.format('DD/MM/YYYY');
    const currentTime = dateAndTime.format('hh:mm:ss a');
    return { currentDate, currentTime };
};


module.exports = { getCurrentDateTime };