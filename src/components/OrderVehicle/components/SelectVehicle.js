import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  Animated,
  Easing,
  Image,
  FlatList
} from "react-native";

import SelectVehicleItem from "./SelectVehicleItem";

import config from "../../../config/config";
import styles from "../../../styles/styles";

class SelectVehicle extends PureComponent {
  static propTypes = {
    availableVehicles: PropTypes.array.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onSearchForVehicle();
  }

  keyExtractor = (item, index) => index;

  renderItem = ({ item, index }) => (
    <SelectVehicleItem
      data={item}
      index={index}
      onPressItem={this.props.onSelectVehicle}
    />
    //  id={item.id}
    //  onPressItem={this._onPressItem}
    //  selected={!!this.state.selected.get(item.id)}
    //  title={item.title}
  );

  render() {
    console.log("render select vehicles ", this.props.availableVehicles);
    const vehicles = this.props.availableVehicles;

    return (
      <View
        style={{
          flex: 1,
          paddingTop: 48
        }}
      >
        <FlatList
          horizontal={true}
          legacyImplementation={false}
          data={vehicles}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default SelectVehicle;
