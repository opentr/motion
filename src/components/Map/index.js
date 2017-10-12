import { connect } from "react-redux";

import Map from "./Map";
import { onRegionChange } from "../../store/mapReducer";

const mapDispatchToProps = {
  onRegionChange
};

const mapStateToProps = state => ({
  region: state.map.region
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
