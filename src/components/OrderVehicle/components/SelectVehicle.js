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
    this.state = { searched: false };
  }

  componentWillReceiveProps(nextProps) {
    console.log("active", this.props.active);
    if (
      !this.state.searched &&
      !nextProps.isPrevAnimation &&
      !nextProps.isNextAnimation
    ) {
      this.props.onSearchForVehicle();
      this.setState({ searched: true });
    }
  }

  keyExtractor = (item, index) => index;

  renderItem = ({ item, index }) => (
    <SelectVehicleItem
      data={item}
      index={index}
      onPressItem={this.props.onSelectVehicle}
      onGetVehicleTime={this.props.onGetVehicleTime}
    />
    //  id={item.id}
    //  onPressItem={this._onPressItem}
    //  selected={!!this.state.selected.get(item.id)}
    //  title={item.title}
  );

  render() {
    console.log("render select vehicles ", this.props.availableVehicles);
    const { availableVehicles, inNextTransition } = this.props;

    if (inNextTransition) {
      return (
        <View
          style={{
            flex: 1,
            paddingTop: 48,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexWrap: "nowrap"
          }}
        >
          <SelectVehicleItem key={0} placeholder={true} index={0} />
          <SelectVehicleItem key={1} placeholder={true} index={1} />
          <SelectVehicleItem key={2} placeholder={true} index={2} />
        </View>
      );
    }
    console.log("not in next transition lognow");
    return (
      <View
        style={{
          flex: 1,
          paddingTop: 38
        }}
      >
        <FlatList
          horizontal={true}
          legacyImplementation={false}
          data={availableVehicles}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default SelectVehicle;
