import React, { Component } from "react";
import PropTypes from "prop-types";

import { View } from "react-native";

class VisibleSteps extends Component {
  static propTypes = {};

  static defaultProps = {
    ...Component.defaultProps
  };

  constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
    // this.onLayoutFirst = this.onLayoutFirst.bind(this);
    // this.onLayoutSecond = this.onLayoutSecond.bind(this);
  }

  componentDidMount() {}

  onLayout(e) {
    console.log("on layout", e);
    this.props.onLayoutChange(e.nativeEvent.layout);
  }

  // onLayoutFirst(e) {
  //   console.log("on layout first", this.props, e);
  //   if (this.props.currStepSlide === "first") {
  //     this.onLayout(e);
  //   }
  // }
  // onLayoutSecond(e) {
  //   console.log("on layout second", this.props, e);
  //   if (this.props.currStepSlide === "second") {
  //     this.onLayout(e);
  //   }
  // }

  render() {
    // console.log("render VisibleSteps now", this.props);

    // {
    //   renderStep(
    //     steps[currStepNo - 1],
    //     currStepNo - 1,
    //     inPrevTransition,
    //     inNextTransition
    //   );
    // }

    const {
      currStepNo,
      currStepSlide,
      inPrevTransition,
      inNextTransition,
      width,
      height,
      totalWidth,
      renderStep,
      steps
    } = this.props;

    let slideOrder,
      showFirstSlide,
      showSecondSlide,
      firstSlideStep,
      secondSlideStep;

    if (inPrevTransition) {
      showFirstSlide = showSecondSlide = true;
      if (currStepSlide === "first") {
        slideOrder = "row";
        firstSlideStep = currStepNo;
        secondSlideStep = currStepNo + 1;
      } else {
        slideOrder = "row-reverse";
        firstSlideStep = currStepNo + 1;
        secondSlideStep = currStepNo;
      }
    } else if (inNextTransition) {
      showFirstSlide = showSecondSlide = true;
      if (currStepSlide === "first") {
        slideOrder = "row-reverse";
        firstSlideStep = currStepNo;
        secondSlideStep = currStepNo - 1;
      } else {
        slideOrder = "row";
        firstSlideStep = currStepNo - 1;
        secondSlideStep = currStepNo;
      }
    } else {
      showFirstSlide = currStepSlide === "first";
      showSecondSlide = currStepSlide === "second";
      if (showFirstSlide) firstSlideStep = currStepNo;
      if (showSecondSlide) secondSlideStep = currStepNo;
    }

    return (
      <View
        style={{
          width: width * 2,
          height: "auto",
          flexDirection: slideOrder
        }}
      >
        {showFirstSlide && (
          <View
            key="first"
            style={{
              width: width
            }}
            ref={first => (this.first = first)}
          >
            {renderStep(
              steps[firstSlideStep],
              firstSlideStep,
              currStepNo,
              inPrevTransition,
              inNextTransition,
              this.onLayout
            )}
          </View>
        )}

        {showSecondSlide && (
          <View
            key="second"
            ref={second => (this.second = second)}
            style={{
              width: width
            }}
          >
            {renderStep(
              steps[secondSlideStep],
              secondSlideStep,
              currStepNo,
              inPrevTransition,
              inNextTransition,
              this.onLayout
            )}
          </View>
        )}
      </View>
    );
  }
}

export default VisibleSteps;
