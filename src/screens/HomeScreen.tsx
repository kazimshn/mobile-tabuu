import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = ({ navigation }: any) => {
  return (
    <LinearGradient colors={["#6A0572", "#ff6f61"]} style={styles.container}>
      <Image
        source={require("../assets/tabuuLogo.png")}
        style={{ width: "80%", height: "30%" }}
        resizeMode="contain"
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.shadow}
        onPress={() => navigation.navigate("Game")}
      >
        <LinearGradient
          colors={["#ff7e5f", "#feb47b"]} // Gradient Renkleri
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>Oyuna Başla</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 30 }} />

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.shadow}
        onPress={() => navigation.navigate("Settings")}
      >
        <LinearGradient
          colors={["#ff7e5f", "#feb47b"]} // Gradient Renkleri
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>Ayarlar</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default HomeScreen;
