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
    fromAddress: PropTypes.string,
    toAddress: PropTypes.string,
    vehicle: PropTypes.object,
    price: PropTypes.any,
    onConfirmBooking: PropTypes.func.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps,
    vehicle: {}
  };

  constructor(props) {
    super(props);
  }

  render() {
    //console.log("COnfirmation ", this.props);
    return (
      <View style={styles.ordering.confirmation.holder}>
        <Text style={styles.ordering.confirmation.label}>
          You will be picked in
        </Text>
        <Text style={styles.ordering.confirmation.info} numberOfLines={1}>
          {this.props.fromAddress}
        </Text>
        <Text style={styles.ordering.confirmation.label}>and drop me at</Text>
        <Text style={styles.ordering.confirmation.info} numberOfLines={1}>
          {this.props.toAddress}
        </Text>
        <Text style={styles.ordering.confirmation.label}>in</Text>
        <Text style={styles.ordering.confirmation.info}>
          {this.props.vehicle.make || ""}
        </Text>
        <Text style={styles.ordering.confirmation.label}>
          You will be charged
        </Text>
        <Text style={styles.ordering.confirmation.info}>
          {this.props.price}
        </Text>
        <Text style={styles.ordering.confirmation.label}>
          The card XYZ will be charged
        </Text>

        <Text
          style={styles.ordering.confirmation.button}
          onPress={this.props.onConfirmBooking}
        >
          {this.props.actionText}
        </Text>
      </View>
    );
  }
}

export default Confirmation;
