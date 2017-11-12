import React, { PureComponent } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";

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
      <View
        style={{
          maxWidth: 160,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          transform: [{ translateY: platformIOS ? -30 : 0 }]
        }}
      >
        <View
          style={{
            backgroundColor: backgroundColor,
            padding: 3,
            borderRadius: 5
          }}
        >
          {!loadingGeocoding ? (
            <Text
              numberOfLines={1}
              style={{
                color: "white",
                fontSize: region.latitudeDelta < 0.002 ? 14 : 16,
                padding: 3
              }}
            >
              {address}
            </Text>
          ) : (
            <View style={{ width: 160, paddingTop: 4, paddingBottom: 3 }}>
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
        </View>
        <View
          style={{
            width: 3,
            maxWidth: 3,
            height: 28,
            backgroundColor: backgroundColor
          }}
        />
      </View>
    );
  }
}

export default MapMarker;
