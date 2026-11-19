# Design Notes

A short record of the deliberate choices behind TrustShield AI, for
anyone extending it or asked about it during judging.

## Why "heuristic indicator," not "probability"

A 0–100 score that looks like a calibrated probability invites people
to over-trust a number produced by keyword matching. Calling it a
heuristic indicator, pairing every score with the *signals* that
produced it, and repeating the disclaimer in the API response itself
(not just the UI) keeps the tool honest about what it actually knows:
"this text matches patterns we've seen in scams before," not "this is
X% likely to be fraud."

## Why rule-based first, AI second

The rule engine is deterministic, inspectable, and works completely
offline — which matters for a safety tool that should not go dark if
an API key expires or a network call times out. Gemini, when
configured, is only allowed to *rewrite the explanation text* on top
of signals the rule engine already found; it can never change the
score or invent a signal that wasn't detected. If the Gemini call
fails for any reason, the response silently and completely falls back
to the rule-based result — the user still gets a full, correct
answer, just without the AI-polished phrasing.

## Why the URL inspector never fetches the link

Opening a possibly-malicious URL from a security tool's own backend is
itself a risk (SSRF, drive-by content, tracking pixels confirming the
link was "live"). Restricting the check to the URL's *text* — hostname
shape, TLD, shorteners, punycode, `@` tricks — means the tool can
never accidentally become the thing that visits the phishing page.

## Why SQLite only stores a truncated preview

The dashboard's "scans so far" counters need *some* persistence, but
the actual message text pasted in often contains the very secrets this
tool is trying to protect (OTPs, account numbers, phone numbers). The
`analysis_log` table stores an 80-character preview — enough to show
"what kind of thing was scanned" in a recent-activity list — and
nothing more.

## Visual direction

The brief specified the palette and mood directly (dark navy/black,
electric blue/cyan/purple, glassmorphism, animated network particles,
a 3D shield + AI-brain hero), so the design pass followed that
direction rather than defaulting to a generic SaaS-card layout:

- **Color:** `#050810` base, `#0B1120`/`#111A2E` panel surfaces,
  `#22D3EE` (cyan) as the primary accent, `#3B82F6` (azure) and
  `#8B5CF6` (violet) as secondary accents, with a dedicated
  Low/Medium/High/Critical color scale (`#34D399` / `#FBBF24` /
  `#FB923C` / `#F43F5E`) used consistently for every risk-level badge,
  bar, and ring in the app.
- **Type:** Space Grotesk for display/headline text (a geometric,
  slightly technical face that fits a security-product identity
  without reaching for a cliché monospace "hacker" look), Inter for
  body and UI text.
- **Layout:** an asymmetric hero (copy left, 3D shield visual right)
  rather than a centered hero; an uneven 7/5 column split for the
  Analyzer vs. the Status/Safety sidebar, so the page reads as a
  working dashboard rather than a stack of identical cards.
- **The "3D shield"** is built from layered SVG + CSS 3D transforms
  (`perspective`, `translateZ`, a slow float animation) rather than a
  WebGL/three.js scene, so the project has zero GPU dependency and
  `npm install && npm run dev` just works on any machine — a
  deliberate trade-off for a hackathon demo environment. Swapping in a
  full three.js scene later is a drop-in replacement for
  `ShieldBrain.jsx` if you want to take it further.
