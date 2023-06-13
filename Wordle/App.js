import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Button, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import SplashScreen from './SplashScreen';
import Keyboard from './src/components/Keyboard';
import { colors, CLEAR, ENTER, colorsToEmoji } from './src/constants';
import * as Clipboard from "expo-clipboard";

const NUMBER_OF_TRIES = 6;



const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

const getDayOfMonth = () => {
  const now = new Date();
  return now.getDate();
};


export default function App() {
  const dayOfMonth = getDayOfMonth();
  const [darkMode, setDarkMode] = useState(false);
  const words = [
    "cloud",
    "debug",
    "route",
    "error",
    "logic",
    "patch",
    "index",
    "pixel",
    "query",
    "array",
    "block",
    "input",
    "parse",
    "regex",
    "scope",
    "shell",
    "table",
    "audit",
    "click",
    "fetch",
    "print",
    "proxy",
    "check",
    "click",
    "logic",
    "learn",
    "print",
    "drive",
    "turbo",
    "speed",
    "wheel",
    "trunk",
    "brake",
    "tires",
    "shift",
    "truck",
  ];

  const word = words[dayOfMonth - 1];
  const letters = word ? word.split('') : [];
  
  
  const [showSplash, setShowSplash] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState("playing");
  
  

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);


  const checkGameState = () => {
    if (checkIfWon() && gameState !== "won") {
      Alert.alert("Brawo", "Wygrales!", [
        { text: "Udostepnij", onPress: shareScore },
      ]);
      setGameState("won");
    } else if (checkIfLost() && gameState !== "lost") {
      Alert.alert("Przegrales", "Sprobuj ponownie jutro!");
      setGameState("lost");
    }
  };

  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");
    const textToShare = `Wordle \n${textMap}`;
    Clipboard.setStringAsync(textToShare);
    Alert.alert("Skopiowane", "Pochwal sie wygrana na social mediach!");
  };

  const checkIfWon = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter === letters[i]);
  };

  const checkIfLost = () => {
    return !checkIfWon() && curRow === rows.length;
  };

  const onKeyPressed = (key) => {
    if (gameState !== "playing") {
      return;
    }

    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = "";
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }

      return;
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  const [showSettingsModal, setShowSettingsModal] = useState(false);


  const handleAboutPress = () => {
    setShowAboutModal(true);
  };

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const handleCloseModal = () => {
    setShowAboutModal(false);
    setShowSettingsModal(false);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const ToggleSwitch = ({ value, onToggle }) => {
    return (
      <TouchableOpacity
        style={[styles.switchContainer, { backgroundColor: value ? 'green' : 'red' }]}
        onPress={onToggle}
      >
        <Text style={styles.switchText}>{value ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>
    );
  };



  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: darkMode ? colors.black : colors.white,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: darkMode ? colors.darkgrey : colors.lightgrey,
    },
    title: {
      color: darkMode ? colors.lightgrey : colors.darkgrey,
      fontSize: 32,
      fontWeight: "bold",
      letterSpacing: 7,
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 5,
      marginLeft: 8,
    },
    buttonText: {
      color: colors.lightgrey,
      fontWeight: 'bold',
      fontSize: 16,
    },
    map: {
      alignSelf: "stretch",
      marginVertical: 20,
      backgroundColor: darkMode ? colors.black : colors.white,
    },
    row: {
      alignSelf: "stretch",
      flexDirection: "row",
      justifyContent: "center",
    },
    cell: {
      borderWidth: 3,
      borderColor: darkMode ? colors.lightgrey : colors.darkgrey,
      flex: 1,
      maxWidth: 70,
      aspectRatio: 1,
      margin: 3,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: darkMode ? colors.black : colors.white
    },
    cellText: {
      color: darkMode ? colors.lightgrey : colors.darkgrey,
      fontWeight: 'bold',
      fontSize: 28,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: darkMode ? colors.black : colors.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTitle: {
      color: darkMode ? colors.lightgrey : colors.darkgrey,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    modalText: {
      color: darkMode ? colors.lightgrey : colors.darkgrey,
      fontSize: 16,
      marginHorizontal: 20,
      marginBottom: 24,
      textAlign: 'center',
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
    },
    switchText: {
      color: darkMode ? colors.lightgrey : colors.darkgrey,
      fontSize: 16,
      marginRight: 10,
    },
  });


  return (
    <SafeAreaView style={styles.container}>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          <StatusBar style="light" />
          <View style={styles.header}>
            <Text style={styles.title}>WORDLE</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleAboutPress}>
                <Text style={styles.buttonText}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSettingsPress}>
                <Text style={styles.buttonText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
              <View
                key={`cell-${i}-${j}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.grey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                  },
                ]}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

          <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps} // ['a', 'b']
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />

          <Modal visible={showAboutModal} animationType="slide">
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>About</Text>
              <Text style={styles.modalText}>
              Wordle jest niezwykle prostą grą, polegającą na zgadywaniu słów. Raz dziennie pojawia się nowe, pięcioliterowe słowo, które należy odgadnąć w maksymalnie sześciu próbach. By przejść do kolejnego słowa, trzeba zaczekać do kolejnego dnia – zgodnie z założeniem autora, gra ma zabierać maksymalnie kilka minut dziennie, a szanse mają być równe dla wszystkich.
              
              Autorzy:
              Paweł Socha,
              Kacper Mucha,
              Robert Sternal 
              dzisiejsze slowo to : {word} ( tylko dla developerow ;) 
              </Text>
              <Button title="Close" onPress={handleCloseModal} />
            </View>
          </Modal>

          <Modal visible={showSettingsModal} animationType="slide">
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>Settings</Text>
      <View style={styles.switchContainer}>
  <Text style={styles.switchText}>Dark Mode</Text>
  <ToggleSwitch value={darkMode} onToggle={toggleDarkMode} />
  <Switch
           trackColor={{ false: '#767577', true: '#81b0ff' }}
           thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
           onValueChange={toggleDarkMode}
           value={darkMode}
          />
</View>
    <Button title="Close" onPress={handleCloseModal} />
  </View>
</Modal>
        </>
      )}
    </SafeAreaView>
  );
};



