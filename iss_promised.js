// ISS Spotter - Promise Implementation

const request = require('request-promise-native');

/**
 * Makes a single API request to retrieve the user's IP address.
 * @return {object}
 *         Request object.
 */
const fetchMyIP = function() {
  return request("https://api.ipify.org?format=json");
};

/**
 * Makes a single API request to retrieve the user's coordinates for the given IP address.
 * @param  {string} body
 *         A JSON string containing an IP address.
 * @return {object}
 *         An object received in response to the API request.
 */
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ip}`);
};

/**
 * Makes a single API request to retrieve upcoming ISS flyover times for the given coordinates.
 * @param  {string} body
 *         A JSON string containing values for latitude and longitude.
 * @return {object}
 *         An object received in response to the API request.
 */
const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`);
};

/**
 * Orchestrates multiple API Requests in order to determine the next 5 upcoming ISS flyovers for the user's current location.
 * @return {Promise.<[{ risetime: Number, duration: Number}]>}
 *         Promise object containing an array of objects containing the risetime and duration of ISS flyovers or an error.
 */
const nextISSTimesForMyLocation = function() {
  return fetchMyIP() // Retrieve IP
    .then(fetchCoordsByIP) // Retrieve geo coordinates using IP
    .then(fetchISSFlyOverTimes) // Retrieve flyover details using geo coordinates
    .then(data => { // Return parsed data
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };