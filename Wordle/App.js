import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from './SplashScreen';
import Keyboard from './src/components/Keyboard';
import { colors, CLEAR, ENTER } from './src/constants';

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

const App = () => {
  const word = "hello";
  const letters = word.split('');

  const [showSplash, setShowSplash] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  const onKeyPressed = (key) => {
    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][curCol] = "";
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

  const handleAboutPress = () => {
    setShowAboutModal(true);
  };

  const handleSettingsPress = () => {
    // Obsługa naciśnięcia przycisku "settings"
    console.log("Pressed Settings");
  };

  const handleCloseModal = () => {
    setShowAboutModal(false);
  };

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
                        borderColor: isCellActive(i, j) ? colors.grey : colors.darkgrey,
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
            greenCaps={getAllLettersWithColor(colors.primary)}
            yellowCaps={getAllLettersWithColor(colors.secondary)}
            greyCaps={getAllLettersWithColor(colors.darkgrey)}
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
              </Text>
              <Button title="Close" onPress={handleCloseModal} />
            </View>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 8,
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
    flex: 1,
    marginVertical: 20,
    alignSelf: 'stretch',
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    margin: 3,
    aspectRatio: 1,
    maxWidth: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.lightgrey,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    color: colors.lightgrey,
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default App;
