import config from "../config/config";
import { REHYDRATE } from "redux-persist/constants";

const Polyline = require("@mapbox/polyline");

// import function so we can update region from ordering
import { onRegionChange } from "./mapReducer";

import { findWithAttr } from "../utils/search";

/**
 * CONSTANTS USED
 */

// ordering steps, feel free to change titles but DO NOT CHANGE the ids
export const ORDERING_STEPS = [
  /* Drop off location */
  { id: "to", title: "Drop me at", action: "Next" },
  /* Pick up location */
  { id: "from", title: "Pick me up from", action: "Next" },
  /* Time of ride */
  { id: "time", title: "When?", action: "Next" },
  /* Choose vehicle */
  { id: "vehicleSelect" },
  /* Confirm order */
  { id: "confirmation", action: "Confirm and book" },
  { id: "traveling" }
];

/**
 * ACTION TYPES
 */
// update ordering state data
export const UPDATE_ORDERING_DATA = "UPDATE_ORDERING_DATA";
// update from or to address, this action reducer is dispatch by map reducer
export const UPDATE_ADDRESS = "UPDATE_ADDRESS";

/**
 * ACTIONS
 */

/** simple action to update ordering data */
export function onUpdateOrderingData(data = {}) {
  return { type: UPDATE_ORDERING_DATA, payload: data };
}

function radiusToMeters(value) {
  return Math.round(value * 111 * 1.60934 * 1000);
}

function metersToRadius(value) {
  return Math.round(value / (111 * 1.60934 * 1000));
}

/**
 * load vehicles list from API for the region we are in, this only displays vehicles on the map
 */
export function onLoadVehicles() {
  // vehicle format

  console.log("load vehicles");
  return (dispatch, getState) => {
    // get current region
    const region = getState().map.region;
    // get ordering info
    const ordering = getState().ordering;

    // calculate radius based on map region data
    // formula is - delta * 111 = radius in miles
    // we multiply by 1.60936 to get kilometers
    // and multiply by 1000 to get meters
    const radius = radiusToMeters(region.latitudeDelta);

    // fetch data from API
    let url =
      ordering.currStep.id === "traveling222"
        ? config.api.openTransport.url +
          config.api.openTransport.apiPrefix +
          "/vehicles/" +
          ordering.selectedVehicle.id
        : config.api.openTransport.url +
          config.api.openTransport.apiPrefix +
          "/vehicles?radius=" +
          radius +
          "&position=" +
          region.latitude +
          "," +
          region.longitude;

    fetch(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + config.api.openTransport.key
      }
    })
      .then(
        response => response.json(),
        error => console.log("An error occured.", error)
      )
      .then(json => {
        console.log("vehicles", json);

        // get vehicles from returned JSON
        const responseVehicles =
          json.vehicles || (json.vehicle && [json.vehicle]) || [];

        // dispatch map update with vehicles update
        dispatch({
          type: UPDATE_ORDERING_DATA,
          payload: { vehicles: responseVehicles }
        });
      });
  };
}

/**
 * Contextually recenters the map based on the step in ordering process
 * @param {*String} stepId 
 */
export function onRecenterMap(stepId) {
  console.log("on recenter map now", stepId);
  return (dispatch, getState) => {
    const ordering = getState().ordering;

    if (stepId.constructor !== String) stepId = ordering.currStep.id;

    const region = Object.assign({}, getState().map.region);

    // console.log(
    //   "recenter now ",
    //   "stepId",
    //   stepId,
    //   "arguments",
    //   arguments,
    //   "ordering",
    //   ordering,
    //   "region",
    //   region,
    //   "ordering.toFirst",
    //   ordering.toFirst,
    //   metersToRadius(1000)
    // );

    if (stepId === "to" && ordering.toData) {
      return dispatch(
        onRegionChange({
          ...region,
          latitudeDelta: config.map.recenterZoom.to, //region.latitudeDelta,
          longitudeDelta: config.map.recenterZoom.to //region.longitudeDelta
        })
      );
    } else if (stepId === "from" && ordering.fromData) {
      return dispatch(
        onRegionChange({
          ...region,
          latitudeDelta: config.map.recenterZoom.from,
          longitudeDelta: config.map.recenterZoom.from
        })
      );
    } else if (ordering.toData && ordering.fromData) {
      // recenter region focusing on pickup and destination
      return dispatch(
        onRegionChange({
          latitude:
            (ordering.fromData.geometry.location.lat +
              ordering.toData.geometry.location.lat) /
            2,
          longitude:
            (ordering.fromData.geometry.location.lng +
              ordering.toData.geometry.location.lng) /
            2,
          latitudeDelta:
            Math.abs(
              ordering.toData.geometry.location.lat -
                ordering.fromData.geometry.location.lat
            ) * 1.3,
          longitudeDelta:
            Math.abs(
              ordering.toData.geometry.location.lng -
                ordering.fromData.geometry.location.lng
            ) * 1.3
        })
      );
    }
  };
}

