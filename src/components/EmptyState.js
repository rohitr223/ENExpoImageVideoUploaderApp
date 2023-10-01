import { View, Text, StyleSheet } from "react-native";
import React from "react";
import HomeImg from "../../assets/images/HomeImg";

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <HomeImg />
      </View>
      <Text style={styles.title}>No image's uploaded yet!</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    aspectRatio: 1,
    width: 300,
    height: 120,
    backgroundColor: "red",
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 20,
  },
});
