import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Image, Animated, TouchableOpacity } from "react-native";

class Sidebar extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    // make sure ordering is shown if app is reloaded
    // this.props.onSideBar(this.state.open);
  }

  render() {
    const { user } = this.props;

    return (
      user.loggedIn && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 10,
            left: 10
          }}
          onPress={e => {
            this.props.onSideBar(this.state.open);
            this.setState({ open: !this.state.open });
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 24
            }}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
      )
    );
  }
}

export default Sidebar;
