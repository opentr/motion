import { connect } from "react-redux";

import { onLogout } from "../../store/userReducer";
import { onSideBar } from "../../store/orderingReducer";
import Sidebar from "./Sidebar";

const mapDispatchToProps = {
  onLogout,
  onSideBar
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
