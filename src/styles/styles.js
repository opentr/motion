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
    fontSize: 18,
    backgroundColor: "rgba(0,0,0,0)",
    color: config.colors.text
  },
  buttonText: {
    fontSize: 20,
    color: config.colors.primary
  },
  actionText: {
    fontSize: 20,
    color: config.colors.secondary
  },
  inputUnderline: {
    backgroundColor: config.colors.secondary,
    height: 2
  },
  ordering: {
    label: {
      marginTop: 10,
      marginBottom: 4,
      fontSize: 16,
      height: 22,
      color: config.colors.text,
      textAlignVertical: "top",
      textAlign: "left"
    },
    confirmationInfo: {
      fontSize: 20,
      height: 30,
      color: config.colors.secondary,
      textAlignVertical: "top",
      textAlign: "left"
    }
  }
};

export default styles;
