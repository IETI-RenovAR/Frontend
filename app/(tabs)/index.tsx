import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function Index() {
  const router = useRouter();

  const handleSwipe = () => {
    router.push('/(tabs)/loginPage'); 
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={{ width: screenWidth * 0.8, height: screenWidth * 0.5, resizeMode: 'contain' }}
      />
      <Text style={styles.logo}>RenovAR</Text>
      <Text style={styles.slogan}>DONDE EL DISEÑO SE ENCUENTRA CON EL FUTURO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 34,
    fontFamily: 'Nunito-Bold',
  },
  slogan: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    marginTop: 10,
  },
  swipeArea: {
    marginTop: 40,
  },
  swipeText: {
    color: '#555',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
});
