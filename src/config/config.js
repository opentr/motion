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
      refreshInterval: 5000
    },
    google: {
      url: "https://maps.googleapis.com/maps/api/place/textsearch/json",
      key: "AIzaSyCmYvf5VBGELkRiZSp4Ef0LVeRBUfcm9jg"
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
    }
  },
  /** ordering steps UI config */
  ordering: {
    height: 0.4 // height 40%
  },
  /**
   * Colors used in the app interface
   */
  colors: {
    primary: "#0076ff",
    secondary: "#44db5e",
    text: "#8e8e93"
  }
};

export default config;
