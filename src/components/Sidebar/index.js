import { connect } from "react-redux";

import { onLogout, onLoginReturningUser } from "../../store/userReducer";
import { onSideBar, onPrevStep } from "../../store/orderingReducer";
import Sidebar from "./Sidebar";

import config from "../../config/config";

const mapDispatchToProps = {
  onLogout,
  onSideBar,
  onPrevStep,
  onLoginReturningUser
};

const mapStateToProps = state => ({
  user: state.user,
  inputOpen: state.ordering.inputOpen || false,
  orderingInProgress:
    state.ordering.currStep.id !== "traveling" &&
    ((config.ordering.withAuth && state.ordering.currStepNo > 2) ||
      (!config.ordering.withAuth && state.ordering.currStepNo > 0))
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
