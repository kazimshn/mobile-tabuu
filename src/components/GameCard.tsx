import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, ActivityIndicator } from "react-native";
import { styles } from "../styles/styles";

const GameCard = ({
  word,
  bannedWords,
}: {
  word: string;
  bannedWords: string[];
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true); // Yeni kelime gelince yüklenme başlasın
    slideAnim.setValue(300); // Kartı en sağa kaydır
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsLoading(false)); // Animasyon bitince spinner kaybolsun
  }, [word]);

  return (
    <Animated.View
      style={[styles.card, { transform: [{ translateX: slideAnim }] }]}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFD700" />
      ) : (
        <>
          <Text style={styles.mainWord}>{word}</Text>
          <View style={styles.bannedContainer}>
            {bannedWords.map((banned, index) => (
              <Text key={index} style={styles.bannedWord}>
                {banned}
              </Text>
            ))}
          </View>
        </>
      )}
    </Animated.View>
  );
};

export default GameCard;
