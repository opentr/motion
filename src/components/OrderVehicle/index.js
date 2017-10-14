import { connect } from "react-redux";

import OrderVehicle from "./OrderVehicle";
import { onRegionChange } from "../../store/mapReducer";
import {
  onUpdateOrderingData,
  onNextStep,
  onPrevStep
} from "../../store/orderingReducer";

const mapDispatchToProps = {
  onRegionChange,
  onUpdateOrderingData,
  onNextStep,
  onPrevStep
};

const mapStateToProps = state => ({
  ordering: state.ordering
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderVehicle);
