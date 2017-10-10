import React, { PureComponent } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  Keyboard,
  Animated,
  Easing,
  Platform
} from "react-native";
import PropTypes from "prop-types";

import config from "../../config/config";
import styles from "../../styles/styles";

const timer = require("react-native-timer");

class OrderVehicle extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);

    this.state = {
      inputText: "",
      inputOpen: false,
      addresses: [],
      titleTranslate: new Animated.Value(0),
      inputTranslate: new Animated.Value(0),
      panelTranslate: new Animated.Value(0),
      buttonOpacity: new Animated.Value(1),
      panelHeight: Dimensions.get("window").height * config.ordering.height,
      fromAddress: config.map.forceStartLocation
        ? config.map.startLocation.address
        : "Type in address"
    };

    this.openPanelForInput = this.openPanelForInput.bind(this);
    this.closePanelForInput = this.closePanelForInput.bind(this);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.fetchAddress = this.fetchAddress.bind(this);
    this.onSelectAddress = this.onSelectAddress.bind(this);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  async fetchAddress(text) {
    this.setState({ inputText: text });
    const url =
      config.api.google.url +
      "?query=" +
      text +
      "&key=" +
      config.api.google.key;
    let response = await fetch(url, {
      method: "get"
    });
    const responseJson = await response.json();
    if (responseJson.results) {
      this.setState({ addresses: responseJson.results.slice(0) });
    }
    console.log("geocode", responseJson);
  }

  onInputChange(text) {
    console.log("change text", text);

    // debounce search
    this.fetchAddress(text);
  }

  openPanelForInput() {
    console.log("open panel for input");
    //const toHeight = Dimensions.get("window").height * 0.8;
    this.setState({ panelHeight: Dimensions.get("window").height });

    const targetTranslatePanel = -0.5 * Dimensions.get("window").height;

    Animated.parallel([
      Animated.timing(
        // Animate over time
        this.state.panelTranslate, // The animated value to drive
        {
          toValue: targetTranslatePanel,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 500
        }
      ),
      Animated.timing(
        // Animate over time
        this.state.titleTranslate, // The animated value to drive
        {
          toValue: -20,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 500
        }
      ),
      Animated.timing(
        // Animate over time
        this.state.buttonOpacity, // The animated value to drive
        {
          toValue: 0,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 500
        }
      )
    ]).start(this.onOpenPanel);
  }

  closePanelForInput() {
    //const toHeight = Dimensions.get("window").height * 0.8;

    Animated.parallel([
      Animated.timing(
        // Animate over time
        this.state.panelTranslate, // The animated value to drive
        {
          toValue: 0,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 500
        }
      ),
      Animated.timing(
        // Animate over time
        this.state.titleTranslate, // The animated value to drive
        {
          toValue: 0,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 500
        }
      ),
      Animated.timing(
        // Animate over time
        this.state.buttonOpacity, // The animated value to drive
        {
          toValue: 1,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 500
        }
      )
    ]).start();
  }

  onOpenPanel() {
    this.setState({ inputOpen: true, addresses: [] });
  }

  onSelectAddress(text, index) {
    Keyboard.dismiss();
    this.setState({
      inputOpen: false,
      addressData: this.state.addresses[index],
      fromAddress: text
    });
    this.closePanelForInput();
  }

  render() {
    const width = Dimensions.get("window").width; //full width

    return (
      <Animated.View
        style={{
          position: "absolute",
          top: Dimensions.get("window").height * 0.6,
          zIndex: 1000,
          backgroundColor: "white",
          width: width,
          height: this.state.panelHeight,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          transform: [{ translateY: this.state.panelTranslate }]
        }}
      >
        <Animated.Text
          style={[
            styles.baseText,
            {
              paddingTop: 40,
              transform: [{ translateY: this.state.titleTranslate }]
            }
          ]}
        >
          Pick me up from
        </Animated.Text>
        {this.state.inputOpen && (
          <View style={{ flexDirection: "column" }}>
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
                  paddingTop: 10
                }
              ]}
            />
            {Platform.OS === "ios" && (
              <View
                style={[
                  styles.inputUnderline,
                  { width: 0.86 * width, marginTop: 4 }
                ]}
              />
            )}
            {this.state.addresses.slice(0, 5).map((addr, index) => {
              console.log("render", addr, index);

              const types = addr.types.join(",");
              const text =
                types.indexOf("street_address") === -1
                  ? addr.name + ", " + addr.formatted_address
                  : add.formatted_address;
              return (
                <Text
                  key={index}
                  onPress={() => this.onSelectAddress(text, index)}
                  style={[
                    styles.baseText,
                    {
                      width: 0.8 * width,
                      paddingLeft: 4,
                      fontSize: 20,
                      marginTop: index === 0 ? 10 : 5,
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
        )}
        <Animated.Text
          onPress={() => {
            this.openPanelForInput();
          }}
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={[
            styles.baseText,
            styles.actionText,
            {
              width: 0.8 * width,
              textAlign: "center",
              paddingTop: 10,
              opacity: this.state.buttonOpacity
            }
          ]}
        >
          {this.state.fromAddress}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.baseText,
            styles.buttonText,
            { paddingTop: 30, opacity: this.state.buttonOpacity }
          ]}
        >
          Next
        </Animated.Text>
      </Animated.View>
    );
  }
}

export default OrderVehicle;
