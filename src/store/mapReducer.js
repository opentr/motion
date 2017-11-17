import config from "../config/config";
import { REHYDRATE } from "redux-persist/constants";
/**
 * ACTION TYPES
 */
export const UPDATE_MAP_DATA = "UPDATE_MAP_DATA";
export const UPDATE_REGION = "UPDATE_REGION";
export const UPDATE_ACTION = "UPDATE_ACTION";
export const UPDATE_ADDRESS = "UPDATE_ADDRESS";

import { regionDifferent } from "../utils/numbers";

import { PermissionsAndroid, Platform } from "react-native";

/**
 * ACTIONS
 */

/**
 * ask user for location permission 
 */
export function onAskForLocationPermission() {
  return dispatch => {
    if (Platform.OS === "ios") {
      dispatch({
        type: UPDATE_MAP_DATA,
        payload: { locationPermission: true }
      });
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permission to access your location ",
          message:
            "We need this permission so you could easier choose your ride pick up and destination"
        }
      )
        .then(granted => {
          if (
            granted === PermissionsAndroid.RESULTS.GRANTED ||
            granted === true
          ) {
            console.log("GRANTED PERMISSION");
            dispatch({
              type: UPDATE_MAP_DATA,
              payload: { locationPermission: true }
            });
          }
        })
        .catch(error => {
          console.log("ERROR ", error);
        });
    }
  };
}

export function onRegionChange(region) {
  // dispatch map update with region data

  return (dispatch, getState) => {
    const regionState = getState().map.region;
    if (regionDifferent(regionState, region))
      dispatch({ type: UPDATE_REGION, payload: region });
  };
}

export function onMapAction(action) {
  // dispatch map update with region data
  return { type: UPDATE_ACTION, payload: action };
}

/**
 * Async action to determine reverse geocoded location from the map
 */

export function reverseGeocodeLocation() {
  return (dispatch, getState) => {
    const region = getState().map.region;
    const lastGeocodedRegion = getState().map.lastGeocodedRegion || false;

    if (
      lastGeocodedRegion &&
      !regionDifferent(region, lastGeocodedRegion, 0.00001)
    ) {
      return false;
    }

    dispatch({
      type: UPDATE_MAP_DATA,
      payload: { loadingGeocoding: true, lastGeocodedRegion: region }
    });

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
        error => {
          console.error("An error occured.", error);
          dispatch({
            type: UPDATE_ADDRESS,
            payload: { formatted_address: false }
          });
        }
      )
      .then(json => {
        console.log("map search", json);

        dispatch({
          type: UPDATE_MAP_DATA,
          payload: { loadingGeocoding: false }
        });

        if (json.status === "OK" && json.results && json.results.length > 0) {
          // dispatch address update that will be picked up by Ordering reducer
          dispatch({ type: UPDATE_ADDRESS, payload: json.results[0] });
        } else {
          dispatch({
            type: UPDATE_ADDRESS,
            payload: { formatted_address: "" }
          });
          // console.error("no results geocode", json);
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
  }),
  [UPDATE_REGION]: (state, action) => ({
    ...state,
    region: action.payload
  }),
  [UPDATE_ACTION]: (state, action) => ({
    ...state,
    action: action.payload
  }),
  [REHYDRATE]: (state, action) => ({
    ...state
  })
};

const initialState = {
  region: {
    latitude: config.map.startLocation.latitude,
    longitude: config.map.startLocation.longitude,
    latitudeDelta: config.map.startLocation.latitudeDelta,
    longitudeDelta: config.map.startLocation.longitudeDelta
  },
  action: {}
};

export default function mapReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
