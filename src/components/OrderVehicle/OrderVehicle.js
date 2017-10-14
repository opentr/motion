import React, { PureComponent } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  Keyboard,
  Animated,
  Easing,
  Image,
  Platform,
  TouchableHighlight
} from "react-native";
import PropTypes from "prop-types";

import config from "../../config/config";
import styles from "../../styles/styles";
import { ORDERING_STEPS } from "../../store/orderingReducer";

const timer = require("react-native-timer");

class OrderVehicle extends PureComponent {
  static propTypes = {
    ordering: PropTypes.object.isRequired,
    onRegionChange: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);

    this.state = {
      /* is panel open/expanded for input */
      inputOpen: false,
      /* is panel opening/closing */
      panelAnimating: false,
      /* list of Google returned addresses for search */
      addresses: [],
      /**
       * Animation values to be used on panel open/close
       */
      titleTranslate: new Animated.Value(0),
      inputTranslate: new Animated.Value(0),
      panelTranslate: new Animated.Value(0),
      buttonOpacity: new Animated.Value(1),
      backButtonOpacity: new Animated.Value(0),
      /* height of the ordering panel */
      panelHeight: Dimensions.get("window").height * config.ordering.height
    };

    this.openPanelAddressInput = this.openPanelAddressInput.bind(this);
    this.closePanelForInput = this.closePanelForInput.bind(this);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.fetchAddress = this.fetchAddress.bind(this);
    this.onSelectAddress = this.onSelectAddress.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onNextStep = this.onNextStep.bind(this);
  }

  componentWillUnmount() {
    timer.clearTimeout("fetchAddresses");
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
    console.log(url);
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
    console.log("geocode", responseJson);
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

  openPanelAddressInput() {
    // check if panel is on from or to step, if not do not open address input
    if (
      this.props.ordering.currStep.id !== "from" &&
      this.props.ordering.currStep.id !== "to"
    ) {
      return false;
    }

    this.setState({
      panelAnimating: true,
      panelHeight: Dimensions.get("window").height
    });

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
      ),
      Animated.timing(
        // Animate over time
        this.state.backButtonOpacity, // The animated value to drive
        {
          toValue: 1,
          easing: Easing.out(Easing.bezier(0.76, 0.2, 0.84, 0.46)),
          useNativeDriver: true,
          duration: 500
        }
      )
    ]).start(this.onOpenPanel);
  }

  closePanelForInput() {
    // set closed state
    this.setState({
      inputOpen: false,
      panelAnimating: true
    });

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
      ),
      Animated.timing(
        // Animate over time
        this.state.backButtonOpacity, // The animated value to drive
        {
          toValue: 0,
          easing: Easing.out(Easing.bezier(0.76, 0.2, 0.84, 0.46)),
          useNativeDriver: true,
          duration: 500
        }
      )
    ]).start(this.onClosePanel);
  }

  onOpenPanel() {
    this.setState({ inputOpen: true, panelAnimating: false, addresses: [] });
  }

  onClosePanel() {
    this.setState({ panelAnimating: false });
  }

  onSelectAddress(text, index) {
    Keyboard.dismiss();

    // get data for the clicked address
    const data = this.state.addresses[index];

    // update map location
    this.props.onRegionChange({
      latitude: data.geometry.location.lat,
      longitude: data.geometry.location.lng,
      latitudeDelta: config.map.startLocation.latitudeDelta,
      longitudeDelta: config.map.startLocation.longitudeDelta
    });

    // call redux action for updating ordering state
    switch (this.props.ordering.currStep.id) {
      case "from":
        this.props.onUpdateOrderingData({
          fromAddress: text,
          fromData: data
        });
        break;
      case "to":
        this.props.onUpdateOrderingData({
          toAddress: text,
          toData: data
        });
        break;
    }

    // close input panel
    this.closePanelForInput();
  }

  /** 
   * Back from input panel click 
   */
  onBack() {
    Keyboard.dismiss();
    this.setState({
      inputOpen: false
    });
    this.closePanelForInput();
  }

  /**
   * Next button click
   */
  onNextStep() {
    // if (this.props.ordering.currStep.id === "from") {
    //   // next step will be to, so we are opening input panel immediately
    //   this.openPanelAddressInput();
    // }
    if (this.props.ordering.currStep.id === "time") return;
    this.props.onNextStep();
  }

  getExpandedAddressInput(width) {
    return (
      this.state.inputOpen && (
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

  getPrevStepButton() {
    return (
      !this.state.inputOpen &&
      this.props.ordering.currStepNo > 0 && (
        <TouchableHighlight
          onPress={this.props.onPrevStep}
          style={{
            position: "absolute",
            top: 50,
            left: 8,
            zIndex: 20
          }}
        >
          <Animated.Image
            source={require("../../assets/prev-step.png")}
            style={{
              width: 32,
              height: 32,
              opacity: this.state.buttonOpacity
            }}
          />
        </TouchableHighlight>
      )
    );
  }

  getBackPanelButton() {
    return this.state.inputOpen ? (
      <TouchableHighlight
        onPress={this.onBack}
        style={{ marginRight: "auto", marginLeft: 20 }}
      >
        <Animated.Image
          pointerEvents="none"
          source={require("../../assets/back.png")}
          style={{
            width: 32,
            height: 32,
            opacity: this.state.backButtonOpacity
          }}
        />
      </TouchableHighlight>
    ) : (
      <Animated.Image
        pointerEvents="none"
        source={require("../../assets/back.png")}
        style={{
          width: 32,
          marginLeft: 20,
          height: 32,
          marginRight: "auto",
          opacity: this.state.backButtonOpacity
        }}
      />
    );
  }

  render() {
    const width = Dimensions.get("window").width; //full width
    const height = Dimensions.get("window").height; //full width

    let title, value, action;

    switch (this.props.ordering.currStep.id) {
      case "from":
        title = this.props.ordering.currStep.title;
        value = this.props.ordering.fromAddress;
        action = this.props.ordering.currStep.action;
        break;
      case "to":
        title = this.props.ordering.currStep.title;
        value = this.props.ordering.toAddress;
        action = this.props.ordering.currStep.action;
        break;
      case "time":
        title = this.props.ordering.currStep.title;
        value = this.props.ordering.time;
        action = this.props.ordering.currStep.action;
        break;
    }

    return (
      <Animated.View
        style={{
          position: "absolute",
          top: Dimensions.get("window").height * 0.55,
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0)",
          width: width,
          height: this.state.panelHeight,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          transform: [{ translateY: this.state.panelTranslate }]
        }}
      >
        {/* Back button for previous steps */}
        {this.getPrevStepButton()}

        {/* Back icon for closing input panel */}
        {this.getBackPanelButton()}

        {/* White background of the panel */}
        <View
          style={{
            height: height,
            backgroundColor: "white",
            width: width,
            position: "absolute",
            top: 40
          }}
        />

        {/* Title of the panel */}
        <Animated.Text
          style={[
            styles.baseText,
            {
              paddingTop: 40,
              transform: [{ translateY: this.state.titleTranslate }]
            }
          ]}
        >
          {title}
        </Animated.Text>

        {/* Expanded address input view */}
        {this.getExpandedAddressInput(width)}

        {/* Value text for from, to address, time etc. ... can be clicked in steps that need action */}
        <Animated.Text
          onPress={() => {
            this.openPanelAddressInput();
          }}
          ellipsizeMode={"tail"}
          numberOfLines={1}
          style={[
            styles.baseText,
            styles.actionText,
            {
              width: 0.9 * width,
              textAlign: "center",
              textAlignVertical: "center",
              paddingTop: 10,

              opacity: this.state.buttonOpacity,
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
            { paddingTop: 30, opacity: this.state.buttonOpacity }
          ]}
          onPress={this.onNextStep}
        >
          {action}
        </Animated.Text>
      </Animated.View>
    );
  }
}

export default OrderVehicle;
