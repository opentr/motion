import { connect } from "react-redux";

import Ordering from "./components/Ordering";
import { onRegionChange } from "../../store/mapReducer";
import {
  onUpdateOrderingData,
  onNextStep,
  onPrevStep,
  onSearchForVehicle,
  onSelectVehicle,
  onConfirmBooking
} from "../../store/orderingReducer";

const mapDispatchToProps = {
  onRegionChange,
  onUpdateOrderingData,
  onNextStep,
  onPrevStep,
  onSearchForVehicle,
  onSelectVehicle,
  onConfirmBooking
};

const mapStateToProps = state => ({
  ordering: state.ordering,
  availableVehicles: state.ordering.availableVehicles
});

export default connect(mapStateToProps, mapDispatchToProps)(Ordering);
