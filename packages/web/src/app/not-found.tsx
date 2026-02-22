export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="font-pixel text-4xl text-neon-green mb-4">404</h1>
        <p className="font-pixel text-sm text-gray-400 mb-8">Page not found</p>
        <a
          href="/"
          className="font-pixel text-xs text-neon-cyan hover:text-neon-green transition-colors"
        >
          {"<< Back to Home"}
        </a>
      </div>
    </div>
  );
}
