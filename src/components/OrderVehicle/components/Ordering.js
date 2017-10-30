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
  TouchableOpacity,
  InteractionManager
} from "react-native";
import PropTypes from "prop-types";

import Carousel from "react-native-snap-carousel";

import Login from "../../Login/";
import SelectFromToTime from "./SelectFromToTime/";
import SelectVehicle from "./SelectVehicle";
import Confirmation from "./Confirmation";
import Traveling from "./Traveling";
import Steps from "./Steps/";

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
      // flag to tell if we are in loading of booking statuses using API
      // API provides a list of booking statuses that then we handle in the app
      loadingBookingStatuses: false,
      /* is panel open/expanded for input */
      panelOpen: false,
      /* is panel opening/closing */
      panelAnimating: false,

      panelType: "address",
      /**
       * Animation values to be used on panel open/close
       */
      panelTranslate: new Animated.Value(0),
      titleTranslate: new Animated.Value(0),
      inputTranslate: new Animated.Value(0),
      buttonOpacity: new Animated.Value(1),
      backButtonOpacity: new Animated.Value(0),
      /* height of the ordering panel */
      panelHeight: 600
    };

    this.openPanel = this.openPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);

    this.onSelectAddress = this.onSelectAddress.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onNextStep = this.onNextStep.bind(this);
    this.getStep = this.getStep.bind(this);
    this.getStepsData = this.getStepsData.bind(this);
    this.getStepsSlider = this.getStepsSlider.bind(this);

    this.onLayoutChange = this.onLayoutChange.bind(this);

    // reference to ordering step component, will be set once the component is rendered
    this.orderingStep = false;
  }

  componentDidMount() {
    // load booking statuses using API
    if (
      !this.state.loadingBookingStatuses &&
      !this.props.ordering.BOOKING_STATUSES
    ) {
      this.setState({ loadingBookingStatuses: true });
      this.props.onLoadBookingStatuses();
    }

    this.onLayoutChange(this.props.ordering.currStep.height);
    this.props.onRecenterMap();
  }

  //
  componentWillReceiveProps(nextProps) {
    //console.log("ordering props debug now", this.props, nextProps);
    if (
      nextProps.ordering.BOOKING_STATUSES &&
      this.state.loadingBookingStatuses
    ) {
      // mark that booking statuses was loaded from the API
      this.setState({ loadingBookingStatuses: false });
    }

    if (nextProps.ordering.currStepNo !== this.props.ordering.currStepNo) {
      this.onLayoutChange(nextProps.ordering.currStep.height);
      if (nextProps.ordering.currStep.id === "traveling") {
        // close input panel
        this.closePanel();
      }
      if (
        nextProps.ordering.currStepNo < this.props.ordering.currStepNo ||
        nextProps.ordering.currStep.id === "time"
      )
        this.props.onRecenterMap();
    }

    if (nextProps.ordering.hidePanel !== this.props.ordering.hidePanel) {
      this.onLayoutChange(
        nextProps.ordering.hidePanel ? -20 : nextProps.ordering.currStep.height
      );
    }

    // if (nextProps.ordering.currStep.id === "confirmation") {
    //   this.openPanel(true);
    // } else if (nextProps.ordering.currStep.id === "vehicleSelect") {
    //   this.closePanel(true);
    // } else if (nextProps.ordering.currStep.id === "traveling") {
    //   this.closePanel(true);
    // } else if (
    //   this.props.ordering.currStep.id === "traveling" &&
    //   (nextProps.ordering.currStep.id === "from" ||
    //     nextProps.ordering.currStep.id === "to")
    // ) {
    //   this.setState({ panelHeight: config.ordering.height + 40 });
    //   //console.log("SET PANEK TRANSLATE debug now");
    //   this.state.panelTranslate.setValue(0);
    // }
  }

  onLayoutChange(height) {
    // let targetH = false;
    // switch (step) {
    //   case "from":
    //   case "to":
    //   case "time":
    //     targetH = 180;
    //     break;
    //   case "vehicleSelect":
    //     targetH = 240;
    //     break;
    //   case "confirmation":
    //   case "addressInput":
    //     targetH = 400;
    //     break;
    //   case "traveling":
    //     targetH = 70;
    //     break;
    // }

    // targetH = config.ordering.height - 85 - targetH;
    // if (targetH !== false)

    console.log("Height ", height);
    const delta = Platform.OS == "ios" ? 20 : 0;
    this.animatePanelHeight(-(height + 40) + delta);
  }

  animatePanelHeight(newHeight) {
    Animated.timing(
      // Animate over time
      this.state.panelTranslate, // The animated value to drive
      {
        toValue: newHeight,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
        duration: 200
      }
    ).start();
  }

  openPanel(type = "address") {
    if (this.state.panelOpen) return;

    this.setState({
      panelOpen: true,
      panelType: type
    });

    if (type === "address") {
      const height = Dimensions.get("window").height; //full width
      this.onLayoutChange(height * 0.75);
      if (this.orderingStep) this.orderingStep.resetAddressList();
    }

    // this.onLayoutChange("addressInput");

    // open panel for inputing address
    Animated.parallel([
      Animated.timing(
        // Animate over time
        this.state.titleTranslate, // The animated value to drive
        {
          toValue: -10,
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

  closePanel() {
    if (!this.state.panelOpen) return false;

    if (this.state.panelType === "address")
      this.onLayoutChange(this.props.ordering.currStep.height);

    // set closed state
    this.setState({
      panelOpen: false
    });

    Animated.parallel([
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
          duration: 300
        }
      ),
      Animated.timing(
        // Animate over time
        this.state.backButtonOpacity, // The animated value to drive
        {
          toValue: 0,
          easing: Easing.out(Easing.bezier(0.76, 0.2, 0.84, 0.46)),
          useNativeDriver: true,
          duration: 300
        }
      )
    ]).start(this.onClosePanel);
  }

  onOpenPanel() {
    this.setState({ panelOpen: true, panelAnimating: false });
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
      latitudeDelta:
        this.props.region.latitudeDelta || config.map.recenterZoom.from,
      longitudeDelta:
        this.props.region.longitudeDelta || config.map.recenterZoom.from
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
    this.closePanel();
    if (this.state.panelType === "confirmation") this.props.onPrevStep();
  }

  /**
   * Next button click
   */
  onNextStep() {
    this.props.onNextStep();
  }

  getRecenterButton() {
    return (
      <TouchableOpacity
        onPress={this.props.onRecenterMap}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 20
        }}
      >
        <Image
          source={require("../../../assets/recenter.png")}
          style={{
            width: 24,
            height: 24,
            opacity: 1
          }}
        />
      </TouchableOpacity>
    );
  }

  getBackPanelButton() {
    return this.state.panelOpen ? (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.onBack}
        style={{
          position: "absolute",
          top: 6,
          left: 6
        }}
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
          position: "absolute",
          top: 6,

          left: 6,
          width: 32,
          height: 32,
          marginRight: "auto",
          opacity: this.state.backButtonOpacity
        }}
      />
    );
  }
  getPrevStepButton() {
    return (
      this.props.user.loggedIn &&
      this.props.ordering.currStepNo > 2 &&
      this.props.ordering.currStepNo >= this.props.ordering.currStep.id !==
        "traveling" &&
      !this.state.panelOpen &&
      this.props.ordering.currStep.id !== "confirmation" &&
      this.props.ordering.currStepNo > 0 && (
        <TouchableOpacity
          onPress={this.props.onPrevStep}
          activeOpacity={0.8}
          style={{
            position: "absolute",
            top: 50,
            left: 6,
            zIndex: 20
          }}
        >
          <Animated.Image
            source={require("../../../assets/back.png")}
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

  getStep(step, stepNo, currStep, inPrevTransition, inNextTransition) {
    const currStepId = step.id;
    switch (currStepId) {
      case "loginStart":
        return (
          <Login
            key={stepNo}
            ref={step => (this.orderingStep = step)}
            {...step.data}
            inPrevTransition={inPrevTransition && currStep === stepNo}
            inNextTransition={inNextTransition && currStep === stepNo}
          />
        );
      case "loginButtons":
        return (
          <Login
            key={stepNo}
            showButtons={true}
            ref={step => (this.orderingStep = step)}
            {...step.data}
            inPrevTransition={inPrevTransition && currStep === stepNo}
            inNextTransition={inNextTransition && currStep === stepNo}
          />
        );
      case "from":
      case "to":
      case "time":
        return (
          <SelectFromToTime
            key={stepNo}
            ref={step => (this.orderingStep = step)}
            {...step.data}
            inPrevTransition={inPrevTransition && currStep === stepNo}
            inNextTransition={inNextTransition && currStep === stepNo}
          />
        );
        break;

      case "vehicleSelect":
        return (
          <SelectVehicle
            key={stepNo}
            {...step.data}
            isActive={currStep === stepNo}
            inPrevTransition={inPrevTransition && currStep === stepNo}
            inNextTransition={inNextTransition && currStep === stepNo}
          />
        );
        break;

      case "confirmation":
        return (
          <Confirmation
            key={stepNo}
            {...step.data}
            isActive={currStep === stepNo}
            inPrevTransition={inPrevTransition && currStep === stepNo}
            inNextTransition={inNextTransition && currStep === stepNo}
          />
        );
        break;
      case "traveling":
        return (
          <Traveling
            key={stepNo}
            {...step.data}
            inPrevTransition={inPrevTransition && currStep === stepNo}
            inNextTransition={inNextTransition && currStep === stepNo}
          />
        );
        break;
      default:
        break;
    }
  }

  getStepsData(currStepId, currStepNo, width) {
    return ORDERING_STEPS.slice(0).map((stepOrig, index) => {
      let step = Object.assign({}, stepOrig);
      switch (step.id) {
        case "loginStart":
        case "loginButtons":
          step.data = {
            width: width,
            stepId: step.id,
            onNextStep: this.onNextStep
          };
        case "from":
        case "to":
        case "time":
          step.data = {
            width: width,
            stepId: step.id,
            panelOpen: this.state.panelOpen,
            ordering: this.props.ordering,
            /* passing down animated props */
            animated: {
              titleTranslate: this.state.titleTranslate,
              inputTranslate: this.state.inputTranslate,
              buttonOpacity: this.state.buttonOpacity
            },
            onNextStep: this.onNextStep,
            openPanel: this.openPanel,
            onSelectAddress: this.onSelectAddress
          };
          break;
        case "vehicleSelect":
          step.data = {
            width: width,
            active:
              this.props.ordering.currStepNo ===
              this.props.ordering.vehicleSelectStepNo,
            availableVehicles: this.props.availableVehicles,
            searchingVehicles: this.props.ordering.searchingVehicles,
            onSearchForVehicle: this.props.onSearchForVehicle,
            onSelectVehicle: this.props.onSelectVehicle,
            onGetVehicleTime: this.props.onGetVehicleTime
          };
          break;
        case "confirmation":
          step.data = {
            width: width,
            fromAddress: this.props.ordering.fromAddress || "",
            toAddress: this.props.ordering.toAddress || "",
            vehicle: this.props.ordering.selectedVehicle || {},
            actionText: this.props.ordering.currStep.action,
            onConfirmBooking: this.props.onConfirmBooking,
            openPanel: this.openPanel
          };
          break;
        case "traveling":
          step.data = {
            width: width,
            getBookingUpdate: this.props.getBookingUpdate,
            onRecenterMap: this.props.onRecenterMap,
            onResetApp: this.props.onResetApp,
            simulateOrdering: this.props.simulateOrdering,
            booking: this.props.ordering.booking,
            toAddress: this.props.ordering.toAddress
          };
        default:
          break;
      }
      return step;
    });
  }

  getStepsSlider(currStepId, currStepNo, width) {
    let data = {};
    const stepsData = this.getStepsData(currStepId, currStepNo, width);

    //console.log("steps now", stepsData);

    return (
      <Steps
        style={{ marginTop: 35 }}
        width={width}
        height={this.state.panelHeight}
        currStepNo={currStepNo}
        totalSteps={ORDERING_STEPS.length}
        renderStep={this.getStep}
        steps={stepsData}
      />
    );
  }

  render() {
    //console.log("render ordering ", this.props.ordering);
    const width = Dimensions.get("window").width; //full width
    const height = Dimensions.get("window").height; //full width

    const currStepId = this.props.ordering.currStep.id;

    const { currStepNo } = this.props.ordering;

    return (
      <Animated.View
        style={{
          position: "absolute",
          top: height - 1,
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0)",
          width: width,
          height: this.state.panelHeight,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          transform: [{ translateY: this.state.panelTranslate }]
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 40,
            width: width,
            backgroundColor: "white",
            height: height
          }}
        />

        {/* Back button for previous steps */}
        {this.getPrevStepButton()}

        {/* Back icon for closing input panel */}
        {this.getBackPanelButton()}

        {/* Button to recenter map with context  */}
        {this.getRecenterButton()}

        {/* steps container */}
        {this.getStepsSlider(currStepId, currStepNo, width)}
      </Animated.View>
    );
  }
}

export default Ordering;
