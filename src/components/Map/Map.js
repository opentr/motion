import React, { PureComponent } from "react";
import MapView from "react-native-maps";
import PropTypes from "prop-types";
import config from "../../config/config";
import styles from "../../styles/styles";

class Map extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  render() {
    const { forceStartLocation, startLocation } = config.map;
    return (
      <MapView
        style={styles.map}
        initialRegion={forceStartLocation && startLocation}
      />
    );
  }
}

export default Map;
