import config from "../config/config";
import { REHYDRATE } from "redux-persist/constants";
import { Platform, PixelRatio } from "react-native";

const Polyline = require("@mapbox/polyline");

// import function so we can update region from ordering
import { onRegionChange, onMapAction } from "./mapReducer";

import { findWithAttr } from "../utils/search";

/**
 * CONSTANTS USED
 */

const orderingSteps = [
  /* Drop off location */
  { id: "to", title: "Drop me at", action: "Next", height: 220 },
  /* Pick up location */
  { id: "from", title: "Pick me up from", action: "Next", height: 220 },
  /* Time of ride */
  { id: "time", title: "When?", action: "Next", height: 220 },
  /* Choose vehicle */
  { id: "vehicleSelect", height: 280 },
  /* Confirm order */
  { id: "confirmation", action: "Confirm and book", height: 410 },
  { id: "traveling", height: 110 }
];
// ordering steps, feel free to change titles but DO NOT CHANGE the ids
export const ORDERING_STEPS = config.ordering.withAuth
  ? [
      { id: "loginStart", title: "", action: "Login", height: 110 },
      { id: "loginButtons", title: "", action: "Login", height: 160 }
    ].concat(orderingSteps)
  : orderingSteps;

//console.log("ORDERING STEPS ", ORDERING_STEPS);
// is pickup step before destination step
const fromStepNo = findWithAttr(ORDERING_STEPS, "id", "from");
const toStepNo = findWithAttr(ORDERING_STEPS, "id", "to");
const timeStepNo = findWithAttr(ORDERING_STEPS, "id", "time");
const vehicleSelectStepNo = findWithAttr(ORDERING_STEPS, "id", "vehicleSelect");
const confirmationStepNo = findWithAttr(ORDERING_STEPS, "id", "confirmation");

/**
 * ACTION TYPES
 */
// update ordering state data
export const UPDATE_ORDERING_DATA = "UPDATE_ORDERING_DATA";
// update from or to address, this action reducer is dispatch by map reducer
export const UPDATE_ADDRESS = "UPDATE_ADDRESS";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOG_OUT = "LOG_OUT";

/**
 * ACTIONS
 */

/** action that handles sidebar open / close, and is used to hide and reveal ordeing panel */
export function onSideBar(sidebarOpen = true) {
  return { type: UPDATE_ORDERING_DATA, payload: { hidePanel: !sidebarOpen } };
}

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
 * RESET APP
 */
export function onResetApp() {
  return {
    type: UPDATE_ORDERING_DATA,
    payload: {
      currStepNo: 0,
      currStep: ORDERING_STEPS[0],
      selectedVehicle: {},
      route: [],
      routeLength: undefined,
      booking: {}
    }
  };
}

/**
 * LOAD POSSIBLE STATUSES FOR THE BOOKING
 */
export function onLoadBookingStatuses() {
  return (dispatch, getState) => {
    fetch(
      config.api.openTransport.url +
        config.api.openTransport.apiPrefix +
        "/booking-statuses",
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
        if (json.booking_statuses) {
          dispatch({
            type: UPDATE_ORDERING_DATA,
            payload: { BOOKING_STATUSES: json.booking_statuses }
          });
        }
      });
  };
}

/**
 * CREATE A BOOKING 
 */
export function onCreateBooking() {
  return (dispatch, getState) => {
    const ordering = getState().ordering;

    // set pending status immediately
    dispatch({
      type: UPDATE_ORDERING_DATA,
      payload: { booking: { status: "pending" } }
    });

    fetch(
      config.api.openTransport.url +
        config.api.openTransport.apiPrefix +
        "/vehicles/" +
        ordering.selectedVehicle.id +
        "/bookings",
      {
        method: "post",
        headers: {
          Authorization: "Bearer " + config.api.openTransport.key
        },
        body: JSON.stringify({
          customer_name: "John Smith",
          customer_phone_number: "+44 1623 661787",
          from_position: ordering.fromData.geometry.location,
          to_position: ordering.toData.geometry.location
        })
      }
    )
      .then(
        response => response.json(),
        error => console.log("create booking - An error occured.", error)
      )
      .then(json => {
        //console.log("create booking ", json);
        if (json.booking_id) {
          // save booking info in state
          json.id = json.booking_id;
          dispatch({
            type: UPDATE_ORDERING_DATA,
            payload: { booking: json }
          });
        }
      });
  };
}

