// app/(tabs)/goals.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

export default function Goals() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metas Financeiras</Text>
      <Text style={styles.subtitle}>
        Aqui você poderá criar e acompanhar suas metas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});