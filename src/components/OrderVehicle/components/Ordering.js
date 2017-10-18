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
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";

import SelectFromToTime from "./SelectFromToTime";
import SelectVehicle from "./SelectVehicle";
import Confirmation from "./Confirmation";

import config from "../../../config/config";
import styles from "../../../styles/styles";

import { ORDERING_STEPS } from "../../../store/orderingReducer";

class Ordering extends PureComponent {
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
      panelOpen: false,
      /* is panel opening/closing */
      panelAnimating: false,

      /**
       * Animation values to be used on panel open/close
       */
      panelTranslate: new Animated.Value(0),
      titleTranslate: new Animated.Value(0),
      inputTranslate: new Animated.Value(0),
      buttonOpacity: new Animated.Value(1),
      backButtonOpacity: new Animated.Value(0),
      /* height of the ordering panel */
      panelHeight: config.ordering.height + 40
    };

    this.openPanel = this.openPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);

    this.onSelectAddress = this.onSelectAddress.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onNextStep = this.onNextStep.bind(this);

    // reference to ordering step component, will be set once the component is rendered
    this.orderingStep = false;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.ordering.currStep.id === "confirmation") {
      this.openPanel(true);
    } else if (nextProps.ordering.currStep.id === "vehicleSelect") {
      this.closePanel(true);
    }
  }

  openPanel(force) {
    // check if panel is on from or to step, if not do not open address input
    if (
      !force &&
      !this.state.panelAnimating &&
      !this.state.openPanel &&
      (this.props.ordering.currStep.id !== "from" &&
        this.props.ordering.currStep.id !== "to" &&
        this.props.ordering.currStep.id !== "confirmation")
    ) {
      return false;
    }

    this.setState({
      panelAnimating: true,
      panelHeight: Dimensions.get("window").height
    });

    // determine top position for the panel
    // slightly closer to the top on address input
    // and bit more far away from top for confirmation step
    const targetTranslatePanel =
      -(Dimensions.get("window").height - 270) +
      (this.props.ordering.currStep.id === "confirmation" ? 180 : 80);

    if (this.props.ordering.currStep.id === "confirmation") {
      // open panel for confirmation
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
        )
      ]).start(this.onOpenPanel);
    } else {
      // open panel for inputing address

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
  }

  closePanel() {
    if (this.state.panelAnimating || this.state.openPanel) return false;

    // set closed state
    this.setState({
      panelOpen: false,
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
    this.setState({ panelOpen: true, panelAnimating: false });

    // reset addresses list when panel is opened, call component method for reset
    if (
      this.orderingStep &&
      (this.props.ordering.currStep.id === "from" ||
        this.props.ordering.currStep.id === "to")
    ) {
      this.orderingStep.resetAddressList();
    }
  }

  onClosePanel() {
    this.setState({ panelAnimating: false });
  }

  onSelectAddress(text, data) {
    Keyboard.dismiss();

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
    this.closePanel();
  }

  /** 
   * Back from input panel click 
   */
  onBack() {
    Keyboard.dismiss();
    this.setState({
      panelOpen: false
    });
    this.closePanel();
  }

  /**
   * Next button click
   */
  onNextStep() {
    this.props.onNextStep();
  }

  getPrevStepButton() {
    return (
      (!this.state.panelOpen ||
        this.props.ordering.currStep.id === "confirmation") &&
      this.props.ordering.currStepNo > 0 && (
        <TouchableOpacity
          onPress={this.props.onPrevStep}
          activeOpacity={1}
          style={{
            position: "absolute",
            top: 50,
            left: 8,
            zIndex: 20
          }}
        >
          <Animated.Image
            source={require("../../../assets/prev-step.png")}
            style={{
              width: 32,
              height: 32,
              opacity: this.state.buttonOpacity
            }}
          />
        </TouchableOpacity>
      )
    );
  }

  getBackPanelButton() {
    return this.state.panelOpen ? (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.onBack}
        style={{ marginRight: "auto", marginLeft: 20 }}
      >
        <Animated.Image
          pointerEvents="none"
          source={require("../../../assets/back.png")}
          style={{
            width: 32,
            height: 32,
            opacity: this.state.backButtonOpacity
          }}
        />
      </TouchableOpacity>
    ) : (
      <Animated.Image
        pointerEvents="none"
        source={require("../../../assets/back.png")}
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

  /**
   * get current step display 
   */
  getStep(currStepId, width) {
    {
      /* if steps are from, to or time show Ordering step for from to and time */
    }
    switch (currStepId) {
      case "from":
      case "to":
      case "time":
        return (
          <SelectFromToTime
            width={width}
            ordering={this.props.ordering}
            panelOpen={this.state.panelOpen}
            /* passing down animated props */
            animated={{
              titleTranslate: this.state.titleTranslate,
              inputTranslate: this.state.inputTranslate,
              buttonOpacity: this.state.buttonOpacity
            }}
            onNextStep={this.onNextStep}
            openPanel={this.openPanel}
            onSelectAddress={this.onSelectAddress}
            ref={instance => {
              this.orderingStep = instance;
            }}
          />
        );
        break;

      case "vehicleSelect":
        return (
          <SelectVehicle
            width={width}
            availableVehicles={this.props.availableVehicles}
            onSearchForVehicle={this.props.onSearchForVehicle}
            onSelectVehicle={this.props.onSelectVehicle}
          />
        );
        break;

      case "confirmation":
        return (
          <Confirmation
            fromAddress={this.props.ordering.fromAddress}
            toAddress={this.props.ordering.toAddress}
            vehicle={this.props.ordering.selectedVehicle}
            onConfirmBooking={() => {}}
            price={15}
          />
        );
        break;

      default:
        break;
    }
  }

  render() {
    console.log("render ordering ", this.props.ordering);
    const width = Dimensions.get("window").width; //full width
    const height = Dimensions.get("window").height; //full width

    const currStepId = this.props.ordering.currStep.id;

    return (
      <Animated.View
        style={{
          position: "absolute",
          top: height - config.ordering.height - 40,
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

        {/* get current step */}
        {this.getStep(currStepId, width)}
      </Animated.View>
    );
  }
}

export default Ordering;