/** handles click on the next step */
export function onNextStep() {
  return (dispatch, getState) => {
    // check if prev step is from or to, to recenter map
    const ordering = Object.assign({}, getState().ordering);
    const region = Object.assign({}, getState().map.region);

    // check if previous step will be from or to location to recenter map there
    if (ordering.currStepNo < ORDERING_STEPS.length) {
      const nextStepNo = ordering.currStepNo + 1;
      const nextStep = ORDERING_STEPS[nextStepNo];

      // add to address data if next step is destination, and no data is present
      let addToData = {};
      if (!ordering.toFirst && nextStepNo === ordering.toStepNo) {
        addToData = {
          toAddress: ordering.fromAddress,
          toData: ordering.fromData
        };
      }

      if (ordering.toFirst && nextStepNo === ordering.fromStepNo) {
        addToData = {
          fromAddress: ordering.toAddress,
          fromData: ordering.toData
        };
      }

      // reset data about available vehicles, not to diplsay vehicles for last ordering location
      if (nextStep.id === "vehicleSelect") {
        addToData.availableVehicles = [];
      } else if (nextStep.id === "time") {
        dispatch(getRoute());
        addToData.route = [];
      }

      // update data to reflect prev step
      dispatch({
        type: UPDATE_ORDERING_DATA,
        payload: { ...addToData, currStepNo: nextStepNo, currStep: nextStep }
      });

      // if this is second step in pickup/destination ordering steps
      //  zoom in region with from / to in the center
      if (
        (!ordering.toFirst &&
          ORDERING_STEPS[ordering.currStepNo].id === "to") ||
        (ordering.toFirst && ORDERING_STEPS[ordering.currStepNo].id === "from")
      ) {
        dispatch(onRecenterMap("route"));
      }
    }
  };
}

/** handles click on the prev step */
export function onPrevStep() {
  return (dispatch, getState) => {
    // check if prev step is from or to, to recenter map
    const ordering = getState().ordering;
    const region = getState().map.region;

    // check if previous step will be from or to location to recenter map there
    if (ordering.currStepNo > 0) {
      const prevStepNo = ordering.currStepNo - 1;
      const prevStep = ORDERING_STEPS[prevStepNo];

      let addToData = {};

      // check if we need to recenter the map
      if (prevStep.id === "to") {
        addToData.route = [];
        // recenter map to destination
        dispatch(onRecenterMap("to"));
      } else if (prevStep.id === "from") {
        addToData.route = [];
        // recenter map to pick up location
        dispatch(onRecenterMap("from"));
      } else if (prevStep.id === "vehicleSelect") {
        // reset data about available vehicles, not to diplsay vehicles for last ordering location
        addToData = {
          availableVehicles: []
        };
      }

      // update data to reflect prev step
      dispatch({
        type: UPDATE_ORDERING_DATA,
        payload: { ...addToData, currStepNo: prevStepNo, currStep: prevStep }
      });
    }
  };
}

/**
 * get directions between pickup and destination
 */
