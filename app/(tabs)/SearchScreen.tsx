import { ImageBackground, StyleSheet, View } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/carpenters.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Aquí irá el contenido de la pantalla */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
}); 