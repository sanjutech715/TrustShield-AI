export default function ShieldBrain() {
  return (
    <div className="shield-stage relative mx-auto flex h-[360px] w-[360px] items-center justify-center sm:h-[440px] sm:w-[440px]">
      {/* Pulsing detection rings */}
      <span className="pulse-ring absolute h-56 w-56 rounded-full border border-cyan-glow/40" />
      <span
        className="pulse-ring absolute h-56 w-56 rounded-full border border-violet-glow/30"
        style={{ animationDelay: "1.1s" }}
      />

      <div className="shield-3d relative h-72 w-72 sm:h-80 sm:w-80">
        {/* Back layer: soft ambient glow */}
        <div
          className="shield-layer-back glow-breathe absolute inset-0 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.35), rgba(139,92,246,0.12) 60%, transparent 75%)" }}
        />

        {/* Mid layer: the shield outline */}
        <svg
          viewBox="0 0 200 220"
          className="shield-layer-mid absolute inset-0 h-full w-full drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <path
            d="M100 8 L182 40 V104 C182 156 148 196 100 212 C52 196 18 156 18 104 V40 Z"
            fill="rgba(17,26,46,0.55)"
            stroke="url(#shieldGrad)"
            strokeWidth="3"
          />
        </svg>

        {/* Front layer: neural network / "AI brain" nodes inside the shield */}
        <svg viewBox="0 0 200 220" className="shield-layer-front absolute inset-0 h-full w-full">
          <g stroke="#8B5CF6" strokeOpacity="0.55" strokeWidth="1.2">
            <line x1="70" y1="70" x2="100" y2="50" />
            <line x1="100" y1="50" x2="132" y2="72" />
            <line x1="70" y1="70" x2="78" y2="110" />
            <line x1="132" y1="72" x2="126" y2="112" />
            <line x1="78" y1="110" x2="100" y2="140" />
            <line x1="126" y1="112" x2="100" y2="140" />
            <line x1="78" y1="110" x2="126" y2="112" />
            <line x1="100" y1="50" x2="100" y2="140" strokeDasharray="2 4" />
          </g>
          <g fill="#E6EDF7">
            {[
              [100, 50],
              [70, 70],
              [132, 72],
              [78, 110],
              [126, 112],
              [100, 140],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i === 5 ? 6 : 4} fill={i === 5 ? "#22D3EE" : "#C4D3F0"} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
