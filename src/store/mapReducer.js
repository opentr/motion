import config from "../config/config";

/**
 * ACTION TYPES
 */
export const UPDATE_MAP_DATA = "UPDATE_MAP_DATA";
export const UPDATE_ADDRESS = "UPDATE_ADDRESS";

/**
 * ACTIONS
 */

export function onRegionChange(region) {
  // dispatch map update with region data
  return { type: UPDATE_MAP_DATA, payload: { region: region } };
}

/**
 * Async action to determine reverse geocoded location from the map
 */
export function reverseGeocodeLocation() {
  return (dispatch, getState) => {
    const region = getState().map.region;

    const url =
      config.api.google.urlReverseGeocode +
      ("?latlng=" + region.latitude + "," + region.longitude) +
      ("&key=" + config.api.google.key);

    console.log("reverse geocode ", url);
    // fetch data from API
    fetch(url, {
      method: "get"
    })
      .then(
        response => response.json(),
        error => console.log("An error occured.", error)
      )
      .then(json => {
        console.log("map search", json);

        if (json.results) {
          // dispatch address update that will be picked up by Ordering reducer
          dispatch({ type: UPDATE_ADDRESS, payload: json.results[0] });
        }
      });
  };
}

/**
 * load vehicles list from API for the region we are in
 */
export function onLoadVehicles() {
  console.log("load vehicles");
  return (dispatch, getState) => {
    // get current region
    const region = getState().map.region;

    // calculate radius based on map region data
    // formula is - delta * 111 = radius in miles
    // we multiply by 1.60936 to get kilometers
    // and multiply by 1000 to get meters
    const radius = Math.round(region.latitudeDelta * 111 * 1.60934 * 1000);

    // fetch data from API
    fetch(
      config.api.openTransport.url +
        config.api.openTransport.apiPrefix +
        "/vehicles?radius=" +
        radius +
        "&position=" +
        region.latitude +
        "," +
        region.longitude,
      {
        method: "get",
        headers: {
          Authorization: "Bearer " + config.api.openTransport.key
        }
      }
    )
      .then(
        response => response.json(),
        error => console.log("An error occured.", error)
      )
      .then(json => {
        console.log("vehicles", json);

        // get vehicles from returned JSON
        const responseVehicles = json.vehicles || [];

        // dispatch map update with vehicles update
        dispatch({
          type: UPDATE_MAP_DATA,
          payload: { vehicles: responseVehicles }
        });
      });
  };
}

/**
 * REDUCER
 */

const ACTION_HANDLERS = {
  [UPDATE_MAP_DATA]: (state, action) => ({
    ...state,
    ...action.payload
  })
};

const initialState = {
  region: {
    latitude: config.map.startLocation.latitude,
    longitude: config.map.startLocation.longitude,
    latitudeDelta: config.map.startLocation.latitudeDelta,
    longitudeDelta: config.map.startLocation.longitudeDelta
  },
  vehicles: []
};

export default function mapReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
