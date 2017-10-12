import config from "../config/config";

export const REGION_UPDATE = "REGION_UPDATE";

export function onRegionChange(region) {
  console.log("on region update", region);
  return { type: REGION_UPDATE, payload: region };
}

const ACTION_HANDLERS = {
  [REGION_UPDATE]: (state, action) => ({
    ...state,
    region: action.payload
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
  console.log("map reducer", arguments);
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
