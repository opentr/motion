import { connect } from "react-redux";

import Map from "./components/Map";
import { onRegionChange, reverseGeocodeLocation } from "../../store/mapReducer";
import { onLoadVehicles } from "../../store/orderingReducer";

const mapDispatchToProps = {
  onRegionChange,
  onLoadVehicles,
  reverseGeocodeLocation
};

const mapStateToProps = state => ({
  region: state.map.region,
  vehicles: state.ordering.vehicles,
  ordering: state.ordering
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