export function getRoute() {
  return (dispatch, getState) => {
    // get starting point data from state

    const fromData = getState().ordering.fromData;
    const toData = getState().ordering.toData;

    if (!fromData || !toData) {
      return false;
    }

    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${fromData
        .geometry.location.lat},${fromData.geometry.location
        .lng}&destination=${toData.geometry.location.lat},${toData.geometry
        .location.lng}`
    )
      .then(
        response => response.json(),
        error =>
          console.log("An error occured loading search vehicle results.", error)
      )
      .then(json => {
        console.log("route json", json);
        if (!("routes" in json)) return false;

        try {
          let points = Polyline.decode(json.routes[0].overview_polyline.points);
          let coords = points.map((point, index) => {
            return {
              latitude: point[0],
              longitude: point[1]
            };
          });

          // dispatch map update with vehicles update
          dispatch({
            type: UPDATE_ORDERING_DATA,
            payload: {
              route: coords
            }
          });
        } catch (error) {
          console.log(error);
        }
      });
  };
}
/**
 * search for vehicles that are close to our from address, so we can display results
 */
export function onSearchForVehicle() {
  return (dispatch, getState) => {
    // get starting point data from state

    const fromData = getState().ordering.fromData;

    if (!fromData) {
      return false;
    }

    // get search radius from config
    const radius = config.api.openTransport.searchRadius;

    // url for API
    const url =
      config.api.openTransport.url +
      config.api.openTransport.apiPrefix +
      "/vehicles?radius=" +
      radius +
      "&position=" +
      fromData.geometry.location.lat +
      "," +
      fromData.geometry.location.lng;

    console.log("fetch search results ", url);

    fetch(url, {
      method: "get",
      headers: {
        Authorization: "Bearer " + config.api.openTransport.key
      }
    })
      .then(
        response => response.json(),
        error =>
          console.log("An error occured loading search vehicle results.", error)
      )
      .then(json => {
        console.log("search vehicles", json);

        // get vehicles from returned JSON
        const responseVehicles = json.vehicles || [];

        // dispatch map update with vehicles update
        dispatch({
          type: UPDATE_ORDERING_DATA,
          payload: {
            availableVehicles: responseVehicles
          }
        });

        // // dispatch map update with vehicles update
        // dispatch({
        //   type: UPDATE_ORDERING_DATA,
        //   payload: {
        //     availableVehicles: responseVehicles.filter(
        //       v => v.status === "available"
        //     )
        //   }
        // });
      });
  };
}

/** 
 * handles selecting a vehicle for booking 
 */
export function onSelectVehicle(index) {
  return (dispatch, getState) => {
    // set selected vehicle

    const ordering = getState().ordering;

    console.log("select vehicle", ordering, index);

    dispatch({
      type: UPDATE_ORDERING_DATA,
      payload: {
        selectedVehicle: ordering.availableVehicles[index]
      }
    });

    // go to next step
    dispatch(onNextStep());
  };
}

/**
 * action when user confirms booking and 
 */
export function onConfirmBooking() {
  return dispatch => {
    dispatch(onNextStep());
  };
}

/**
 * REDUCER
 */

const ACTION_HANDLERS = {
  // update from or to address that changed
  [UPDATE_ADDRESS]: (state, action) => {
    // console.log("UPDATE ADDRESS ");
    if (state.currStep.id === "from") {
      // return updated from address on map move
      return {
        ...state,
        fromAddress: action.payload.formatted_address,
        fromData: action.payload
      };
    } else if (state.currStep.id === "to") {
      // return updated to address on map move
      return {
        ...state,
        toAddress: action.payload.formatted_address,
        toData: action.payload
      };
    }
    // not from or to steps, return state
    return state;
  },

  /* updating ordering state data with payload values */
  [UPDATE_ORDERING_DATA]: (state, action) => ({
    ...state,
    ...action.payload
  }),

  /* make sure some data on reload of the app are not  in loaded from local storage */
  [REHYDRATE]: (state, action) => {
    const incoming = action.payload.ordering;
    if (incoming) {
      return { ...state, ...incoming, availableVehicles: [] };
    }
    return state;
  }
};

// is pickup step before destination step
const fromStepNo = findWithAttr(ORDERING_STEPS, "id", "from");
const toStepNo = findWithAttr(ORDERING_STEPS, "id", "to");
const timeStepNo = findWithAttr(ORDERING_STEPS, "id", "time");
const vehicleSelectStepNo = findWithAttr(ORDERING_STEPS, "id", "vehicleSelect");
const confirmationStepNo = findWithAttr(ORDERING_STEPS, "id", "confirmation");
console.log("from to", fromStepNo, toStepNo);
// variable to store initial address information for first step on the map
// fromStepNo stores step
let initialAddressState = {
  fromStepNo: fromStepNo,
  toStepNo: toStepNo,
  timeStepNo: timeStepNo,
  vehicleSelectStepNo: vehicleSelectStepNo,
  confirmationStepNo: confirmationStepNo
};
// if we start with pickup then we need to initialize fromAddress and fromData
if (fromStepNo < toStepNo) {
  initialAddressState = {
    ...initialAddressState,
    toFirst: false,
    fromAddress: config.map.forceStartLocation
      ? config.map.startLocation.address
      : "Type in address",
    fromData: {
      geometry: {
        location: {
          lat: config.map.startLocation.latitude,
          lng: config.map.startLocation.longitude
        }
      }
    }
  };
} else {
  initialAddressState = {
    ...initialAddressState,
    toFirst: true,
    toAddress: config.map.forceStartLocation
      ? config.map.startLocation.address
      : "Type in address",
    toData: {
      geometry: {
        location: {
          lat: config.map.startLocation.latitude,
          lng: config.map.startLocation.longitude
        }
      }
    }
  };
}

// initial values for reducer
const initialState = {
  currStepNo: 0,
  currStep: ORDERING_STEPS[0],
  /* vehicles displated on the map */
  vehicles: [],
  /* vehicles returned from search when ordering, avialable for booking */
  availableVehicles: [],
  route: [],
  selectedVehicle: {},
  time: "Now",
  ...initialAddressState
};

export default function orderingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
