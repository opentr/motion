import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TextInput, Animated, Platform } from "react-native";

const timer = require("react-native-timer");

import { ORDERING_STEPS } from "../../../store/orderingReducer";
import config from "../../../config/config";
import styles from "../../../styles/styles";

class SelectFromToTime extends PureComponent {
  static propTypes = {
    ordering: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps,
    style: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      /* list of Google returned addresses for search */
      addresses: []
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.resetAddressList = this.resetAddressList.bind(this);
    this.fetchAddress = this.fetchAddress.bind(this);
    this.onAddressClick = this.onAddressClick.bind(this);
  }

  componentWillUnmount() {
    timer.clearTimeout("fetchAddresses");
  }

  resetAddressList() {
    this.setState({ addresses: [] });
  }

  onInputChange(text) {
    // debounce search
    timer.clearTimeout("fetchAddresses");
    timer.setTimeout(
      "fetchAddresses",
      () => {
        this.fetchAddress(text);
      },
      300
    );
  }

  /** fetch search addresses using Google API */
  async fetchAddress(text) {
    // form the url for API call
    const url =
      config.api.google.urlTextSearch +
      ("?query=" + text) +
      ("&location=" +
        config.map.startLocation.latitude +
        "," +
        config.map.startLocation.longitude) +
      ("&radius=" + config.api.google.radius) +
      ("&key=" + config.api.google.key);
    //console.log(url);
    // call Google API
    let response = await fetch(url, {
      method: "get"
    });

    // get JSON of the result
    const responseJson = await response.json();

    if (responseJson.results) {
      // if any addresses in result add them to state
      this.setState({ addresses: responseJson.results.slice(0) });
    } else {
      // no addresses in result then set empty list so the interface does not show old results
      this.setState({ addresses: [] });
    }
    //console.log("geocode", responseJson);
  }

  onAddressClick(index) {
    this.props.onSelectAddress(
      this.state.addresses[index].formatted_address,
      this.state.addresses[index]
    );
  }

  getExpandedAddressInput() {
    const width = this.props.width;

    return (
      this.props.panelOpen && (
        <View style={{ ...this.props.style, flexDirection: "column" }}>
          <TextInput
            autoFocus={true}
            multiline={false}
            clearButtonMode={"while-editing"}
            underlineColorAndroid={config.colors.secondary}
            spellCheck={false}
            onChangeText={this.onInputChange}
            style={[
              styles.baseText,
              styles.actionText,
              {
                width: 0.9 * width,
                paddingTop: 10,
                height: Platform.OS === "ios" ? 40 : 60,
                textAlign: "left",
                textAlignVertical: "center"
              }
            ]}
          />
          {Platform.OS === "ios" && (
            <View
              style={[
                styles.inputUnderline,
                {
                  width: (Platform.OS === "ios" ? 0.9 : 0.86) * width,
                  marginTop: 4
                }
              ]}
            />
          )}
          {this.state.addresses.slice(0, 5).map((addr, index) => {
            //console.log("render", addr, index);

            const types = addr.types.join(",");
            const text =
              types.indexOf("street_address") === -1
                ? addr.name + ", " + addr.formatted_address
                : add.formatted_address;
            return (
              <Text
                key={index}
                onPress={() => {
                  this.onAddressClick(index);
                }}
                style={[
                  styles.baseText,
                  {
                    width: 0.9 * width,
                    paddingLeft: 4,
                    fontSize: 16,
                    marginTop:
                      index === 0 ? (Platform.OS === "ios" ? 20 : 10) : 10,
                    marginBottom: 5
                  }
                ]}
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >
                {text}
              </Text>
            );
          })}
        </View>
      )
    );
  }

  render() {
    let title = "",
      value = "",
      action = "";

    // console.log("render from to now", this.props);

    if (
      !("ordering" in this.props) ||
      ("ordering" in this.props && !("fromStepNo" in this.props.ordering))
    ) {
      return null;
    }

    switch (this.props.stepId) {
      case "from":
        title = ORDERING_STEPS[this.props.ordering.fromStepNo].title;
        value = this.props.ordering.fromAddress || "";
        action = ORDERING_STEPS[this.props.ordering.fromStepNo].action;
        break;
      case "to":
        title = ORDERING_STEPS[this.props.ordering.toStepNo].title;
        value = this.props.ordering.toAddress || "";
        action = ORDERING_STEPS[this.props.ordering.toStepNo].action;
        break;
      case "time":
        title = ORDERING_STEPS[this.props.ordering.timeStepNo].title;
        value = this.props.ordering.time;
        action = ORDERING_STEPS[this.props.ordering.timeStepNo].action;
        break;
    }

    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
        onLayout={this.props.onLayout}
      >
        {/* Title of the panel */}
        <Animated.Text
          style={[
            styles.baseText,
            {
              paddingTop: 50,
              textAlignVertical: "center",
              textAlign: "center",
              height: 80,
              transform: [{ translateY: this.props.animated.titleTranslate }]
            }
          ]}
        >
          {title}
        </Animated.Text>
        {/* Expanded address input view */}
        {this.getExpandedAddressInput()}
        {/* Value text for from, to address, time etc. ... can be clicked in steps that need action */}
        <Animated.Text
          onPress={() => {
            this.props.openPanel();
          }}
          ellipsizeMode={"tail"}
          numberOfLines={1}
          style={[
            styles.baseText,
            styles.actionText,
            {
              width: 0.9 * this.props.width,
              textAlign: "center",
              textAlignVertical: "center",
              marginTop: 15,
              height: 60,

              opacity: this.props.animated.buttonOpacity,
              fontSize: value.length > 30 ? 18 : value.length > 20 ? 20 : 24
            }
          ]}
        >
          {value}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.baseText,
            styles.buttonText,
            { paddingTop: 25, opacity: this.props.animated.buttonOpacity }
          ]}
          onPress={this.props.onNextStep}
        >
          {action}
        </Animated.Text>
      </View>
    );
  }
}

export default SelectFromToTime;
