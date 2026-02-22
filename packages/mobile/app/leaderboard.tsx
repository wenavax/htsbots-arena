import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";

const MOCK_RANKS = [
  { rank: 1, name: "0xDEAD...BEEF", wins: "---", elo: "---" },
  { rank: 2, name: "0xCAFE...BABE", wins: "---", elo: "---" },
  { rank: 3, name: "0xFACE...D00D", wins: "---", elo: "---" },
  { rank: 4, name: "----------", wins: "---", elo: "---" },
  { rank: 5, name: "----------", wins: "---", elo: "---" },
];

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "LEADERBOARD",
          headerTitleStyle: {
            fontFamily: "monospace",
            fontWeight: "bold",
            letterSpacing: 4,
          },
        }}
      />

      <View style={styles.content}>
        <Text style={styles.icon}>{"#"}</Text>
        <Text style={styles.title}>LEADERBOARD</Text>
        <Text style={styles.comingSoon}>COMING SOON</Text>
        <View style={styles.divider} />

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.rankCol]}>#</Text>
            <Text style={[styles.headerCell, styles.nameCol]}>PLAYER</Text>
            <Text style={[styles.headerCell, styles.statCol]}>W</Text>
            <Text style={[styles.headerCell, styles.statCol]}>ELO</Text>
          </View>

          {MOCK_RANKS.map((entry) => (
            <View key={entry.rank} style={styles.tableRow}>
              <Text style={[styles.cell, styles.rankCol, styles.rankText]}>
                {entry.rank}
              </Text>
              <Text style={[styles.cell, styles.nameCol, styles.nameText]}>
                {entry.name}
              </Text>
              <Text style={[styles.cell, styles.statCol]}>{entry.wins}</Text>
              <Text style={[styles.cell, styles.statCol]}>{entry.elo}</Text>
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
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  icon: {
    color: "#39FF14",
    fontSize: 36,
    fontFamily: "monospace",
    fontWeight: "900",
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
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
    marginBottom: 32,
  },
  table: {
    width: "100%",
    marginBottom: 32,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    marginBottom: 4,
  },
  headerCell: {
    color: "#39FF14",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#111111",
  },
  cell: {
    color: "#444444",
    fontSize: 12,
    fontFamily: "monospace",
  },
  rankCol: {
    width: 36,
  },
  nameCol: {
    flex: 1,
  },
  statCol: {
    width: 50,
    textAlign: "right",
  },
  rankText: {
    color: "#666666",
    fontWeight: "700",
  },
  nameText: {
    color: "#555555",
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
