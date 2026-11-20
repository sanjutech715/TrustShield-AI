# TrustShield AI — Your Intelligent Digital Safety Companion

TrustShield AI is a hackathon prototype that helps ordinary people — not
just security experts — decide whether an SMS, WhatsApp, or email
message is likely to be a scam. Paste a message in and it returns an
**explainable** risk score: not just a number, but exactly which
warning signals fired and why, in English, Tamil, or Tanglish.

> **Important framing:** every score TrustShield AI produces is a
> **heuristic indicator from pattern matching** — not a calibrated
> probability and not proof that a message is or isn't fraud. It is a
> decision-support aid, not a verdict. See [`DESIGN_NOTES.md`](DESIGN_NOTES.md)
> for the reasoning behind that choice.

## What it does

1. **Smart Scam Analyzer** — paste a message, get a 0–100 risk score,
   a Low/Medium/High/Critical category, the specific signals detected
   (fake KYC, urgent OTP requests, credential phishing, job-offer
   scams, prize/lottery scams, payment pressure, urgency language…),
   and plain-language recommended actions.
2. **Suspicious URL Inspector** — paste a URL and get a structural,
   **offline** phishing-pattern check (lookalike domains, IP hosts,
   `@`-obfuscation, shorteners, risky TLDs, punycode, missing HTTPS).
   The URL is **never opened or visited**.
3. **Safety Assistant** — standing guidance (never share OTP/PIN/CVV,
   verify through official channels, avoid payment links) plus India's
   official cybercrime reporting channels (helpline **1930**,
   `cybercrime.gov.in`).
4. **Security Status Dashboard** — a local, anonymous running count of
   how many messages/URLs have been scanned and at what risk level,
   for the demo.
5. **Multilingual explanations** — English, Tamil, and Tanglish
   (romanized Tamil), selectable or auto-detected.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS, `framer-motion`-ready, `lucide-react` icons |
| Backend | Python 3.11+, FastAPI, Pydantic v2 |
| Database | SQLite (local file, stores only truncated previews — never full message text) |
| AI integration | Optional, modular Gemini layer (`backend/app/ai_gemini.py`) — **the app is fully functional without it** |
| Risk engine | Rule-based, transparent keyword/regex engine (`backend/app/risk_engine.py`) |

## Project structure

```
trustshield-ai/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── app/
│   │   ├── models.py             # Pydantic request/response schemas
│   │   ├── database.py           # SQLite helpers
│   │   ├── risk_engine.py        # Rule-based scam detector (core logic)
│   │   ├── url_inspector.py      # Pattern-based URL checker
│   │   ├── ai_gemini.py          # Optional Gemini explanation layer
│   │   ├── i18n.py                # EN / TA / Tanglish explanation strings
│   │   └── routers/
│   │       ├── analyze.py
│   │       ├── url_check.py
│   │       └── history.py
│   └── tests/
│       └── test_risk_engine.py   # pytest unit tests (8 cases, all passing)
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx
│       ├── api.js                # Axios client for the backend
│       ├── data/demoScenarios.js
│       └── components/           # Navbar, Hero, AnalyzerPanel, RiskResult,
│                                  # URLInspector, SafetyAssistant,
│                                  # SecurityStatusDashboard, ParticleBackground,
│                                  # ShieldBrain, Footer
├── postman/
│   └── TrustShield_AI.postman_collection.json
├── SAMPLE_TEST_CASES.md
├── DESIGN_NOTES.md
└── README.md   ← you are here
```

## Running it locally

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # edit if needed — works fine with all defaults
uvicorn main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

Run the test suite:

```bash
pip install pytest
pytest -v
```

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env             # defaults to http://localhost:8000
npm run dev
```

Open http://localhost:5173 — the Navbar shows a live "Backend
connected / offline" indicator so you can tell at a glance if the API
is reachable.

### 3. (Optional) Enabling the Gemini explanation layer

TrustShield AI works completely offline on the rule-based engine. If
you want Gemini to rewrite the plain-language explanation on top of
the signals the rule engine already found:

```bash
pip install google-genai           # already pinned in backend/requirements.txt
# in backend/.env:
GEMINI_API_KEY=your_key_here
```

`/api/health` reports whether the Gemini SDK and key are configured; it
does not test the key or network connection. An analysis response uses
`analyzer_used: "gemini"` only when a live Gemini call succeeds, otherwise
the rule-based engine remains authoritative. Gemini request failures are
logged by the backend.

### 4. API testing with Postman

Import `postman/TrustShield_AI.postman_collection.json`, set the
`base_url` variable (defaults to `http://localhost:8000`), and run the
requests — they correspond to the scenarios in `SAMPLE_TEST_CASES.md`.

## Demo scenarios (built into the frontend)

The Analyzer panel ships with three one-click sample messages:

1. **Fake bank KYC update** requesting an OTP — expect High/Critical.
2. **Fake job offer** requesting a registration fee — expect
   Medium/High.
3. **Normal appointment reminder** — expect Low (shown without ever
   claiming the message is guaranteed safe).

## Honest limitations (please read before a demo/judging round)

- The rule-based engine is a **starting signal set**, not an
  exhaustive one. It will miss novel scam wording it has no rule for,
  and it can flag unusual-but-legitimate messages (false positives).
  Judges asking "what about message X" is expected — that's exactly
  what the explainability panel is for: you can see *why* it scored
  the way it did and extend the rule set live if you want to.
- The URL inspector is **structural/offline only**. It deliberately
  never fetches the URL, and it says so in its own disclaimer — a
  clean result is not a safety guarantee, and a flagged result is not
  proof of malice.
- SQLite history stores only an 80-character truncated preview of each
  input, never the full message — this matters because real scam
  messages often contain OTPs, account numbers, etc. that shouldn't
  be persisted even locally.
- This is a hackathon prototype. It is **not** a certified fraud
  detector, and should not be the sole basis for a real financial or
  legal decision.

## License / attribution

Built for hackathon submission. Cyber-fraud reporting information
(helpline 1930, cybercrime.gov.in) refers to India's National Cyber
Crime Reporting Portal, run by the Indian Cyber Crime Coordination
Centre (I4C), Ministry of Home Affairs — verify current details on
their official site before citing them elsewhere.
