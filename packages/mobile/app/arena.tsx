import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function ArenaScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "ARENA",
          headerTitleStyle: {
            fontFamily: "monospace",
            fontWeight: "bold",
            letterSpacing: 4,
          },
        }}
      />

      <View style={styles.content}>
        <Text style={styles.icon}>{"{ }"}</Text>
        <Text style={styles.title}>ARENA</Text>
        <Text style={styles.comingSoon}>COMING SOON</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          Deploy your bots into the arena and battle other players in real-time
          PvP strategy matches on-chain.
        </Text>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>IN DEVELOPMENT</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  icon: {
    color: "#39FF14",
    fontSize: 40,
    fontFamily: "monospace",
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 8,
    fontFamily: "monospace",
    marginBottom: 12,
  },
  comingSoon: {
    color: "#39FF14",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 6,
    fontFamily: "monospace",
    marginBottom: 24,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: "#333333",
    marginBottom: 24,
  },
  description: {
    color: "#666666",
    fontSize: 13,
    lineHeight: 22,
    textAlign: "center",
    fontFamily: "monospace",
    marginBottom: 32,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF9500",
  },
  statusText: {
    color: "#555555",
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: "monospace",
  },
});
