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
    height: 225
  },
  /** show version number */
  showVersionNumber: true,
  /**
   * Colors used in the app interface
   */
  colors: {
    primary: "#0076ff",
    secondary: "#44db5e",
    alert: "#ff2851",
    text: "#8e8e93"
  }
};

export default config;
