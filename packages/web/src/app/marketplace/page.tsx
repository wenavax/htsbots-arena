import Link from "next/link";

const placeholderBots = [
  { name: "Scout-X1", rarity: "Common", price: "0.01", color: "neon-green" },
  { name: "Viper-Z3", rarity: "Rare", price: "0.05", color: "neon-purple" },
  { name: "Titan-A9", rarity: "Epic", price: "0.15", color: "neon-cyan" },
  { name: "Phantom-Q7", rarity: "Legendary", price: "0.50", color: "neon-pink" },
];

function getRarityBorder(color: string) {
  switch (color) {
    case "neon-green":
      return "pixel-border";
    case "neon-purple":
      return "pixel-border-purple";
    case "neon-cyan":
      return "pixel-border-cyan";
    default:
      return "pixel-border";
  }
}

export default function MarketplacePage() {
  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-pixel text-xl sm:text-2xl text-neon-purple text-glow-purple mb-4">
            Marketplace
          </h1>
          <div className="coming-soon-badge inline-block mb-4">
            Coming Soon
          </div>
          <p className="font-mono text-xs text-gray-400 max-w-md mx-auto">
            Browse, buy, and sell bots on the decentralized marketplace.
            Trade with other players and build your ultimate collection.
          </p>
        </div>

        {/* Filter bar placeholder */}
        <div className="pixel-border bg-arena-card p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-pixel text-[8px] text-gray-500">Filter:</span>
            {["All", "Common", "Rare", "Epic", "Legendary"].map((filter) => (
              <button
                key={filter}
                className="font-pixel text-[7px] px-2 py-1 border border-arena-border text-gray-500 hover:text-neon-green hover:border-neon-green/30 transition-colors"
                disabled
              >
                {filter}
              </button>
            ))}
          </div>
          <span className="font-pixel text-[8px] text-gray-600">
            0 items listed
          </span>
        </div>

        {/* Bot grid - placeholder cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {placeholderBots.map((bot) => (
            <div
              key={bot.name}
              className={`${getRarityBorder(bot.color)} bg-arena-card p-4 card-hover opacity-60`}
            >
              {/* Bot image placeholder */}
              <div className="aspect-square bg-arena-darker mb-4 flex items-center justify-center border border-arena-border">
                <pre className={`font-mono text-${bot.color} text-[10px] leading-tight`}>
{`  ___
 [o.o]
 |===|
 /| |\\`}
                </pre>
              </div>

              {/* Bot info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className={`font-pixel text-[10px] text-${bot.color}`}>
                    {bot.name}
                  </h3>
                  <span className={`font-pixel text-[7px] text-${bot.color} opacity-70`}>
                    {bot.rarity}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-arena-border">
                  <span className="font-mono text-[10px] text-gray-400">
                    Price
                  </span>
                  <span className="font-pixel text-[10px] text-neon-green">
                    {bot.price} ETH
                  </span>
                </div>
                <button
                  className="w-full font-pixel text-[8px] py-2 border-2 border-arena-border text-gray-500 cursor-not-allowed"
                  disabled
                >
                  Not Available
                </button>
              </div>
            </div>
          ))}
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
