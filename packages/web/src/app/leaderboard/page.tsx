import Link from "next/link";

const placeholderEntries = [
  { rank: 1, name: "CryptoWarrior.eth", wins: 142, losses: 23, rating: 2450, badge: ">>>" },
  { rank: 2, name: "BotMaster99.eth", wins: 128, losses: 31, rating: 2380, badge: ">>" },
  { rank: 3, name: "PixelKing.eth", wins: 115, losses: 28, rating: 2310, badge: ">" },
  { rank: 4, name: "ArenaHunter.eth", wins: 99, losses: 35, rating: 2150, badge: "-" },
  { rank: 5, name: "NeonBot.eth", wins: 87, losses: 42, rating: 2020, badge: "-" },
];

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return "text-neon-yellow";
    case 2:
      return "text-gray-300";
    case 3:
      return "text-amber-600";
    default:
      return "text-gray-500";
  }
}

function getRankGlow(rank: number): string {
  switch (rank) {
    case 1:
      return "text-shadow: 0 0 8px #DFFF00";
    case 2:
      return "text-shadow: 0 0 8px #C0C0C0";
    case 3:
      return "text-shadow: 0 0 8px #CD7F32";
    default:
      return "";
  }
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-pixel text-xl sm:text-2xl text-neon-cyan text-glow-cyan mb-4">
            Leaderboard
          </h1>
          <div className="coming-soon-badge inline-block mb-4">
            Coming Soon
          </div>
          <p className="font-mono text-xs text-gray-400 max-w-md mx-auto">
            The top bot commanders in the arena. Climb the ranks, earn
            glory, and cement your legacy on Base chain.
          </p>
        </div>

        {/* Season info */}
        <div className="pixel-border-cyan bg-arena-card p-4 mb-8 flex items-center justify-between">
          <div>
            <span className="font-pixel text-[8px] text-neon-cyan">Season 1</span>
            <p className="font-mono text-[10px] text-gray-500 mt-1">Pre-season Preview</p>
          </div>
          <div className="text-right">
            <span className="font-pixel text-[8px] text-gray-500">Prize Pool</span>
            <p className="font-pixel text-xs text-neon-green text-glow-green mt-1">TBD</p>
          </div>
        </div>

        {/* Leaderboard table */}
        <div className="pixel-border bg-arena-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b-2 border-arena-border bg-arena-darker">
            <span className="col-span-1 font-pixel text-[7px] text-gray-500">#</span>
            <span className="col-span-4 font-pixel text-[7px] text-gray-500">Player</span>
            <span className="col-span-2 font-pixel text-[7px] text-gray-500 text-center">W</span>
            <span className="col-span-2 font-pixel text-[7px] text-gray-500 text-center">L</span>
            <span className="col-span-3 font-pixel text-[7px] text-gray-500 text-right">Rating</span>
          </div>

          {/* Table rows */}
          {placeholderEntries.map((entry) => (
            <div
              key={entry.rank}
              className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-arena-border/50 hover:bg-arena-darker/50 transition-colors opacity-60"
            >
              <span
                className={`col-span-1 font-pixel text-[10px] ${getRankColor(entry.rank)}`}
                style={{ ...(entry.rank <= 3 ? { textShadow: getRankGlow(entry.rank).replace("text-shadow: ", "") } : {}) }}
              >
                {entry.badge}
              </span>
              <span className="col-span-4 font-mono text-[10px] text-gray-300 truncate">
                {entry.name}
              </span>
              <span className="col-span-2 font-mono text-[10px] text-neon-green text-center">
                {entry.wins}
              </span>
              <span className="col-span-2 font-mono text-[10px] text-red-400 text-center">
                {entry.losses}
              </span>
              <span className="col-span-3 font-pixel text-[10px] text-neon-cyan text-right">
                {entry.rating}
              </span>
            </div>
          ))}

          {/* Empty state message */}
          <div className="px-4 py-6 text-center">
            <p className="font-mono text-[10px] text-gray-600">
              Leaderboard data will populate when the arena goes live.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link href="/" className="pixel-btn pixel-btn-secondary text-[10px]">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
