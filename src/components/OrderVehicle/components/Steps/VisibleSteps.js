import React, { Component } from "react";
import PropTypes from "prop-types";

import { View } from "react-native";

class VisibleSteps extends Component {
  static propTypes = {};

  static defaultProps = {
    ...Component.defaultProps
  };

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
          height: height,
          flexDirection: slideOrder
        }}
      >
        {showFirstSlide && (
          <View
            key="first"
            style={{
              width: width,
              minHeight: 400
            }}
          >
            {renderStep(
              steps[firstSlideStep],
              firstSlideStep,
              inPrevTransition,
              inNextTransition
            )}
          </View>
        )}

        {showSecondSlide && (
          <View
            key="second"
            style={{
              width: width,
              minHeight: 400
            }}
          >
            {renderStep(
              steps[secondSlideStep],
              secondSlideStep,
              inPrevTransition,
              inNextTransition
            )}
          </View>
        )}
      </View>
    );
  }
}

export default VisibleSteps;
