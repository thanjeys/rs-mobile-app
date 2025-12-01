import { StyleSheet, Text, View } from "react-native";

export default function Activities() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities Create</Text>
      {/* Add your activities create form here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
});
