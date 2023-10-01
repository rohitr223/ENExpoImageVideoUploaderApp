import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import { Video } from "expo-av";
import ProgressBar from "./ProgressBar";

const Uploading = ({ image, video, progress }) => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <VibrancyView
        blurType="ultraThinMaterialDark"
        style={[StyleSheet.absoluteFill]}
      ></VibrancyView>
      <BlurView style={styles.blurView} blurType="light">
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {video && (
          <Video
            source={{ uri: video }}
            style={styles.video}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            isLooping
            shouldPlay
            useNativeControls
          />
        )}
        <Text style={styles.title}>Uploading...</Text>
        <ProgressBar progress={progress} />
        <View style={styles.horizontalLine} />
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

export default Uploading;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  blurView: {
    width: "70%",
    alignItems: "center",
    paddingVertical: 16,
    rowGap: 12,
    borderRadius: 12,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 5,
  },
  video: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  horizontalLine: {
    height: 1,
    borderWidth: StyleSheet.hairlineWidth,
    width: "100%",
    borderColor: "#000",
  },
  btn: {
    backgroundColor: "red",
    padding: 8,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  btnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
