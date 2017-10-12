import config from "../config/config";

export const REGION_UPDATE = "REGION_UPDATE";
export const VEHICLES_UPDATE = "VEHICLES_UPDATE";

export function onRegionChange(region) {
  console.log("on region update", region);
  return { type: REGION_UPDATE, payload: region };
}

export function onLoadVehicles(region) {
  console.log("load vehicles");
  return dispatch => {
    const radius = Math.round(region.latitudeDelta * 111 * 1.60934 * 1000); //config.api.openTransport.searchRadius;
    return fetch(
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
        const responseVehicles = json.vehicles || [];

        dispatch({ type: VEHICLES_UPDATE, payload: responseVehicles });
      });
  };
}

const ACTION_HANDLERS = {
  [REGION_UPDATE]: (state, action) => ({
    ...state,
    region: action.payload
  }),
  [VEHICLES_UPDATE]: (state, action) => ({
    ...state,
    vehicles: action.payload
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
  console.log("map reducer", arguments);
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
