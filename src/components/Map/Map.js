import React, { PureComponent } from "react";
import { Dimensions, InteractionManager, View, Image } from "react-native";
import MapView from "react-native-maps";
import PropTypes from "prop-types";
import { findWithAttr } from "../../utils/search";

const timer = require("react-native-timer");

import config from "../../config/config";
import styles from "../../styles/styles";

class Map extends PureComponent {
  static propTypes = {
    onRegionChange: PropTypes.func.isRequired,
    onLoadVehicles: PropTypes.func.isRequired,
    region: PropTypes.object.isRequired,
    vehicles: PropTypes.array.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
    this.updateRegion = this.updateRegion.bind(this);
    this.startUpdating = this.startUpdating.bind(this);
    this.stopUpdating = this.stopUpdating.bind(this);
    this.restartUpdating = this.restartUpdating.bind(this);
  }

  componentDidMount() {
    this.startUpdating();
  }

  componentWillUnmount() {
    this.stopUpdating();
  }

  startUpdating() {
    // debounce loading of vehicles for 300ms
    timer.setTimeout(
      this,
      "getVehiclesFirst",
      () => {
        this.props.onLoadVehicles();
      },
      300
    );

    // add regular interval updating of vehicles
    timer.setInterval(
      this,
      "getVehicles",
      () => {
        this.props.onLoadVehicles();
      },
      config.api.openTransport.refreshInterval
    );
  }

  stopUpdating() {
    // console.log("stop updateing");

    // clear updating of vehicles
    timer.clearTimeout(this);
    timer.clearInterval(this);
  }

  restartUpdating() {
    // stop / clear updating
    this.stopUpdating();

    // start new updating
    this.startUpdating();
  }

  updateRegion(region) {
    console.log("updated region !!!", region);
    // call action for region change
    this.props.onRegionChange(region);

    // restart vehicle updating
    this.restartUpdating();

    // update address if from or to steps in ordering

    timer.setTimeout(
      this,
      "findNewAddress",
      () => {
        this.props.reverseGeocodeLocation();
      },
      300
    );
  }

  render() {
    // console.log("render", this.state);

    const width = Dimensions.get("window").width; //full width
    const height = Dimensions.get("window").height; //full height
    const mapStyle = {
      position: "absolute",
      top: 0,
      width: width,
      height: height * (1 - config.ordering.height) + 10
    };

    console.log("render", this.props.region);

    return (
      <View style={mapStyle}>
        <MapView
          style={mapStyle}
          initialRegion={this.props.region}
          region={this.props.region}
          showsCompass={false}
          showsBuildings={false}
          onRegionChange={this.updateRegion}
          onRegionChangeComplete={this.updateRegion}
          rotateEnabled={false}
        >
          {this.props.vehicles.map((vehicle, index) => (
            <MapView.Marker
              key={index}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{
                transform: [{ rotateZ: vehicle.heading + "deg" }]
              }}
              coordinate={{
                latitude: vehicle.position.lat,
                longitude: vehicle.position.lng
              }}
              image={require("../../assets/car.png")}
            />
          ))}
          {this.props.ordering.currStepNo > 0 && (
            <MapView.Marker
              key={"fromMarker"}
              anchor={{ x: 0.5, y: 0.5 }}
              coordinate={{
                latitude: this.props.ordering.fromData.geometry.location.lat,
                longitude: this.props.ordering.fromData.geometry.location.lng
              }}
              image={require("../../assets/pinMap.png")}
            />
          )}

          {this.props.ordering.currStepNo > 1 && (
            <MapView.Marker
              key={"toMarker"}
              anchor={{ x: 0.5, y: 0.5 }}
              coordinate={{
                latitude: this.props.ordering.toData.geometry.location.lat,
                longitude: this.props.ordering.toData.geometry.location.lng
              }}
              image={require("../../assets/pinMap.png")}
            />
          )}
        </MapView>
        {/* Show overlay map cursor only if you are choosing location, like from and to steps */}
        {(this.props.ordering.currStep.id === "from" ||
          this.props.ordering.currStep.id === "to") && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              height: mapStyle.height,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent"
            }}
          >
            <Image
              pointerEvents="none"
              source={require("../../assets/pinScaled.png")}
            />
          </View>
        )}
      </View>
    );
  }
}

export default Map;
