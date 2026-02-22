import Link from "next/link";

const features = [
  {
    title: "Collect Bots",
    description:
      "Mint and collect unique pixel art bots as NFTs. Each bot has distinct stats, abilities, and rarity tiers. Build the ultimate roster.",
    icon: "[ * ]",
    borderClass: "pixel-border",
    glowClass: "text-glow-green",
    color: "text-neon-green",
    bgAccent: "bg-neon-green/5",
  },
  {
    title: "Battle PvP",
    description:
      "Deploy your bots in real-time PvP arena battles. Strategize formations, exploit type advantages, and climb the ranks.",
    icon: "[/\\/]",
    borderClass: "pixel-border-purple",
    glowClass: "text-glow-purple",
    color: "text-neon-purple",
    bgAccent: "bg-neon-purple/5",
  },
  {
    title: "Earn HTSB",
    description:
      "Win matches to earn HTSB tokens. Stake your earnings, trade on the marketplace, and unlock exclusive arena rewards.",
    icon: "[$$$]",
    borderClass: "pixel-border-cyan",
    glowClass: "text-glow-cyan",
    color: "text-neon-cyan",
    bgAccent: "bg-neon-cyan/5",
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 text-center overflow-hidden scanlines">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Pixel art decorative line */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <span className="block h-1 w-8 bg-neon-green" />
            <span className="block h-1 w-4 bg-neon-green/60" />
            <span className="block h-1 w-2 bg-neon-green/30" />
            <span className="font-pixel text-[10px] text-neon-green/60 mx-2">
              ON BASE CHAIN
            </span>
            <span className="block h-1 w-2 bg-neon-green/30" />
            <span className="block h-1 w-4 bg-neon-green/60" />
            <span className="block h-1 w-8 bg-neon-green" />
          </div>

          {/* Main title */}
          <h1 className="font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neon-green text-glow-green mb-6 tracking-wider">
            HtsBots
            <br />
            <span className="text-neon-cyan text-glow-cyan">Arena</span>
          </h1>

          {/* Tagline */}
          <p className="font-pixel text-[10px] sm:text-xs text-gray-400 max-w-xl mx-auto mb-4 leading-relaxed">
            Build your bot army. Dominate the arena.
          </p>
          <p className="font-pixel text-[10px] sm:text-xs text-neon-purple text-glow-purple mb-12">
            Earn rewards.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link href="/arena" className="pixel-btn pixel-btn-primary text-xs sm:text-sm">
              Play Now
            </Link>
            <Link href="/marketplace" className="pixel-btn pixel-btn-secondary text-xs sm:text-sm">
              Marketplace
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 flex items-center justify-center gap-8 sm:gap-12">
            <div className="text-center">
              <p className="font-pixel text-sm sm:text-lg text-neon-green text-glow-green">
                ---
              </p>
              <p className="font-pixel text-[8px] text-gray-500 mt-1">
                Players
              </p>
            </div>
            <div className="h-8 w-px bg-arena-border" />
            <div className="text-center">
              <p className="font-pixel text-sm sm:text-lg text-neon-purple text-glow-purple">
                ---
              </p>
              <p className="font-pixel text-[8px] text-gray-500 mt-1">
                Battles
              </p>
            </div>
            <div className="h-8 w-px bg-arena-border" />
            <div className="text-center">
              <p className="font-pixel text-sm sm:text-lg text-neon-cyan text-glow-cyan">
                ---
              </p>
              <p className="font-pixel text-[8px] text-gray-500 mt-1">
                Bots Minted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-pixel text-lg sm:text-xl text-neon-green text-glow-green mb-4">
              How It Works
            </h2>
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className="block h-0.5 w-2 bg-arena-border"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`${feature.borderClass} ${feature.bgAccent} p-6 sm:p-8 card-hover bg-arena-card`}
              >
                {/* Step number */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`font-pixel text-[10px] ${feature.color} opacity-50`}>
                    0{index + 1}
                  </span>
                  <span className="h-px flex-1 bg-arena-border" />
                </div>

                {/* Icon */}
                <div className={`font-pixel text-2xl ${feature.color} ${feature.glowClass} mb-4`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className={`font-pixel text-sm ${feature.color} mb-3`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="font-mono text-xs text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-4xl pixel-border bg-arena-card p-8 sm:p-12 text-center">
          <h2 className="font-pixel text-sm sm:text-lg text-neon-green text-glow-green mb-4">
            Ready to Battle?
          </h2>
          <p className="font-mono text-xs text-gray-400 mb-8 max-w-md mx-auto">
            Connect your wallet, mint your first bot, and enter the arena.
            The battlefield awaits.
          </p>
          <Link href="/arena" className="pixel-btn pixel-btn-primary text-xs">
            Enter Arena
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-arena-border bg-arena-darker px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] text-neon-green text-glow-green">
                HtsBots Arena
              </span>
              <span className="font-mono text-[10px] text-gray-600">
                v0.1.0
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className="font-mono text-[10px] text-gray-500 hover:text-neon-cyan transition-colors"
              >
                Docs
              </a>
              <a
                href="#"
                className="font-mono text-[10px] text-gray-500 hover:text-neon-cyan transition-colors"
              >
                Discord
              </a>
              <a
                href="#"
                className="font-mono text-[10px] text-gray-500 hover:text-neon-cyan transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="font-mono text-[10px] text-gray-500 hover:text-neon-cyan transition-colors"
              >
                GitHub
              </a>
            </div>

            <p className="font-mono text-[8px] text-gray-600">
              Built on Base. Powered by pixels.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
