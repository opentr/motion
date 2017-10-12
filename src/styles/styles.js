import { StyleSheet } from "react-native";
import config from "../config/config";

const styles = {
  app: {
    ...StyleSheet.absoluteFillObject
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject
  },
  map: {},
  marker: {
    width: 10,
    height: 20
  },
  baseText: {
    fontSize: 20,
    backgroundColor: "rgba(0,0,0,0)",
    color: config.colors.text
  },
  buttonText: {
    fontSize: 30,
    color: config.colors.primary
  },
  actionText: {
    fontSize: 24,
    color: config.colors.secondary
  },
  inputUnderline: {
    backgroundColor: config.colors.secondary,
    height: 2
  }
};

export default StyleSheet.create(styles);
