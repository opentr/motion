import { connect } from "react-redux";

import Map from "./Map";
import {
  onRegionChange,
  onLoadVehicles,
  reverseGeocodeLocation
} from "../../store/mapReducer";

const mapDispatchToProps = {
  onRegionChange,
  onLoadVehicles,
  reverseGeocodeLocation
};

const mapStateToProps = state => ({
  region: state.map.region,
  vehicles: state.map.vehicles,
  ordering: state.ordering
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
