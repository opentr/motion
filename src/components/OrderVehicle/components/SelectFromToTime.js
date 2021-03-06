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
      /* current search text */
      searchText: "",
      /* list of Google returned addresses for search */
      addresses: []
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.resetAddressList = this.resetAddressList.bind(this);
    this.fetchAddress = this.fetchAddress.bind(this);
    this.onAddressClick = this.onAddressClick.bind(this);
    this.onRecentAddressClick = this.onRecentAddressClick.bind(this);
  }

  componentDidMount() {}

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
    this.setState({ searchText: text });
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

  onRecentAddressClick(place_id) {
    const clickedRecent = this.props.ordering.recentAddresses
      .slice(0)
      .filter(addr => addr.place_id === place_id);
    if (clickedRecent.length > 0) {
      this.props.onSelectAddress(
        clickedRecent[0].formatted_address,
        clickedRecent[0]
      );
    }
  }
  onAddressClick(index) {
    this.props.onSelectAddress(
      this.state.addresses[index].formatted_address,
      this.state.addresses[index]
    );
  }

  getExpandedAddressInput() {
    const width = this.props.width;

    if (!this.props.panelOpen) return null;

    let recentAddresses = (this.props.ordering.recentAddresses || []).slice(0);
    // filter out if search text
    if (this.state.searchText !== "") {
      recentAddresses = recentAddresses.filter(
        addr => addr.formatted_address.indexOf(this.state.searchText) > -1
      );
    }

    if (this.state.addresses.length > 0) {
      recentAddresses = recentAddresses.slice(0, 3);
    } else {
      recentAddresses = recentAddresses.slice(0, 5);
    }

    return (
      <View style={[this.props.style, styles.ordering.addressInput.holder]}>
        <TextInput
          autoFocus={true}
          multiline={false}
          clearButtonMode={"while-editing"}
          underlineColorAndroid={config.colors.secondary}
          spellCheck={false}
          onChangeText={this.onInputChange}
          style={[
            styles.ordering.addressInput.inputText,
            {
              width: 0.9 * width
            }
          ]}
        />
        {Platform.OS === "ios" && (
          <View
            style={[
              styles.ordering.addressInput.inputUnderline,
              {
                width: (Platform.OS === "ios" ? 0.9 : 0.86) * width
              }
            ]}
          />
        )}
        {recentAddresses.length > 0 && (
          <View
            style={[
              styles.ordering.addressInput.resultsHolder,
              {
                width: 0.9 * width
              }
            ]}
          >
            <Text style={styles.ordering.addressInput.label}>
              RECENT LOCATIONS
            </Text>
            {recentAddresses.map((addr, index) => {
              //console.log("render", addr, index);

              const types = addr.types.join(",");
              const text =
                types.indexOf("street_address") === -1 && addr.name
                  ? addr.name + ", " + addr.formatted_address
                  : addr.formatted_address;
              return (
                <Text
                  key={index}
                  onPress={() => {
                    this.onRecentAddressClick(addr.place_id);
                  }}
                  style={[
                    styles.ordering.addressInput.result,
                    {
                      width: 0.9 * width,
                      marginTop:
                        index === 0 ? (Platform.OS === "ios" ? 12 : 6) : 6
                    }
                  ]}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  {text}
                </Text>
              );
            })}
            {this.state.addresses.length > 0 && (
              <Text
                style={[
                  styles.ordering.addressInput.label,
                  styles.ordering.addressInput.labelSearch
                ]}
              >
                SEARCH RESULTS
              </Text>
            )}
          </View>
        )}
        {this.state.addresses.slice(0, 5).map((addr, index) => {
          //console.log("render", addr, index);

          const types = addr.types.join(",");
          const text =
            types.indexOf("street_address") === -1
              ? addr.name + ", " + addr.formatted_address
              : addr.formatted_address;
          return (
            <Text
              key={index}
              onPress={() => {
                this.onAddressClick(index);
              }}
              style={[
                styles.ordering.addressInput.result,
                {
                  marginTop: index === 0 ? (Platform.OS === "ios" ? 12 : 6) : 6,
                  width: 0.9 * width,
                  paddingLeft: 4
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
        value = this.props.ordering.fromAddress || "No address found...";
        action = ORDERING_STEPS[this.props.ordering.fromStepNo].action;
        break;
      case "to":
        title = ORDERING_STEPS[this.props.ordering.toStepNo].title;
        value = this.props.ordering.toAddress || "No address found...";
        action = ORDERING_STEPS[this.props.ordering.toStepNo].action;
        break;
      case "time":
        title = ORDERING_STEPS[this.props.ordering.timeStepNo].title;
        value = this.props.ordering.time;
        action = ORDERING_STEPS[this.props.ordering.timeStepNo].action;
        break;
    }

    return (
      <View style={styles.ordering.fromToTime.holder} ref={view => this.view}>
        {/* Title of the panel */}
        <Animated.Text
          style={[
            styles.baseText,
            styles.ordering.fromToTime.title,
            {
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
            if (this.props.stepId === "from" || this.props.stepId === "to")
              this.props.openPanel();
          }}
          ellipsizeMode={"tail"}
          numberOfLines={1}
          style={[
            styles.actionText,
            styles.ordering.fromToTime.value,
            {
              width: 0.9 * this.props.width,
              opacity: this.props.animated.buttonOpacity
            }
          ]}
        >
          {value}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.buttonText,
            styles.ordering.fromToTime.button,
            {
              opacity: this.props.animated.buttonOpacity
            }
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
