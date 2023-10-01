import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Svg, { Rect } from "react-native-svg";

const ProgressBar = ({ progress }) => {
  const barWidth = 230;
  const progressBarWidth = (progress / 100) * barWidth;
  return (
    <Svg width={barWidth} height="7">
      <Rect width={barWidth} height={"100%"} fill={"#EEE"} rx={3.5} ry={3.5} />
      <Rect
        width={progressBarWidth}
        height={"100%"}
        fill={"#3478f6"}
        rx={3.5}
        ry={3.5}
      />
    </Svg>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});
