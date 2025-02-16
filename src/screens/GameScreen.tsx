import React, { useEffect, useState } from "react";
import { styles } from "../styles/styles";
import { View, Text, Button, TouchableOpacity, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GameCard from "../components/GameCard";
import CONFIG from "../config";
import CustomButton from "../components/CustomButton";
import { playSound, loadSoundSetting } from "../utils/soundManager";

const App = () => {
  useEffect(() => {
    loadSoundSetting();
  }, []);
  const [teams, setTeams] = useState<string[]>(["", ""]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [teamScores, setTeamScores] = useState([0, 0]);
  const [rounds, setRounds] = useState(5);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [wordData, setWordData] = useState<{
    word: string;
    banned: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [passCount, setPassCount] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<
    { team1: string; team2: string; score1: number; score2: number }[]
  >([]);
  const [gameMode, setGameMode] = useState<"Kolay" | "Klasik" | "Zor">(
    "Klasik"
  );
  const [usedWords, setUsedWords] = useState<string[]>([]);

  interface WordData {
    word: string;
    banned: string[];
  }

  const fetchWord = async (resetTimer = false) => {
    setLoading(true);
    try {
      let maxTries = 10;
      let data: WordData | null = null; // **Tipi belirttik!**

      while (maxTries > 0) {
        const response = await fetch(`${CONFIG.API_URL}?mode=${gameMode}`);
        const result = (await response.json()) as WordData;

        if (!result || !result.word || !Array.isArray(result.banned)) {
          throw new Error("Geçersiz JSON formatı!");
        }

        if (!usedWords.includes(result.word)) {
          data = result;
          break;
        }

        maxTries--;
      }

      if (!data) {
        console.warn("Tüm kelimeler kullanıldı! Kelime sıfırlanıyor...");
        return;
      }

      // **Null kontrolü ekledik!**
      setUsedWords((prevWords) => [...prevWords, data.word]);
      setWordData(data);

      if (resetTimer) {
        setTimeLeft(timeLimit);
        setIsTimerRunning(true);
        setPassCount(3);
      }
    } catch (error) {
      console.error("Hata oluştu:", error);
      setWordData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound("timesup");
      setIsTimerRunning(false);
      handleNextTurn();
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  //Doğru Cevap
  const handleCorrect = () => {
    playSound("correct");
    setTeamScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[currentTeamIndex] += 1;
      return updatedScores;
    });
    fetchWord(false);
  };

  //Yanlış Cevap
  const handleWrong = () => {
    playSound("wrong");
    setTeamScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[currentTeamIndex] -= 1;
      return updatedScores;
    });
    fetchWord(false);
  };

  //Pas geçme işlemi
  const handlePass = () => {
    if (passCount > 0) {
      playSound("pass");
      setPassCount((prevCount) => prevCount - 1);
      fetchWord(false);
    }
  };

  const handleNextTurn = () => {
    setIsTimerRunning(false); // Süreyi durdur

    if (currentTeamIndex === 0) {
      // Eğer şu an 1. takım oynadıysa, sırayı 2. takıma ver
      setCurrentTeamIndex(1);
      setTimeLeft(timeLimit);
    } else {
      // Eğer şu an 2. takım oynadıysa, turu artır ve tekrar 1. takıma geç
      if (currentRound < rounds) {
        setCurrentRound((prevRound) => prevRound + 1);
        setCurrentTeamIndex(0);
        setTimeLeft(timeLimit);
      } else {
        handleGameOver(); // Eğer tüm turlar tamamlandıysa oyunu bitir
        setUsedWords([]); // **Oyun tamamen bittiğinde kelime listesini sıfırla!**
      }
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    setIsGameStarted(false);

    // Eğer bu oyun zaten geçmişe eklenmişse tekrar ekleme!
    setGameHistory((prevHistory) => {
      const lastGame = prevHistory[prevHistory.length - 1];

      if (
        lastGame &&
        lastGame.team1 === teams[0] &&
        lastGame.team2 === teams[1] &&
        lastGame.score1 === teamScores[0] &&
        lastGame.score2 === teamScores[1]
      ) {
        return prevHistory; // Aynı oyun eklenmişse, tekrar ekleme
      }

      return [
        ...prevHistory,
        {
          team1: teams[0],
          team2: teams[1],
          score1: teamScores[0],
          score2: teamScores[1],
        },
      ];
    });

    if (teamScores[0] > teamScores[1]) {
      setWinner(teams[0]);
    } else if (teamScores[1] > teamScores[0]) {
      setWinner(teams[1]);
    } else {
      setWinner("Berabere!");
    }
  };

  const handleRestartGame = () => {
    setTeams(["", ""]);
    setTeamScores([0, 0]);
    setCurrentRound(1);
    setCurrentTeamIndex(0);
    setGameOver(false);
    setWinner(null);
    setIsGameStarted(false);
  };

  const handleStartGame = () => {
    if (teams[0] !== "" && teams[1] !== "" && rounds > 0 && timeLimit > 10) {
      setIsGameStarted(true);
      fetchWord(true);
    }
  };

  if (gameOver) {
    return (
      <LinearGradient colors={["#6A0572", "#ff6f61"]} style={styles.container}>
        <Text style={styles.winner}>
          {winner === "Berabere!" ? "Oyun Berabere!" : `Kazanan: ${winner} 🎉`}
        </Text>
        <Text style={styles.header}>📊 Skor Tablosu</Text>
        <Text style={styles.score}>
          🏆 {teams[0]}: {teamScores[0]} | {teams[1]}: {teamScores[1]}
        </Text>

        <Text style={styles.header}>📜 Oyun Geçmişi</Text>
        {gameHistory.map((game, index) => (
          <Text key={index} style={styles.historyItem}>
            {index + 1}. Maç: {game.team1} {game.score1} - {game.score2}{" "}
            {game.team2}
          </Text>
        ))}

        <CustomButton title="Tekrar Oyna" onPress={handleRestartGame} />
      </LinearGradient>
    );
  }

  if (!isTimerRunning && isGameStarted && !gameOver) {
    return (
      <LinearGradient colors={["#6A0572", "#ff6f61"]} style={styles.container}>
        <Text style={styles.header}>
          Sıradaki Takım: {teams[currentTeamIndex]}
        </Text>
        <CustomButton
          title="Oyunu Başlat"
          onPress={() => {
            setTimeLeft(timeLimit);
            setIsTimerRunning(true);
            fetchWord(true);
          }}
        />
      </LinearGradient>
    );
  }

  if (!isGameStarted) {
    return (
      <LinearGradient colors={["#6A0572", "#ff6f61"]} style={styles.container}>
        <Text style={styles.header}>Takım İsimlerini Girin</Text>
        <TextInput
          style={styles.input}
          maxLength={5}
          placeholder="Takım 1"
          placeholderTextColor="#BC88A3"
          value={teams[0]}
          onChangeText={(text) => setTeams([text, teams[1]])}
        />
        <TextInput
          style={styles.input}
          maxLength={5}
          placeholder="Takım 2"
          placeholderTextColor="#BC88A3"
          value={teams[1]}
          onChangeText={(text) => setTeams([teams[0], text])}
        />
        <View style={{ flexDirection: "row" }}>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => setRounds((prev) => (prev > 1 ? prev - 1 : 1))}
              style={styles.inputButton}
            >
              <Text style={styles.inputButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.inputValue}>{rounds}</Text>
            <TouchableOpacity
              onPress={() => setRounds((prev) => prev + 1)}
              style={styles.inputButton}
            >
              <Text style={styles.inputButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text> </Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() =>
                setTimeLimit((prev) => (prev > 60 ? prev - 10 : 60))
              }
              style={styles.inputButton}
            >
              <Text style={styles.inputButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.inputValue}>{timeLimit}</Text>
            <TouchableOpacity
              onPress={() => setTimeLimit((prev) => prev + 10)}
              style={styles.inputButton}
            >
              <Text style={styles.inputButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: "50%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.scoreText}>Tur</Text>
          <Text style={styles.scoreText}>Süre</Text>
        </View>
        <View style={{ height: 20 }} />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleStartGame}
          style={styles.shadow}
          disabled={!teams[0] || !teams[1]}
        >
          <LinearGradient
            colors={["#ff7e5f", "#feb47b"]} // Gradient Renkleri
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Oyunu Başlat</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* {gameHistory.length > 0 && (
          <Button
            title="🔄 Kaldığın Yerden Devam Et"
            onPress={() => setIsGameStarted(true)}
          />
        )} */}
        <View style={{ height: 20 }} />
        <Text style={styles.timer}>Oyun Modunu Seçin</Text>
        <View style={styles.buttonContainer}>
          <CustomButton title="Kolay" onPress={() => setGameMode("Kolay")} />
          <CustomButton title="Klasik" onPress={() => setGameMode("Klasik")} />
          <CustomButton title="Zor" onPress={() => setGameMode("Zor")} />
        </View>
        <View style={{ height: 20 }} />
        <Text style={styles.buttonText}>Seçilen Mod: {gameMode}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#ff6f61", "#6A0572"]} style={styles.container}>
      <View style={styles.scoreBoard}>
        <Text style={styles.scoreText}>
          {teams[0]}: {teamScores[0]} 🏆
        </Text>
        <Text style={styles.roundText}>
          Tur: {currentRound}/{rounds}
        </Text>
        <Text style={styles.scoreText}>
          {teams[1]}: {teamScores[1]} 🏆
        </Text>
      </View>

      <Text style={styles.team}>Sıra: {teams[currentTeamIndex]}</Text>

      {wordData && (
        <GameCard word={wordData.word} bannedWords={wordData.banned} />
      )}

      <View style={styles.bannedContainer}>
        <Text style={styles.timer}>Süre: {timeLeft} sn</Text>
        <Text style={styles.pass}>Pas Hakkı: {passCount}</Text>
        <View style={styles.buttonContainer}>
          <CustomButton title="✅ Doğru" onPress={handleCorrect} />
          <CustomButton title="❌ Tabu !" onPress={handleWrong} />
          <CustomButton
            title="⏩ Pas"
            onPress={handlePass}
            disabled={passCount === 0}
          />
        </View>
        <CustomButton
          title="Ana Menüye Dön"
          onPress={() => setIsGameStarted(false)}
        />
      </View>
    </LinearGradient>
  );
};

export default App;
