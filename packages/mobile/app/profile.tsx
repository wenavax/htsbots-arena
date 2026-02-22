import { View, Text, Pressable, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "PROFILE",
          headerTitleStyle: {
            fontFamily: "monospace",
            fontWeight: "bold",
            letterSpacing: 4,
          },
        }}
      />

      <View style={styles.content}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{"?"}</Text>
        </View>

        <Text style={styles.title}>COMMANDER</Text>
        <Text style={styles.walletLabel}>NO WALLET CONNECTED</Text>
        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>---</Text>
            <Text style={styles.statLabel}>BATTLES</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>---</Text>
            <Text style={styles.statLabel}>WINS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>---</Text>
            <Text style={styles.statLabel}>BOTS</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.connectButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            // TODO: Integrate wallet connect (WalletConnect / Privy / etc.)
          }}
        >
          <Text style={styles.connectButtonText}>CONNECT WALLET</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            // TODO: Navigate to settings
          }}
        >
          <Text style={styles.secondaryButtonText}>SETTINGS</Text>
        </Pressable>

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
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#39FF14",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarText: {
    color: "#39FF14",
    fontSize: 32,
    fontFamily: "monospace",
    fontWeight: "700",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 6,
    fontFamily: "monospace",
    marginBottom: 8,
  },
  walletLabel: {
    color: "#444444",
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: "monospace",
    marginBottom: 24,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: "#333333",
    marginBottom: 28,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  statBox: {
    width: 90,
    height: 70,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#1A1A1A",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    color: "#39FF14",
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "monospace",
    marginBottom: 4,
  },
  statLabel: {
    color: "#444444",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  connectButton: {
    width: "100%",
    backgroundColor: "#39FF14",
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#39FF14",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  connectButtonText: {
    color: "#0A0A0A",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 4,
    fontFamily: "monospace",
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  secondaryButtonText: {
    color: "#555555",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
    fontFamily: "monospace",
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
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
