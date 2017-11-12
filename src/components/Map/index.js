import { connect } from "react-redux";

import Map from "./components/Map";
import {
  onRegionChange,
  reverseGeocodeLocation,
  onMapAction
} from "../../store/mapReducer";
import { onLoadVehicles } from "../../store/orderingReducer";

const mapDispatchToProps = {
  onRegionChange,
  onMapAction,
  onLoadVehicles,
  reverseGeocodeLocation
};

const mapStateToProps = state => ({
  region: state.map.region,
  loadingGeocoding: state.map.loadingGeocoding,
  mapAction: state.map.action,
  vehicles: state.ordering.vehicles,
  selectedVehicle: state.ordering.selectedVehicle,
  ordering: state.ordering
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
