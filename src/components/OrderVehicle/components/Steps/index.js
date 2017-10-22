import React, { Component } from "react";
import PropTypes from "prop-types";
import { Animated, Easing, View } from "react-native";

import VisibleSteps from "./VisibleSteps";

const timer = require("react-native-timer");

class Steps extends Component {
  static propTypes = {
    totalSteps: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    currStepNo: PropTypes.number.isRequired,
    style: PropTypes.object,
    renderStep: PropTypes.func.isRequired
  };

  static defaultProps = {
    ...Component.defaultProps,
    style: {}
  };

  constructor(props) {
    super(props);

    const { currStepNo, width } = this.props;
    console.log("constructor props now state");
    this.state = {
      inPrevTransition: false,
      inNextTransition: false,
      viewTranslateX: new Animated.Value(0),
      /* which slide is current step using */
      currStepSlide: "first"
    };
  }

  componentWillReceiveProps(nextProps) {
    const { currStepNo, width } = this.props;
    console.log("nextProps now ", nextProps.currStepNo, currStepNo);

    if (nextProps.currStepNo !== currStepNo) {
      let stateUpdate = {};

      let inNextTransition = nextProps.currStepNo > currStepNo,
        inPrevTransition = nextProps.currStepNo < currStepNo;

      this.state.viewTranslateX.setValue(inPrevTransition ? -width : 0);

      this.setState(
        {
          inNextTransition: inNextTransition,
          inPrevTransition: inPrevTransition,
          currStepSlide:
            this.state.currStepSlide === "first" ? "second" : "first"
        },
        () => {
          Animated.timing(
            // Animate over time
            this.state.viewTranslateX, // The animated value to drive
            {
              toValue: inPrevTransition ? 0 : -width,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
              duration: 500
            }
          ).start(() => {
            console.log("finished now");
            this.setState({
              inPrevTransition: false,
              inNextTransition: false
            });
            this.state.viewTranslateX.setValue(0);
          });
        }
      );
    }
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  render() {
    const {
      style,
      totalSteps,
      currStepNo,
      width,
      height,
      renderStep
    } = this.props;

    const { inPrevTransition, inNextTransition } = this.state;

    console.log(
      "render slider now",
      totalSteps,
      inPrevTransition,
      inNextTransition
    );

    return (
      <Animated.View
        style={{
          ...style,
          /* view is maximum 2 widths of a slider since we can see at most 2 slides at the same time */
          width: 2 * width,
          position: "absolute",
          left: 0,
          top: 0,
          alignItems: "flex-start",
          transform: [{ translateX: this.state.viewTranslateX }]
        }}
      >
        <VisibleSteps
          currStepNo={currStepNo}
          width={width}
          totalWidth={totalSteps * width}
          inNextTransition={inNextTransition}
          inPrevTransition={inPrevTransition}
          renderStep={renderStep}
          steps={this.props.steps}
          currStepSlide={this.state.currStepSlide}
        />
      </Animated.View>
    );
  }
}

export default Steps;
