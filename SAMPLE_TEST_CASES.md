# TrustShield AI — Sample Test Cases

These are the test cases used to validate the rule-based risk engine
and URL inspector. The automated versions of all of these live in
`backend/tests/test_risk_engine.py` (run with `pytest -v`); this
document is the human-readable version for a hackathon demo/judging
sheet or manual QA pass.

## Message Analyzer (`POST /api/analyze`)

| # | Input message (abridged) | Expected category | Expected key signals |
|---|---|---|---|
| 1 | "Dear Customer, your SBI account KYC is pending and will be blocked today. Share the OTP… http://sbi-kyc-verify.xyz/update" | **Critical** (score ≥ 75) | Fake KYC Update, Urgent OTP Request, Unknown/Shortened Link, Generic Greeting |
| 2 | "Congratulations! You are selected for a work from home job, earn Rs 4500 daily. Pay a small registration fee…" | **Medium–High** (score ≥ 25) | Unrealistic Job Offer, Suspicious Payment Request |
| 3 | "Hi Priya, this is a reminder for your dentist appointment tomorrow at 4:30 PM. Reply YES to confirm." | **Low** (score < 25) | none / no high-severity signals |
| 4 | "We need your net banking password and CVV to process a refund." | **Medium–High** | Password / Banking Detail Request |
| 5 | "Unga bank account-la problem irukku, OTP sollunga urgent-a verify pannunga illa account block aagum" (Tanglish) | Score > 0, `language_detected` = `tanglish` or `ta` | Urgent OTP Request |
| 6 | "You have won a lucky draw! Claim your prize now: bit.ly/claim123" | **Medium–High** | Fake Prize / Lottery, Unknown/Shortened Link |
| 7 | Empty string `""` | HTTP 422 validation error (message cannot be blank) | — |
| 8 | 5,000-character message | HTTP 422 validation error (exceeds 4000-char max) | — |

## URL Inspector (`POST /api/url-check`)

| # | Input URL | Expected caution level | Expected indicators |
|---|---|---|---|
| 1 | `http://paytm-kyc-verify.xyz/login` | **High–Critical** | brand_lookalike, risky_tld, no_https |
| 2 | `http://192.168.10.55/secure-login` | **High** | ip_hostname |
| 3 | `https://www.wikipedia.org/wiki/Phishing` | **Low** | none |
| 4 | `http://bit.ly/3xyzAB` | **Medium** | shortener |
| 5 | `http://sbi.co.in@evil-domain.ru/reset` | **High–Critical** | at_symbol |
| 6 | `http://login.secure.verify.account.example.com` | **Medium** | many_subdomains |

## Backend health / fallback behaviour

| # | Scenario | Expected behaviour |
|---|---|---|
| 1 | `GEMINI_API_KEY` unset | `/api/health` returns `ai_configured: false`; every `/api/analyze` response has `analyzer_used: "rule_based"` |
| 2 | `GEMINI_API_KEY` set but invalid/unreachable | `ai_gemini.generate_explanation()` catches the failure and returns `None`; response still succeeds with `analyzer_used: "rule_based"` (no crash, no fake AI claim) |
| 3 | Backend offline, frontend running | Frontend analyzer/inspector show a clear "could not reach the backend" message instead of silently failing |

## How to run the automated versions

```bash
cd backend
pip install -r requirements.txt
pip install pytest
pytest -v
```

All 8 automated tests above pass against the current engine (verified
during development — see `backend/tests/test_risk_engine.py`).
