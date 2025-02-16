import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

const soundFiles = {
  correct: require("../assets/sounds/correct.mp3"),
  wrong: require("../assets/sounds/wrong.mp3"),
  pass: require("../assets/sounds/pass.mp3"),
  timesup: require("../assets/sounds/timesup.mp3"),
};

let sound: Audio.Sound | null = null;
let soundEnabled = true; // Varsayılan olarak ses açık

// Ses durumunu AsyncStorage'e kaydet
export const saveSoundSetting = async (enabled: boolean) => {
  try {
    soundEnabled = enabled;
    await AsyncStorage.setItem("soundEnabled", JSON.stringify(enabled));
  } catch (error) {
    console.error("Ses ayarı kaydedilemedi:", error);
  }
};

// AsyncStorage'den ses ayarını yükle
export const loadSoundSetting = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("soundEnabled");
      return storedValue !== null ? JSON.parse(storedValue) : true; // Varsayılan olarak açık dön
    } catch (error) {
      console.error("Ses ayarı yüklenemedi:", error);
      return true; // Eğer hata olursa varsayılan olarak açık bırak
    }
  };
  

// Ses oynatma fonksiyonu
export const playSound = async (type: "correct" | "wrong" | "pass" | "timesup") => {
  if (!soundEnabled) return; // Eğer ses kapalıysa çalma

  try {
    if (sound) {
      await sound.unloadAsync();
    }

    sound = new Audio.Sound();
    await sound.loadAsync(soundFiles[type]);
    await sound.playAsync();
  } catch (error) {
    console.error("Ses oynatma hatası:", error);
  }
};
