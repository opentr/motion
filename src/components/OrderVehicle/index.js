import { connect } from "react-redux";

import OrderVehicle from "./OrderVehicle";
import { onRegionChange } from "../../store/mapReducer";

const mapDispatchToProps = {
  onRegionChange
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OrderVehicle);
