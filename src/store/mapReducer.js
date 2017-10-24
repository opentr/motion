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
        // console.log("map search", json);

        if (json.results) {
          // dispatch address update that will be picked up by Ordering reducer
          dispatch({ type: UPDATE_ADDRESS, payload: json.results[0] });
        }
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
  }
};

export default function mapReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
