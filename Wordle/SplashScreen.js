import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/splash-screen.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
  },
});

export default SplashScreen;
