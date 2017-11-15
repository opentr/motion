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
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 10
          }}
        >
          <Text
            style={{
              height: placeholder ? 30 : 40,
              fontSize: 15,
              marginTop: placeholder ? 0 : 10,
              width: 83,
              color: config.colors.primary,
              textAlignVertical: "center",
              textAlign: "center",
              backgroundColor: placeholder ? "#f2f2f2" : "white"
            }}
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
            style={{
              width: placeholder ? 100 : 105,
              height: 60,
              marginTop: placeholder ? 15 : 5
            }}
          />
          <Text
            style={{
              fontSize: 15,
              lineHeight: placeholder ? 16 : 24,
              width: placeholder ? 60 : 85,
              marginTop: placeholder ? 8 : 0,
              color: config.colors.text,
              textAlignVertical: "center",
              textAlign: "center",
              backgroundColor: placeholder ? "#f2f2f2" : "white"
            }}
          >
            {placeholder || !("routeTime" in this.props.data)
              ? "     "
              : routeTime === -1 ? "N/A" : "in " + routeTime + "  min"}
          </Text>
          <Text
            style={{
              fontSize: 20,
              lineHeight: placeholder ? 20 : 30,
              marginTop: placeholder ? 10 : 0,
              width: placeholder ? 60 : 85,
              color: config.colors.text,
              textAlignVertical: "center",
              textAlign: "center",
              fontWeight: "bold",
              backgroundColor: placeholder ? "#f2f2f2" : "white"
            }}
          >
            {placeholder
              ? "     "
              : typeof routePrice === "undefined"
                ? "N/A"
                : "£" + routePrice.toFixed(2)}
          </Text>
          {placeholder ? (
            <View
              style={{
                flexDirection: "row",
                width: placeholder ? 60 : 105,
                height: 24,
                paddingTop: placeholder ? 0 : 10,
                marginTop: placeholder ? 10 : 4,
                backgroundColor: placeholder ? "#f2f2f2" : "white"
              }}
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                width: 105,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 10
              }}
            >
              <Image
                source={require("../../../assets/heart.png")}
                style={{
                  width: 24,
                  height: 20,
                  marginRight: 5
                }}
              />
              <View
                style={{
                  paddingTop: 2,
                  paddingBottom: 4,
                  paddingLeft: 6,
                  paddingRight: 6,
                  backgroundColor: config.colors.green
                }}
              >
                <Text
                  style={{
                    color: "white",
                    lineHeight: 18,
                    fontSize: 18
                  }}
                >
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
