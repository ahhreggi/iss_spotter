const { nextISSTimesForMyLocation } = require('./iss');
const moment = require('moment-timezone');
let userTimezone = process.argv[2] || moment.tz.guess(); // moment.tz.guess() may be inaccurate!

/**
 * Prints ISS flyover data in a human-readable format.
 * @param  {[{risetime: Number, duration: Number}]} passTimes
 *         An array of objects containing the risetime and duration of ISS flyovers.
 */
const printPassTimes = function(passTimes, timezone) {
  // If the specified timezone is invalid, use default
  if (!moment.tz.zone(timezone)) {
    timezone = moment.tz.guess();
    console.log(`Specified timezone is invalid. Reverted to default: ${timezone}`);
  }
  // Print details
  console.log(`Upcoming ISS flyovers for your location:`);
  for (const pass of passTimes) {
    // MomentJS: Convert the given unix time stamp (pass.risetime) and format for the specified timezone
    const date = moment.unix(pass.risetime).tz(timezone).format('dddd, MMMM Do YYYY @ h:mm a');
    console.log(`  - ${date} (${timezone}) for ${pass.duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log('[ERROR]:', error.message);
  } else {
    printPassTimes(passTimes, userTimezone);
  }
});