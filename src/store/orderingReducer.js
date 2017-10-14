import config from "../config/config";

// import function so we can update region from ordering
import { onRegionChange } from "./mapReducer";

/**
 * CONSTANTS USED
 */

export const ORDERING_STEPS = [
  /* Pick up location */
  { id: "from", title: "Pick me up from", action: "Next" },
  /* Drop off location */
  { id: "to", title: "Drop me at", action: "Next" },
  /* Time of ride */
  { id: "time", title: "When?", action: "Next" },
  /* Choose vehicle */
  { id: "vehicle" },
  /* Confirm order */
  { id: "confirmation", action: "Confirm and book" }
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

export function onNextStep() {
  return (dispatch, getState) => {
    // check if prev step is from or to, to recenter map
    const ordering = getState().ordering;
    const region = getState().map.region;

    // check if previous step will be from or to location to recenter map there
    if (ordering.currStepNo < ORDERING_STEPS.length) {
      const nextStepNo = ordering.currStepNo + 1;
      const nextStep = ORDERING_STEPS[nextStepNo];

      // add to address data if next step is destination, and no data is present
      let addToData = {};
      if (nextStep.id === "to" && !("toAddress" in ordering)) {
        addToData = {
          toAddress: ordering.fromAddress,
          toData: ordering.fromData
        };
      }

      // if current step is destination we can zoom in region with from / to in the center
      if (ORDERING_STEPS[ordering.currStepNo].id === "to") {
        // recenter region focusing on pickup and destination
        dispatch(
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
              ) + 0.0175,
            longitudeDelta:
              Math.abs(
                ordering.toData.geometry.location.lng -
                  ordering.fromData.geometry.location.lng
              ) + 0.0175
          })
        );
      }

      // update data to reflect prev step
      dispatch({
        type: UPDATE_ORDERING_DATA,
        payload: { ...addToData, currStepNo: nextStepNo, currStep: nextStep }
      });
    }
  };
}

export function onPrevStep() {
  return (dispatch, getState) => {
    // check if prev step is from or to, to recenter map
    const ordering = getState().ordering;
    const region = getState().map.region;

    // check if previous step will be from or to location to recenter map there
    if (ordering.currStepNo > 0) {
      const prevStepNo = ordering.currStepNo - 1;
      const prevStep = ORDERING_STEPS[prevStepNo];

      // check if we need to recenter the map
      if (prevStep.id === "to") {
        // recenter map to destination
        dispatch(
          onRegionChange({
            latitude: ordering.toData.geometry.location.lat,
            longitude: ordering.toData.geometry.location.lng,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta
          })
        );
      } else if (prevStep.id === "from") {
        // recenter map to pick up location
        dispatch(
          onRegionChange({
            latitude: ordering.fromData.geometry.location.lat,
            longitude: ordering.fromData.geometry.location.lng,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta
          })
        );
      }

      // update data to reflect prev step
      dispatch({
        type: UPDATE_ORDERING_DATA,
        payload: { currStepNo: prevStepNo, currStep: prevStep }
      });
    }
  };
}

export function onUpdateOrderingData(data = {}) {
  return { type: UPDATE_ORDERING_DATA, payload: data };
}

/**
 * REDUCER
 */

const ACTION_HANDLERS = {
  // update from or to address that changed
  [UPDATE_ADDRESS]: (state, action) => {
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
  })
};

const initialState = {
  currStepNo: 0,
  currStep: ORDERING_STEPS[0],
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
  },

  time: "Now"
};

export default function orderingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
