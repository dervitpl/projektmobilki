import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native';
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

  return (
    <SafeAreaView style={styles.container}>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          <StatusBar style="light" />
          <Text style={styles.title}>WORDLE</Text>

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
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 8,
  },
  map: {
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
});

export default App;
