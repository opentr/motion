import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  Animated,
  Easing,
  Image,
  TouchableWithoutFeedback
} from "react-native";

import config from "../../../config/config";
import styles from "../../../styles/styles";

class Confirmation extends PureComponent {
  static propTypes = {
    fromAddress: PropTypes.string.isRequired,
    toAddress: PropTypes.string.isRequired,
    vehicle: PropTypes.object.isRequired,
    price: PropTypes.any.isRequired,
    onConfirmBooking: PropTypes.func.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
  }

  render() {
    console.log("COnfirmation ", this.props);
    return (
      <View
        style={{
          paddingTop: 65,
          flex: 1,
          width: "100%",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingLeft: 10,
          paddingRight: 10
        }}
      >
        <Text
          style={{
            fontSize: 16,
            height: 30,
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          You will be picked in
        </Text>
        <Text
          style={{
            fontSize: 20,
            height: 40,
            color: config.colors.secondary,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          {this.props.fromAddress}
        </Text>
        <Text
          style={{
            fontSize: 16,
            height: 30,
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          and drop me at
        </Text>
        <Text
          style={{
            fontSize: 20,
            height: 40,
            color: config.colors.secondary,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          {this.props.toAddress}
        </Text>
        <Text
          style={{
            fontSize: 16,
            height: 30,
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          in
        </Text>
        <Text
          style={{
            fontSize: 20,
            height: 40,
            color: config.colors.secondary,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          {this.props.vehicle.type}
        </Text>
        <Text
          style={{
            fontSize: 16,
            height: 30,
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          You will be charged
        </Text>
        <Text
          style={{
            fontSize: 20,
            height: 40,
            color: config.colors.secondary,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          {this.props.price}
        </Text>
        <Text
          style={{
            fontSize: 16,
            height: 30,
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          The card XYZ will be charged
        </Text>

        <Text
          style={{
            marginTop: 15,
            fontSize: 30,
            height: 60,
            width: this.props.width * 0.9,
            color: config.colors.alert,
            textAlignVertical: "center",
            textAlign: "center"
          }}
          onPress={this.props.onConfirmBooking}
        >
          {this.props.actionText}
        </Text>
      </View>
    );
  }
}

export default Confirmation;