/** GET UPDATED BOOKING INFO */
export function getBookingUpdate() {
  return (dispatch, getState) => {
    //console.log("get booking update");

    const bookingId = getState().ordering.booking.booking_id;

    fetch(
      config.api.openTransport.url +
        config.api.openTransport.apiPrefix +
        "/bookings/" +
        bookingId,
      {
        method: "get",
        headers: {
          Authorization: "Bearer " + config.api.openTransport.key
        }
      }
    )
      .then(
        response => response.json(),
        error => console.log("get booking - An error occured.", error)
      )
      .then(json => {
        //console.log("get booking ", json);

        const booking = getState().ordering.booking;
        if (
          json.booking &&
          booking.id === json.booking.id &&
          booking.status !== json.booking.status
        ) {
          // save booking info in state
          dispatch({
            type: UPDATE_ORDERING_DATA,
            payload: {
              booking: {
                ...getState().ordering.booking,
                ...json.booking
              }
            }
          });

          dispatch(onRecenterMap());
        }
      });
  };
}

/**
 * LOAD VEHICLES LIST FROM API 
 * WHEN NOT IN BOOKING - FOR THE REGION WE ARE IN 
 * WHEN IN BOOKING - LOADING ONLY ONE VEHICLE THAT IS BOOKED
 */
export function onLoadVehicles() {
  // vehicle format

  //console.log("load vehicles");
  return (dispatch, getState) => {
    const user = getState().user;
    if (user && user.loggedIn && user.loadingInProgress) {
      // skip updating if user is logging in
      return false;
    }
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
      ordering.currStep.id === "traveling"
        ? config.api.openTransport.url +
          config.api.openTransport.apiPrefix +
          "/vehicles/" +
          ordering.selectedVehicle.id +
          "/status"
        : config.api.openTransport.url +
          config.api.openTransport.apiPrefix +
          "/vehicles?radius=" +
          radius +
          "&position=" +
          region.latitude +
          "," +
          region.longitude;

    //console.log("vehicle update URL ", url);

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
          json.vehicles && json.vehicles.constructor === Array
            ? json.vehicles
            : json.id ? [json] : [];

        // dispatch map update with vehicles update
        dispatch({
          type: UPDATE_ORDERING_DATA,
          payload: { vehicles: responseVehicles }
        });

        if (getState().ordering.currStep.id === "traveling") {
          // keep updating the map on vehicle moving
          dispatch({
            type: UPDATE_ORDERING_DATA,
            payload: { selectedVehicle: responseVehicles[0] }
          });

          if ("booking" in getState().ordering) {
            const status = getState().ordering.booking.status;
            if (
              !(
                status === "declined" ||
                (status === "completed" ||
                  status === "cancelled_by_supplier" ||
                  status === "cancelled_by_user")
              )
            ) {
              dispatch(
                onGetVehicleTime(
                  responseVehicles[0].id,
                  responseVehicles[0].position
                )
              );
              dispatch(onRecenterMap());
            }
          }
        }
      });
  };
}

/**
 * Contextually recenters the map based on the step in ordering process
 * @param {*String} stepId 
 */
