import { KeyRound, Landmark, Link2Off, PhoneCall, ShieldQuestion } from "lucide-react";

const tips = [
  {
    icon: KeyRound,
    title: "Never share OTP, PIN, CVV, or passwords",
    body: "No genuine bank, government department, or company will ever call, SMS, or email you asking for these.",
  },
  {
    icon: ShieldQuestion,
    title: "Verify through official channels",
    body: "If a message claims to be from your bank or a government body, call the number printed on your card or their official website — never a number given inside the message.",
  },
  {
    icon: Link2Off,
    title: "Avoid unknown payment links",
    body: "Don't tap links asking you to 'confirm', 'unlock', or 'refund' a payment. Open your banking app directly instead.",
  },
  {
    icon: Landmark,
    title: "Know the difference: KYC vs. phishing",
    body: "Real KYC updates happen in person at a branch or inside your bank's verified app — never through a link texted to you.",
  },
];

export default function SafetyAssistant() {
  return (
    <div id="safety" className="glass-card glass-border-glow rounded-2xl p-5 sm:p-7">
      <h3 className="font-display text-xl font-semibold text-white">Safety Assistant</h3>
      <p className="mt-1 text-sm text-slate-400">Practical habits that stop most scams before they start.</p>

      <ul className="mt-5 space-y-4">
        {tips.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-glow/10">
              <Icon className="h-4 w-4 text-cyan-glow" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-100">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-risk-critical/25 bg-risk-critical/5 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-risk-critical">
          <PhoneCall className="h-4 w-4" />
          Already shared details or lost money?
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          Call the national cyber-fraud helpline <strong className="text-white">1930</strong> right
          away (available 24×7, India) and file a complaint at{" "}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-glow underline decoration-dotted"
          >
            cybercrime.gov.in
          </a>
          . Acting within the first hour gives banks the best chance of freezing a fraudulent
          transfer.
        </p>
      </div>
    </div>
  );
}
