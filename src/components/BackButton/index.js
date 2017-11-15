import { connect } from "react-redux";

import { onPrevStep, onUpdateOrderingData } from "../../store/orderingReducer";
import BackButton from "./BackButton";

const mapDispatchToProps = {
  onPrevStep,
  onUpdateOrderingData
};

import config from "../../config/config";

const mapStateToProps = state => ({
  user: state.user,
  inputOpen: state.ordering.inputOpen || false,
  orderingInProgress:
    state.ordering.currStep.id !== "traveling" &&
    ((config.ordering.withAuth && state.ordering.currStepNo > 2) ||
      (!config.ordering.withAuth && state.ordering.currStepNo > 0))
});

export default connect(mapStateToProps, mapDispatchToProps)(BackButton);
