import React, { PureComponent } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";

import styles from "../../../styles/styles";

class MapMarker extends PureComponent {
  static propTypes = {
    platformIOS: PropTypes.bool.isRequired,
    region: PropTypes.object.isRequired,
    address: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    loadingGeocoding: PropTypes.bool
  };

  static defaultProps = {
    ...PureComponent.defaultProps,
    loadingGeocoding: false
  };

  render() {
    const {
      platformIOS,
      region,
      address,
      backgroundColor,
      loadingGeocoding
    } = this.props;

    return (
      <View style={styles.map.markerFromTo.holder}>
        <View
          style={[
            styles.map.markerFromTo.label,
            {
              backgroundColor: backgroundColor
            }
          ]}
        >
          {!loadingGeocoding ? (
            <Text
              numberOfLines={1}
              style={[
                styles.map.markerFromTo.labelText
                // {
                //   fontSize: region.latitudeDelta < 0.002 ? 14 : 16
                // }
              ]}
            >
              {address}
            </Text>
          ) : (
            <View style={styles.map.markerFromTo.activityHolder}>
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
        </View>
        <View
          style={[
            styles.map.markerFromTo.pinLine,
            {
              backgroundColor: backgroundColor
            }
          ]}
        />
      </View>
    );
  }
}

export default MapMarker;
