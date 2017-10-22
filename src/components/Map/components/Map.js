import React, { PureComponent } from "react";
import {
  Dimensions,
  InteractionManager,
  View,
  Text,
  Image,
  PermissionsAndroid,
  Platform
} from "react-native";
import MapView from "react-native-maps";
import PropTypes from "prop-types";
import { findWithAttr } from "../../../utils/search";

const equal = require("fast-deep-equal");
const timer = require("react-native-timer");

import config from "../../../config/config";
import styles from "../../../styles/styles";

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
    // this.onMapReady = this.onMapReady.bind(this);

    this.state = {
      mapExpanded: false,
      myPosition: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ordering.currStep.id === "traveling") {
      // expand map while user is traveling
      this.expandMap();
    } else {
      // return map back to normal
      this.contractMap();
    }
  }

  expandMap() {
    if (this.state.mapExpanded) return false;

    this.setState({
      mapExpanded: true
    });
  }

  contractMap() {
    if (!this.state.mapExpanded) return false;

    this.setState({
      mapExpanded: false
    });
  }

  componentDidMount() {
    this.startUpdating();
  }

  componentWillUnmount() {
    if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
    this.stopUpdating();
  }

  startUpdating() {
    // debounce loading of vehicles for 300ms
    this.props.onLoadVehicles();

    // timer.setTimeout(
    //   this,
    //   "getVehiclesFirst",
    //   () => {
    //     this.props.onLoadVehicles();
    //   },
    //   300
    // );

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
      150
    );
  }

  // onMapReady() {
  //   if (Platform.OS === "android") {
  //     PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     ).then(granted => {
  //       if (granted && this.mounted) this.watchLocation();
  //     });
  //   } else {
  //     this.watchLocation();
  //   }
  // }

  // watchLocation() {
  //   // eslint-disable-next-line no-undef
  //   this.watchID = navigator.geolocation.watchPosition(
  //     position => {
  //       const myLastPosition = this.state.myPosition;
  //       const myPosition = position.coords;
  //       if (!equal(myPosition, myLastPosition)) {
  //         this.setState({ myPosition });
  //       }
  //     },
  //     null,
  //     config.map.geolocation
  //   );
  // }

  render() {
    // console.log("render", this.state);

    const width = Dimensions.get("window").width; //full width
    const height = Dimensions.get("window").height; //full height

    const mapStyle = {
      position: "absolute",
      top: 0,
      width: width,
      height:
        height - config.ordering.height + (this.state.mapExpanded ? 100 : 0)
    };

    // const { myPosition } = this.state;
    // if (myPosition) {
    //   const heading = myPosition.heading;
    //   const rotate =
    //     typeof heading === "number" && heading >= 0 ? `${heading}deg` : null;
    // }

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
          {/* if we passed pick up step show pick up market */}
          {this.props.ordering.currStepNo > this.props.ordering.fromStepNo && (
            <MapView.Marker
              key={"fromMarker"}
              anchor={{ x: 0.5, y: 0.5 }}
              coordinate={{
                latitude: this.props.ordering.fromData.geometry.location.lat,
                longitude: this.props.ordering.fromData.geometry.location.lng
              }}
              style={{ zIndex: 1000 }}
              image={require("../../../assets/pinMap.png")}
            />
          )}
          {/* if we passed destination step show destination marker */}
          {this.props.ordering.currStepNo > this.props.ordering.toStepNo && (
            <MapView.Marker
              key={"toMarker"}
              anchor={{ x: 0.5, y: 1 }}
              style={{ zIndex: 1000 }}
              coordinate={{
                latitude: this.props.ordering.toData.geometry.location.lat,
                longitude: this.props.ordering.toData.geometry.location.lng
              }}
            >
              <View
                style={{
                  maxWidth: 160,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    backgroundColor: config.colors.secondary,
                    padding: 3
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{ color: "white", fontSize: 16, padding: 3 }}
                  >
                    {this.props.ordering.toAddress}
                  </Text>
                </View>
                <View
                  style={{
                    width: 3,
                    maxWidth: 3,
                    height: 10,
                    backgroundColor: config.colors.secondary
                  }}
                />
              </View>
            </MapView.Marker>
          )}
          {this.props.ordering.currStep.id !== "traveling" &&
            this.props.vehicles.map((vehicle, index) => (
              <MapView.Marker
                key={index}
                anchor={{ x: 0.5, y: 0.5 }}
                style={{
                  transform: [{ rotateZ: vehicle.heading + "deg" }],
                  opacity:
                    !this.state.mapExpanded ||
                    (this.state.mapExpanded &&
                      vehicle.id === this.props.ordering.selectedVehicle.id)
                      ? 1
                      : 0.1
                }}
                coordinate={{
                  latitude: vehicle.position.lat,
                  longitude: vehicle.position.lng
                }}
                image={require("../../../assets/car.png")}
              />
            ))}
          {this.props.ordering.route && (
            <MapView.Polyline
              coordinates={this.props.ordering.route}
              strokeWidth={2}
              strokeColor="red"
            />
          )}
          {this.state.myPosition && (
            <MapView.Marker
              key={index}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{
                transform: [{ rotateZ: vehicle.heading + "deg" }],
                opacity:
                  !this.state.mapExpanded ||
                  (this.state.mapExpanded &&
                    vehicle.id === this.props.ordering.selectedVehicle.id)
                    ? 1
                    : 0.1
              }}
              coordinate={{
                latitude: vehicle.position.lat,
                longitude: vehicle.position.lng
              }}
              image={require("../../../assets/car.png")}
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
              source={require("../../../assets/pinScaled.png")}
            />
          </View>
        )}
      </View>
    );
  }
}

export default Map;
