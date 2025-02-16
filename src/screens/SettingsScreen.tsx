import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";
import { saveSoundSetting, loadSoundSetting } from "../utils/soundManager";
import { LinearGradient } from "expo-linear-gradient";

const SettingsScreen = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // **Ses ayarını ilk açıldığında yükle, yanlış güncelleme yapma!**
  useEffect(() => {
    const fetchSoundSetting = async () => {
      const savedSetting = await loadSoundSetting();
      if (savedSetting !== null) {
        setSoundEnabled(savedSetting); // Sadece eğer değişmişse güncelle
      }
    };
    fetchSoundSetting();
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    saveSoundSetting(newState);
  };

  return (
    <LinearGradient colors={["#6A0572", "#ff6f61"]} style={styles.container}>
      <Text style={styles.header}>Ayarlar</Text>

      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Ses Efektleri:</Text>
        <TouchableOpacity
          onPress={toggleSound}
          style={[
            styles.soundToggleButton,
            soundEnabled ? styles.soundOn : styles.soundOff,
          ]}
        >
          <Text style={styles.soundToggleText}>
            {soundEnabled ? "🔊 Açık" : "🔇 Kapalı"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SettingsScreen;
