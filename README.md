# ISS Spotter

**ISS Spotter** retrieves date, time, and duration information for the next 5 flyovers of the International Space Station (ISS) for a user's geographical location via 3 API requests that retrieve:
1. The user's IP address ([ipify.org](https://www.ipify.org/))
2. Geographic coordinates given an IP address (1) ([freegeoip.app](https://freegeoip.app))
3. ISS flyover data given geographic coordinates (2) ([open-notify.org](http://open-notify.org/))

Timezone conversions for the datetime information is estimated by default but a [valid TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) can be specified via a command-line argument (see **usage** below).

## Installation & Usage
1. Clone or download this repository
    ```
    git clone https://github.com/ahhreggi/iss_spotter
    ```
2. In the project directory, install dependencies
    ```
   npm install
    ```
3. Run the app
    ```
    node index2
    ```
    NOTE: ```index1.js``` = callback implementation, ```index2.js``` = promise implementation

    To specify a timezone to use when displaying results, pass a [valid TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) as a command-line argument. For example:
    ```
    node index2 America/Toronto
    ```

    Sample output:
    ```
    Upcoming ISS flyovers for your location:
      - Friday, March 12th, 2021 @ 1:08 am (America/Toronto) for 605 seconds!
      - Friday, March 12th, 2021 @ 2:46 am (America/Toronto) for 617 seconds!
      - Friday, March 12th, 2021 @ 4:23 am (America/Toronto) for 653 seconds!
      - Friday, March 12th, 2021 @ 6:00 am (America/Toronto) for 550 seconds!
      - Friday, March 12th, 2021 @ 9:07 pm (America/Toronto) for 571 seconds!
    ```