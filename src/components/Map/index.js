import { connect } from "react-redux";

import Map from "./Map";
import { onRegionChange, onLoadVehicles } from "../../store/mapReducer";

const mapDispatchToProps = {
  onRegionChange,
  onLoadVehicles
};

const mapStateToProps = state => ({
  region: state.map.region,
  vehicles: []
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
