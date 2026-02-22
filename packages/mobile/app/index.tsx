import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerSection}>
        <Text style={styles.titleAccent}>{"< HtsBots />"}</Text>
        <Text style={styles.titleMain}>ARENA</Text>
        <Text style={styles.subtitle}>BLOCKCHAIN PvP STRATEGY</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>Deploy. Battle. Dominate.</Text>
      </View>

      <View style={styles.buttonSection}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonPrimary,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/arena")}
        >
          <Text style={styles.buttonTextPrimary}>PLAY</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonSecondary,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/marketplace")}
        >
          <Text style={styles.buttonTextSecondary}>MARKETPLACE</Text>
        </Pressable>

        <View style={styles.rowButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonOutline,
              styles.halfButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/leaderboard")}
          >
            <Text style={styles.buttonTextOutline}>RANKS</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonOutline,
              styles.halfButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.buttonTextOutline}>PROFILE</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>v0.1.0 // TESTNET</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 60,
  },
  titleAccent: {
    color: "#39FF14",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 4,
    marginBottom: 8,
    fontFamily: "monospace",
  },
  titleMain: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: 12,
    fontFamily: "monospace",
  },
  subtitle: {
    color: "#555555",
    fontSize: 11,
    letterSpacing: 6,
    marginTop: 8,
    fontFamily: "monospace",
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: "#39FF14",
    marginVertical: 20,
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  tagline: {
    color: "#39FF14",
    fontSize: 13,
    letterSpacing: 3,
    fontFamily: "monospace",
    opacity: 0.9,
  },
  buttonSection: {
    width: "100%",
    gap: 14,
  },
  button: {
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#39FF14",
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  buttonSecondary: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#39FF14",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333333",
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  buttonTextPrimary: {
    color: "#0A0A0A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 6,
    fontFamily: "monospace",
  },
  buttonTextSecondary: {
    color: "#39FF14",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 4,
    fontFamily: "monospace",
  },
  buttonTextOutline: {
    color: "#888888",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 3,
    fontFamily: "monospace",
  },
  rowButtons: {
    flexDirection: "row",
    gap: 14,
  },
  halfButton: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 48,
  },
  footerText: {
    color: "#333333",
    fontSize: 11,
    fontFamily: "monospace",
    letterSpacing: 2,
  },
});
