import { ArrowDownCircle, Globe2, ScanSearch, ShieldAlert } from "lucide-react";
import ParticleBackground from "./ParticleBackground.jsx";
import ShieldBrain from "./ShieldBrain.jsx";

const stats = [
  { icon: ScanSearch, label: "Signals checked per scan", value: "9 categories" },
  { icon: Globe2, label: "Languages understood", value: "EN · TA · Tanglish" },
  { icon: ShieldAlert, label: "Scoring model", value: "Explainable, rule-based" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <ParticleBackground />
        <div className="cyber-grid-bg absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/40 to-void" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 px-3 py-1 text-xs text-cyan-glow">
            Rule-based scam detection · explainable by design
          </span>

          <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Your digital safety starts here.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Paste any SMS, WhatsApp or email message and TrustShield AI breaks down the exact
            warning signals it finds, in plain English, Tamil, or Tanglish — so anyone, not just
            security experts, can tell a scam from a genuine message.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#analyzer"
              className="rounded-xl bg-gradient-to-r from-cyan-glow to-azure-glow px-6 py-3 text-sm font-semibold text-void shadow-glow transition hover:brightness-110"
            >
              Analyze a message
            </a>
            <a
              href="#url-inspector"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-glow/40 hover:text-white"
            >
              Inspect a URL
            </a>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass-card glass-border-glow rounded-xl p-4">
                <Icon className="h-5 w-5 text-cyan-glow" />
                <dd className="font-display mt-3 text-sm font-semibold text-white">{value}</dd>
                <dt className="mt-1 text-xs text-slate-400">{label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <ShieldBrain />
        </div>
      </div>

      <a
        href="#analyzer"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-1 text-xs text-slate-400 transition hover:text-cyan-glow md:flex"
      >
        <ArrowDownCircle className="h-4 w-4" />
        Scroll to the analyzer
      </a>
    </section>
  );
}
