// ISS Spotter - Callback Implementation

const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * @param  {function} callback
 *         A callback function to pass back an error or the IP address string.
 * @return {string|null}
 *         A string containing the user's IP address, or null if there is an error.
 */
const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      return callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
    } else {
      callback(null, JSON.parse(body).ip);
    }
  });
};

/**
 * Makes a single API request to retrieve the user's coordinates for the given IP address.
 * @param  {string} ip
 *         An IP address string.
 * @param  {function} callback
 *         A callback function to pass back an error or the coordinates object.
 * @return {{ latitude: Number, longitude: Number }|null}
 *         An object containing the latitude and longitude, or null if there is an error.
 */
const fetchCoordsByIP = function(ip, callback) {
  request("https://freegeoip.app/json/" + ip, (error, response, body) => {
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      return callback(Error(`Status Code ${response.statusCode} when fetching coordinates by IP. Response: ${body.trim()}`), null);
    } else {
      const { latitude, longitude } = JSON.parse(body);
      callback(null, { latitude, longitude });
    }
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS flyover times for the given coordinates.
 * @param  {{ latitude: Number, longitude: Number }} coords
 *         An object containing latitude and longitude values.
 * @param  {function} callback
 *         A callback function to pass back an error or an array of objects containing flyover data.
 * @return {[{ risetime: Number, duration: Number}]|null}
 *         An array of objects containing the risetime and duration of ISS flyovers, or null if there is an error.
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      return callback(Error(`Status Code ${response.statusCode} when flyover data by coordinates. Response: ${body.trim()}`, null));
    } else {
      const { response } = JSON.parse(body);
      callback(null, response);
    }
  });
};

/**
 * Orchestrates multiple API Requests in order to determine the next 5 upcoming ISS flyovers for the user's current location.
 * @param  {function} callback
 *         A callback function to pass back an error or an array of objects containing flyover data.
 * @return {[{ risetime: Number, duration: Number}]|null}
 *         An array of objects containing the risetime and duration of ISS flyovers, or null if there is an error.
 */
const nextISSTimesForMyLocation = function(callback) {
  // Retrieve the user's IP address via API request
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    } else {
      // Retrieve geographic coordinates for the user's IP address via API request
      fetchCoordsByIP(ip, (error, coordinates) => {
        if (error) {
          return callback(error, null);
        } else {
          // Retrieve ISS flyover data for the user's geographic coordinates via API request
          fetchISSFlyOverTimes(coordinates, (error, data) => {
            if (error) {
              return callback(error, null);
            } else {
              callback(null, data);
            }
          });
        }
      });
    }
  });
};

module.exports = { nextISSTimesForMyLocation };