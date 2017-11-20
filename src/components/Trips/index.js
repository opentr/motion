import { connect } from "react-redux";

import Trips from "./Trips";

import config from "../../config/config";

const mapDispatchToProps = {};

const mapStateToProps = state => ({
  trips: state.ordering.recentTrips || []
});

export default connect(mapStateToProps, mapDispatchToProps)(Trips);
