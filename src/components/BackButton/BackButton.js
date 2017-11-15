import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Animated, TouchableOpacity } from "react-native";

class BackButton extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
  }

  render() {
    console.log("back button ", this.props);
    return this.props.orderingInProgress || this.props.inputOpen ? (
      <TouchableOpacity
        onPress={() => {
          if (this.props.inputOpen) {
            this.props.onUpdateOrderingData({ inputOpen: false });
          } else {
            this.props.onPrevStep();
          }
        }}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          top: 12,
          left: 8,
          zIndex: 100
        }}
      >
        <Animated.Image
          source={require("../../assets/back.png")}
          style={{
            width: 32,
            height: 32
          }}
        />
      </TouchableOpacity>
    ) : null;
  }
}

export default BackButton;
