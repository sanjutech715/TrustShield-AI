"""
Rule-based risk engine — the always-available, offline analyzer.

This is intentionally a transparent, inspectable set of keyword/regex
rules rather than a black box: every signal that fires can point to the
exact phrase that triggered it, which is what makes the output
"explainable" rather than a bare number.

IMPORTANT: this is a heuristic demo analyzer for a hackathon prototype.
It is a starting point for a much larger, continuously-updated signal
set a real product would need (and would combine with account/behavioural
signals, link-reputation services, etc.) — it is not a certified fraud
detector and must never be presented as one.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional

from . import i18n

TAMIL_BLOCK = re.compile(r"[\u0B80-\u0BFF]")

URL_PATTERN = re.compile(r"(https?://\S+|www\.\S+|\b[a-zA-Z0-9-]+\.(?:com|in|xyz|top|tk|info|co|link|click|online|shop)\b\S*)", re.IGNORECASE)


@dataclass
class Rule:
    id: str
    category: str
    label: str
    severity: str  # low | medium | high
    weight: int
    patterns: list[str]  # regex fragments, case-insensitive, matched against raw text


# Each pattern list intentionally mixes English, common Tanglish
# (romanized Tamil) and Tamil-script phrasing, because real messages
# received in India frequently mix all three in a single line.
RULES: list[Rule] = [
    Rule(
        id="otp_request",
        category="Urgent OTP Request",
        label="Asks you to share an OTP / one-time password",
        severity="high",
        weight=30,
        patterns=[
            r"\botp\b", r"one[\s-]?time[\s-]?password", r"share.{0,15}otp",
            r"otp.{0,15}(share|enter|send)", r"resend otp",
            r"ஒடிபி", r"otp.{0,10}anuppunga", r"otp.{0,10}sollunga",
        ],
    ),
    Rule(
        id="kyc_update",
        category="Fake KYC Update",
        label="Claims your KYC / account needs urgent 'update' or 'verification'",
        severity="high",
        weight=25,
        patterns=[
            r"\bkyc\b", r"kyc.{0,15}(update|expire|pending|block|suspend)",
            r"account.{0,15}(suspend|block|freeze|deactivat)",
            r"verify.{0,15}account", r"update.{0,15}(details|kyc|pan|aadhaar)",
            r"கணக்கு.{0,10}முடக்க", r"kyc.{0,10}pannunga",
        ],
    ),
    Rule(
        id="payment_request",
        category="Suspicious Payment Request",
        label="Pressures you to pay, transfer, or 'refund' money urgently",
        severity="medium",
        weight=20,
        patterns=[
            r"pay.{0,15}(now|immediately|today)", r"transfer.{0,15}(fund|amount|money)",
            r"\bupi\b.{0,15}(id|pin|request)", r"refund.{0,15}(claim|process)",
            r"processing fee", r"registration fee", r"small (fee|deposit)",
            r"பணம்.{0,10}அனுப்ப", r"panam anuppunga", r"advance.{0,10}fee",
        ],
    ),
    Rule(
        id="credential_request",
        category="Password / Banking Detail Request",
        label="Asks for your password, PIN, CVV, or full card/account number",
        severity="high",
        weight=30,
        patterns=[
            r"\bpin\b", r"\bcvv\b", r"\bpassword\b", r"net.?banking.{0,10}(login|password)",
            r"card number", r"account number", r"\bmpin\b", r"\batm\s*pin\b",
            r"கடவுச்சொல்", r"password.{0,10}sollunga",
        ],
    ),
    Rule(
        id="unrealistic_job",
        category="Unrealistic Job Offer",
        label="Promises unusually high pay for little work, or an instant offer",
        severity="medium",
        weight=25,
        patterns=[
            r"work from home.{0,20}(earn|salary)", r"earn.{0,10}(₹|rs\.?|inr)\s?\d{3,}.{0,15}(day|daily|hour)",
            r"part[\s-]?time.{0,15}(income|earning)", r"no experience.{0,15}(needed|required).{0,20}(job|salary)",
            r"selected.{0,15}(job|interview).{0,15}without",
            r"weekly salary guaranteed", r"job.{0,10}guarantee",
        ],
    ),
    Rule(
        id="prize_lottery",
        category="Fake Prize / Lottery",
        label="Claims you have won a prize, lottery, or lucky draw",
        severity="medium",
        weight=20,
        patterns=[
            r"you have won", r"lucky draw", r"claim your prize", r"congratulations.{0,20}(won|selected|winner)",
            r"lottery", r"\bjackpot\b", r"வெற்றியாளர்",
        ],
    ),
    Rule(
        id="urgency_pressure",
        category="Urgency / Pressure Language",
        label="Creates panic or a false deadline to stop you thinking it through",
        severity="low",
        weight=15,
        patterns=[
            r"act (now|immediately|fast)", r"within (10|15|24)\s?(minutes|hours)",
            r"last warning", r"final notice", r"today only", r"expire(s)? today",
            r"immediately.{0,15}(block|suspend|cancel)",
        ],
    ),
    Rule(
        id="generic_greeting",
        category="Generic / Impersonal Greeting",
        label="Uses a generic greeting instead of your real name — common in mass scam blasts",
        severity="low",
        weight=5,
        patterns=[
            r"dear (customer|user|sir/madam|valued customer)", r"dear beneficiary",
        ],
    ),
]

LINK_SHORTENERS = re.compile(r"\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy|shorturl\.at)\b", re.IGNORECASE)
SUSPICIOUS_TLD = re.compile(r"\.(xyz|top|tk|info|club|click|link|work|live)(\b|/)", re.IGNORECASE)


def detect_language(text: str) -> str:
    if TAMIL_BLOCK.search(text):
        return "ta"
    # Very rough Tanglish heuristic: Latin script but contains common
    # Tanglish function words. A production system would use a proper
    # language-ID model instead of a fixed word list.
    tanglish_markers = ["irukku", "pannunga", "sollunga", "vanga", "anuppunga", "nenaikkanum", "dhan", "ungal", "panam"]
    lowered = text.lower()
    if any(m in lowered for m in tanglish_markers):
        return "tanglish"
    return "en"


def score_to_category(score: int) -> str:
    if score >= 75:
        return "Critical"
    if score >= 50:
        return "High"
    if score >= 25:
        return "Medium"
    return "Low"


def _find_snippet(text: str, pattern: str) -> Optional[str]:
    m = re.search(pattern, text, re.IGNORECASE)
    if not m:
        return None
    start = max(0, m.start() - 15)
    end = min(len(text), m.end() + 15)
    snippet = text[start:end].strip()
    return ("…" if start > 0 else "") + snippet + ("…" if end < len(text) else "")


def analyze_message(message: str, requested_language: str = "auto") -> dict:
    detected = detect_language(message)
    language = detected if requested_language == "auto" else requested_language

    signals = []
    score = 0

    for rule in RULES:
        for pattern in rule.patterns:
            if re.search(pattern, message, re.IGNORECASE):
                snippet = _find_snippet(message, pattern)
                signals.append(
                    {
                        "id": rule.id,
                        "label": rule.label,
                        "category": rule.category,
                        "severity": rule.severity,
                        "matched_text": snippet,
                        "explanation": _signal_explanation(rule.id, language),
                    }
                )
                score += rule.weight
                break  # only count each rule once even if several patterns match

    # Extra weight if the message also contains a link alongside other
    # signals — a bare link with nothing else is far less meaningful than
    # "urgent OTP" + a link.
    urls_found = URL_PATTERN.findall(message)
    if urls_found and signals:
        has_shortener = any(LINK_SHORTENERS.search(u) for u in urls_found)
        has_bad_tld = any(SUSPICIOUS_TLD.search(u) for u in urls_found)
        bonus = 20 if (has_shortener or has_bad_tld) else 10
        score += bonus
        signals.append(
            {
                "id": "unknown_link",
                "label": "Contains a link alongside other warning signs",
                "category": "Unknown / Shortened Link",
                "severity": "high" if bonus == 20 else "medium",
                "matched_text": urls_found[0],
                "explanation": _signal_explanation("unknown_link", language),
            }
        )

    score = min(score, 100)
    category = score_to_category(score)

    return {
        "risk_score": score,
        "risk_category": category,
        "signals": signals,
        "summary": i18n.summary_for(language, category),
        "recommended_actions": i18n.actions_for(language),
        "analyzer_used": "rule_based",
        "language_detected": detected,
    }


_SIGNAL_EXPLANATIONS = {
    "en": {
        "unknown_link": "Links shared alongside urgent requests are a classic phishing tactic — the link usually leads to a fake login page.",
    },
    "ta": {
        "unknown_link": "அவசர கோரிக்கைகளுடன் அனுப்பப்படும் links பொதுவாக ஒரு போலி login page-க்கு அழைத்துச் செல்லும்.",
    },
    "tanglish": {
        "unknown_link": "Urgent request-oda sேrந்து varra links usually fake login page-ku dhan kootitu poidum.",
    },
}


def _signal_explanation(rule_id: str, language: str) -> str:
    lang = language if language in _SIGNAL_EXPLANATIONS else "en"
    if rule_id in _SIGNAL_EXPLANATIONS[lang]:
        return _SIGNAL_EXPLANATIONS[lang][rule_id]
    # Fall back to the rule's own label text (already written as a plain
    # explanation) for the rule-based signals defined above.
    for rule in RULES:
        if rule.id == rule_id:
            return rule.label
    return "Matched a known scam-message pattern."
