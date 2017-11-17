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

class SelectVehicleItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    index: PropTypes.number,
    onPressItem: PropTypes.func
  };

  static defaultProps = {
    ...PureComponent.defaultProps,
    data: {},
    onPressItem: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      placeholder:
        !("id" in this.props.data) ||
        !("routeTime" in this.props.data) ||
        !this.props.sortedVehicles
    };
  }
  rr;

  componentDidMount() {
    // console.log("vehicle item debug now", this.props, this.state);
    // if ("id" in this.props.data && !("routeTime" in this.props.data))
    //   this.props.onGetVehicleTime(this.props.data.id, this.props.data.position);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      placeholder:
        !("id" in nextProps.data) ||
        !("routeTime" in nextProps.data) ||
        !nextProps.sortedVehicles
    });
  }

  render() {
    const { make, image_url, routePrice, routeTime } = this.props.data;

    const { placeholder } = this.state;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.onPressItem(this.props.index);
        }}
      >
        <View style={styles.ordering.vehicleSelect.vehicle.holder}>
          <Text
            style={[
              styles.ordering.vehicleSelect.vehicle.make,
              placeholder
                ? styles.ordering.vehicleSelect.vehicle.makePlaceholder
                : {}
            ]}
          >
            {placeholder ? "     " : make}
          </Text>
          <Image
            source={
              placeholder
                ? require("../../../assets/car-placeholder.png")
                : {
                    uri: image_url
                  }
            }
            resizeMode="contain"
            style={[
              styles.ordering.vehicleSelect.vehicle.image,
              placeholder
                ? styles.ordering.vehicleSelect.vehicle.imagePlaceholder
                : {}
            ]}
          />
          <Text
            style={[
              styles.ordering.vehicleSelect.vehicle.time,
              placeholder
                ? styles.ordering.vehicleSelect.vehicle.timePlaceholder
                : {}
            ]}
          >
            {placeholder || !("routeTime" in this.props.data)
              ? "     "
              : routeTime === -1 ? "N/A" : "in " + routeTime + "  min"}
          </Text>
          <Text
            style={[
              styles.ordering.vehicleSelect.vehicle.price,
              placeholder
                ? styles.ordering.vehicleSelect.vehicle.pricePlaceholder
                : {}
            ]}
          >
            {placeholder
              ? "     "
              : typeof routePrice === "undefined"
                ? "N/A"
                : "£" + routePrice.toFixed(2)}
          </Text>
          {placeholder ? (
            <View
              style={styles.ordering.vehicleSelect.vehicle.rating.placeholder}
            />
          ) : (
            <View style={styles.ordering.vehicleSelect.vehicle.rating.holder}>
              <Image
                source={require("../../../assets/heart.png")}
                style={styles.ordering.vehicleSelect.vehicle.rating.heart}
              />
              <View
                style={styles.ordering.vehicleSelect.vehicle.rating.textHolder}
              >
                <Text style={styles.ordering.vehicleSelect.vehicle.rating.text}>
                  8
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default SelectVehicleItem;
