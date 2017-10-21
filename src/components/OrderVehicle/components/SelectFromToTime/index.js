import { connect } from "react-redux";

import SelectFromToTime from "./SelectFromToTime";

const mapDispatchToProps = {};
const mapStateToProps = state => ({
  ordering: state.ordering
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectFromToTime);
