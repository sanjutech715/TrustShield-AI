import { ShieldCheck } from "lucide-react";

const links = [
  { label: "Analyzer", href: "#analyzer" },
  { label: "URL inspector", href: "#url-inspector" },
  { label: "Safety assistant", href: "#safety" },
  { label: "Dashboard", href: "#status" },
];

export default function Navbar({ backendOnline }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-void/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-glow to-azure-glow shadow-glow">
            <ShieldCheck className="h-5 w-5 text-void" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            TrustShield <span className="text-cyan-glow">AI</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-cyan-glow"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
          <span
            className={`h-2 w-2 rounded-full ${backendOnline ? "bg-risk-low" : "bg-risk-critical"}`}
            aria-hidden="true"
          />
          {backendOnline ? "Backend connected" : "Backend offline"}
        </div>
      </div>
    </header>
  );
}
