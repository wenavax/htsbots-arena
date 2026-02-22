import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function MarketplaceScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "MARKETPLACE",
          headerTitleStyle: {
            fontFamily: "monospace",
            fontWeight: "bold",
            letterSpacing: 4,
          },
        }}
      />

      <View style={styles.content}>
        <Text style={styles.icon}>{"[ $ ]"}</Text>
        <Text style={styles.title}>MARKETPLACE</Text>
        <Text style={styles.comingSoon}>COMING SOON</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          Trade bots, upgrades, and rare components on the decentralized
          marketplace. All assets are on-chain NFTs.
        </Text>

        <View style={styles.previewGrid}>
          {["BOTS", "PARTS", "SKINS", "ITEMS"].map((label) => (
            <View key={label} style={styles.previewCard}>
              <Text style={styles.previewCardText}>{label}</Text>
              <Text style={styles.previewCardSub}>---</Text>
            </View>
          ))}
        </View>

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
    fontSize: 32,
    fontFamily: "monospace",
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 6,
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
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 32,
  },
  previewCard: {
    width: 80,
    height: 80,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  previewCardText: {
    color: "#444444",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    fontFamily: "monospace",
    marginBottom: 4,
  },
  previewCardSub: {
    color: "#333333",
    fontSize: 11,
    fontFamily: "monospace",
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
