const config = {
  /**
   * API KEYS
   */
  api: {
    openTransport: {
      key: "otpfda798e7403e4ceaaf1431a5dd58007a",
      url: "https://opentransport.com",
      apiPrefix: "/api/beta",
      /* radius API will use to find vehicles */
      searchRadius: 10000,
      refreshInterval: 15000,
      refreshBooking: 5000
    },
    google: {
      urlTextSearch:
        "https://maps.googleapis.com/maps/api/place/textsearch/json",
      urlReverseGeocode: "https://maps.googleapis.com/maps/api/geocode/json",
      key: "AIzaSyAGclthw8FegS6fvqJ0_MHDxQxRidUdqxo",
      location: "start-location",
      radius: 50000
    }
  },
  /**
   * MAP CONFIGURATION
   */
  map: {
    /* Should map initialize with a start location */
    forceStartLocation: true,
    /* Start location for the map, if forceStartLocation is true */
    startLocation: {
      latitude: 51.531,
      longitude: -0.177,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      address: "23e Grove End Rd"
    },
    geolocation: {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    },
    recenterZoom: {
      from: 0.017,
      to: 0.017
    }
  },

  /** ordering steps UI config */
  ordering: {
    /* default height of the ordering panel, only used if there is a problem */
    height: 225,
    // ordering steps, feel free to change titles but DO NOT CHANGE the ids
    steps: [
      /* Drop off location */
      { id: "to", title: "I want to go to", action: "Next", height: 200 },
      /* Pick up location */
      { id: "from", title: "Pick me up from", action: "Next", height: 200 },
      /* Time of ride */
      // { id: "time", title: "When?", action: "Next", height: 200 },
      /* Choose vehicle */
      { id: "vehicleSelect", height: 245 },
      /* Confirm order */
      { id: "confirmation", action: "Confirm and book", height: 410 },
      { id: "traveling", height: 110 }
    ],
    /* this will force first step to be authorization */
    withAuth: true,
    /* remember how many addresses in recent list */
    keepRecent: 40
  },
  /** show version number */
  showVersionNumber: true,
  /**
   * Colors used in the app interface
   */
  colors: {
    primary: "#0076ff",
    secondary: "#000000",
    green: "#44db5e",
    alert: "#ff2851",
    text: "#8e8e93"
  }
};

export default config;
