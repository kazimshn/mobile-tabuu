import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      navigation.replace("Home");
    }, 3000);
  }, []);

  return (
    <LinearGradient colors={["#ff6f61", "#6A0572"]} style={styles.container}>
      <Animated.Image
        source={require("../assets/tabuuLogo.png")} // Logonuzun yolu
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffcc00",
  },
  logo: {
    width: "80%", // Logonun genişliği
  },
});

export default SplashScreen;
