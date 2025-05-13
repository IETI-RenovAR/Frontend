import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol'; // Asegúrate de que la ruta sea correcta

export default function HomeScreen() {
  const userName = "Laura";

  const options = [
    'Spaces',
    'Things',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSymbol name="house.fill" size={32} color="#000" style={styles.icon} />
        <Text style={styles.greeting}>Good morning, {userName}!</Text>
      </View>
      <Text style={styles.question}>What do you want to do today?</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.optionButton}
            onPress={() => console.log('Pressed:', option)}
          >
            <IconSymbol name="chevron.right" size={20} color="#666" style={styles.optionIcon} />
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  question: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