export function onRecenterMap(stepId) {
  //console.log("on recenter map now", stepId);
  return (dispatch, getState) => {
    const ordering = Object.assign({}, getState().ordering);

    if (typeof stepId !== "string") stepId = ordering.currStep.id;

    const region = Object.assign({}, getState().map.region);

    const pixelRatio = Platform.OS === "ios" ? 1 : PixelRatio.get();

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

    if (
      (stepId.indexOf("login") !== -1 || stepId === "to") &&
      ordering.toData
    ) {
      return dispatch(
        onRegionChange({
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: config.map.recenterZoom.to, //region.latitudeDelta,
          longitudeDelta: config.map.recenterZoom.to //region.longitudeDelta
        })
      );
    } else if (stepId === "toPrev" && ordering.toData) {
      return dispatch(
        onRegionChange({
          latitude: ordering.toData.geometry.location.lat,
          longitude: ordering.toData.geometry.location.lng,
          latitudeDelta: config.map.recenterZoom.to, //region.latitudeDelta,
          longitudeDelta: config.map.recenterZoom.to //region.longitudeDelta
        })
      );
    } else if (
      (stepId.indexOf("login") !== -1 || stepId === "from") &&
      ordering.fromData
    ) {
      dispatch(
        onRegionChange({
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: config.map.recenterZoom.from,
          longitudeDelta: config.map.recenterZoom.from
        })
      );
    } else if (stepId === "fromPrev" && ordering.fromData) {
      return dispatch(
        onRegionChange({
          latitude: ordering.fromData.geometry.location.lat,
          longitude: ordering.fromData.geometry.location.lng,
          latitudeDelta: config.map.recenterZoom.to, //region.latitudeDelta,
          longitudeDelta: config.map.recenterZoom.to //region.longitudeDelta
        })
      );
    } else if (stepId === "traveling") {
      console.log("debug now2 ", "selectedVehicle" in ordering, ordering);
      if (
        "selectedVehicle" in ordering &&
        "position" in ordering.selectedVehicle
      ) {
        // console.log("debug now2 ", "selectedVehicle" in ordering, ordering);

        return dispatch(
          onMapAction({
            action: "fitToCoordinates",
            coordinates: [
              {
                latitude: ordering.fromData.geometry.location.lat,
                longitude: ordering.fromData.geometry.location.lng
              },
              {
                latitude: ordering.selectedVehicle.position.lat,
                longitude: ordering.selectedVehicle.position.lng
              }
            ],
            options: {
              edgePadding: {
                top: Math.round(pixelRatio * 85),
                left: Math.round(pixelRatio * 85),
                right: Math.round(pixelRatio * 85),
                bottom: Math.round(pixelRatio * 50)
              },
              animated: true
            }
          })
        );
        // return dispatch(
        //   onRegionChange({
        //     latitude:
        //       (ordering.fromData.geometry.location.lat +
        //         ordering.selectedVehicle.position.lat) /
        //       2,
        //     longitude:
        //       (ordering.fromData.geometry.location.lng +
        //         ordering.selectedVehicle.position.lng) /
        //       2,
        //     latitudeDelta: Math.max(
        //       0.005,
        //       Math.abs(
        //         ordering.fromData.geometry.location.lat -
        //           ordering.selectedVehicle.position.lat
        //       ) * 1.5
        //     ),
        //     longitudeDelta: Math.max(
        //       0.005,
        //       Math.abs(
        //         ordering.fromData.geometry.location.lng -
        //           ordering.selectedVehicle.position.lng
        //       ) * 1.5
        //     )
        //   })
        // );
      }
    } else if (ordering.toData && ordering.fromData) {
      // recenter region focusing on pickup and destination
      // return dispatch(
      // onRegionChange({
      //   latitude:
      //     (ordering.fromData.geometry.location.lat +
      //       ordering.toData.geometry.location.lat) /
      //     2,
      //   longitude:
      //     (ordering.fromData.geometry.location.lng +
      //       ordering.toData.geometry.location.lng) /
      //     2,
      //   latitudeDelta: Math.max(
      //     0.005,
      //     Math.abs(
      //       ordering.toData.geometry.location.lat -
      //         ordering.fromData.geometry.location.lat
      //     ) * 2.2
      //   ),
      //   longitudeDelta: Math.max(
      //     0.005,
      //     Math.abs(
      //       ordering.toData.geometry.location.lng -
      //         ordering.fromData.geometry.location.lng
      //     ) * 2.2
      //   )
      // })
      return dispatch(
        onMapAction({
          action: "fitToCoordinates",
          coordinates: [
            {
              latitude: ordering.fromData.geometry.location.lat,
              longitude: ordering.fromData.geometry.location.lng
            },
            {
              latitude: ordering.toData.geometry.location.lat,
              longitude: ordering.toData.geometry.location.lng
            }
          ],
          options: {
            edgePadding: {
              top: Math.round(pixelRatio * 85),
              left: Math.round(pixelRatio * 85),
              right: Math.round(pixelRatio * 85),
              bottom: Math.round(pixelRatio * 50)
            },
            animated: true
          }
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
      } else if (nextStep.id === "traveling") {
        setTimeout(() => {
          dispatch(onRecenterMap("traveling"));
        }, 50);
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
        dispatch(onRecenterMap("toPrev", true));
      } else if (prevStep.id === "from") {
        addToData.route = [];
        // recenter map to pick up location
        dispatch(onRecenterMap("fromPrev"));
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
 * get vehicle time 
 */
export function onGetVehicleTime(id, location) {
  return (dispatch, getState) => {
    //console.log("on get vehicle time debug now ", id, location);

    const fromData = getState().ordering.fromData;

    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${location.lat},${location.lng}&destination=${fromData
        .geometry.location.lat},${fromData.geometry.location.lng}`
    )
      .then(
        response => response.json(),
        error => {
          console.log(
            "An error occured loading search vehicle results.",
            error
          );
        }
      )
      .then(json => {
        //console.log("route json vehicle time debugnow", json);

        // calculate route time
        let routeTime = -1;

        // exit if there is no route or no legs information
        if (!("routes" in json) || (json.routes && json.routes.length === 0)) {
          routeTime = -1;
        } else {
          try {
            const route = json.routes[0];
            console.log("vehicle time route", route);

            // if the route has no legs information
            if (!"legs" in route) return false;

            route.legs.map(leg => {
              routeTime += leg.duration.value;
            });
            routeTime = Math.round(routeTime / 60);
          } catch (error) {
            //console.log(error);
            routeTime = -1;
            return false;
          }
        }

        const currStepId = getState().ordering.currStep.id;

        //console.log("update time debugnow", id, routeTime);

        if (currStepId === "traveling") {
          // update booking time to arrival
          const booking = Object.assign({}, getState().ordering.booking);

          // console.log(
          //   "update time ",
          //   booking.booking_id,
          //   id,
          //   routeTime,
          //   booking.booking_id === id
          // );

          if (booking.vehicle_id === id) {
            console.log("update driver away time ");
            // dispatch map update with vehicles update
            dispatch({
              type: UPDATE_ORDERING_DATA,
              payload: {
                booking: { ...booking, driverAway: routeTime }
              }
            });
          }
          return false;
        } else {
          // if not traveling step then
          // we are updating availableVehicles list

          // update vehicle list with specific time
          //console.log("vehicle time route time ", routeTime);
          let availableVehicles = getState().ordering.availableVehicles.slice();

          const findId = findWithAttr(availableVehicles, "id", id);
          //console.log("vehicle time findId", findId);

          if (findId !== -1) {
            //console.log("vehicle time assign");

            const vehicle = availableVehicles[findId];

            availableVehicles.splice(findId, 1, {
              ...vehicle,
              routeTime: routeTime
            });

            // dispatch map update with vehicles update
            dispatch({
              type: UPDATE_ORDERING_DATA,
              payload: {
                availableVehicles: availableVehicles
              }
            });
          }
        }
      });
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

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${fromData
      .geometry.location.lat},${fromData.geometry.location
      .lng}&destination=${toData.geometry.location.lat},${toData.geometry
      .location.lng}`;

    fetch(url)
      .then(
        response => response.json(),
        error =>
          console.log("An error occured loading search vehicle results.", error)
      )
      .then(json => {
        //console.log("route json", json);
        if (!("routes" in json)) return false;

        try {
          const route = json.routes[0];

          let points = Polyline.decode(route.overview_polyline.points);
          let coords = points.map((point, index) => {
            return {
              latitude: point[0],
              longitude: point[1]
            };
          });

          let routeLength = 0;
          route.legs.map(leg => {
            // leg.steps.map(step => {
            routeLength += leg.distance.value;
            // });
          });

          routeLength = routeLength / 1000;

          // dispatch map update with vehicles update
          dispatch({
            type: UPDATE_ORDERING_DATA,
            payload: {
              route: coords,
              routeLength: routeLength
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

    dispatch({
      type: UPDATE_ORDERING_DATA,
      payload: { availableVehicles: [], searchingVehicles: true }
    });

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

    //console.log("fetch search results ", url);

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
        //console.log("search vehicles", json);

        // get vehicles from returned JSON
        let responseVehicles = json.vehicles || [];
        const routeLength = getState().ordering.routeLength;

        if (routeLength) {
          responseVehicles = responseVehicles.slice(0).map(v => ({
            ...v,
            routePrice: v.price_per_km * getState().ordering.routeLength
          }));
        }

        // dispatch map update with vehicles update
        dispatch({
          type: UPDATE_ORDERING_DATA,
          payload: {
            availableVehicles: responseVehicles,
            searchingVehicles: false
          }
        });

        responseVehicles.map(v => {
          dispatch(onGetVehicleTime(v.id, v.position));
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
 * CREATE SET OF TIMEOUTS TO SIMULATE ORDERING
 */
export function simulateOrdering() {
  return (dispatch, getState) => {
    // dispatch booking is accepted
    setTimeout(() => {
      dispatch({
        type: UPDATE_ORDERING_DATA,
        payload: {
          booking: { ...getState().ordering.booking, status: "accepted" }
        }
      });
    }, 3000);
    // dispatch driver on its way
    setTimeout(() => {
      dispatch({
        type: UPDATE_ORDERING_DATA,
        payload: {
          booking: { ...getState().ordering.booking, status: "driver_on_way" }
        }
      });
    }, 5000);
    // dispatch driver arrives info
    setTimeout(() => {
      dispatch({
        type: UPDATE_ORDERING_DATA,
        payload: {
          booking: { ...getState().ordering.booking, status: "driver_arriving" }
        }
      });
    }, 12000);
    // dispatch driver arrived
    setTimeout(() => {
      dispatch({
        type: UPDATE_ORDERING_DATA,
        payload: {
          booking: { ...getState().ordering.booking, status: "driver_arrived" }
        }
      });
    }, 30000);
    // dispatch ride completed
    setTimeout(() => {
      dispatch({
        type: UPDATE_ORDERING_DATA,
        payload: {
          booking: { ...getState().ordering.booking, status: "completed" }
        }
      });
    }, 50000);
  };
}

/**
 * action when user confirms booking and 
 */
export function onConfirmBooking() {
  return dispatch => {
    dispatch(onCreateBooking());
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

  [LOG_OUT]: (state, action) => ({
    ...state,
    ...initialState,
    currStepNo: 0,
    currStep: ORDERING_STEPS[0]
  }),

  [LOGIN_SUCCESS]: (state, action) => ({
    ...state,
    currStepNo: 2,
    currStep: ORDERING_STEPS[2]
  }),

  /* make sure some data on reload of the app are not  in loaded from local storage */
  [REHYDRATE]: (state, action) => {
    const incoming = action.payload.ordering;
    const userIncoming = action.payload.user || { loggedIn: false };
    if (incoming) {
      if (!userIncoming.loggedIn && config.ordering.withAuth) {
        incoming.currStepNo = 0;
      }
      // is pickup step before destination step
      const fromStepNo = findWithAttr(ORDERING_STEPS, "id", "from");
      const toStepNo = findWithAttr(ORDERING_STEPS, "id", "to");
      const timeStepNo = findWithAttr(ORDERING_STEPS, "id", "time");
      const vehicleSelectStepNo = findWithAttr(
        ORDERING_STEPS,
        "id",
        "vehicleSelect"
      );
      const confirmationStepNo = findWithAttr(
        ORDERING_STEPS,
        "id",
        "confirmation"
      );

      incoming.hidePanel = false;
      incoming.currStep = ORDERING_STEPS[incoming.currStepNo];

      if (
        incoming.currStep.id === "traveling" &&
        (!("selectedVehicle" in incoming) ||
          ("selectedVehicle" in incoming &&
            !("position" in incoming.selectedVehicle)))
      ) {
        return {
          ...initialState
        };
      }
      return {
        ...state,
        ...incoming,
        availableVehicles: [],
        fromStepNo: fromStepNo,
        toStepNo: toStepNo,
        timeStepNo: timeStepNo,
        vehicleSelectStepNo: vehicleSelectStepNo,
        confirmationStepNo: confirmationStepNo
      };
    }
    return state;
  }
};

//console.log("from to", fromStepNo, toStepNo);
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
  hidePanel: false,
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
