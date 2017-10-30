import { connect } from "react-redux";

import { onLoginFacebook, onLoginGoogle } from "../../store/userReducer";
import Login from "./Login";

const mapDispatchToProps = {
  onLoginFacebook,
  onLoginGoogle
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
