"""
Offline, pattern-based URL inspector.

This module NEVER makes a network request to the submitted URL. It only
parses the URL string itself (scheme, hostname, path) and checks it
against a list of structural phishing indicators. This is deliberate:
a prototype safety tool should not be the thing that "clicks" a
potentially malicious link, and we do not want to imply a live
threat-intelligence / safe-browsing lookup is happening when it isn't.
"""

from __future__ import annotations

import ipaddress
import re
from urllib.parse import urlparse

KNOWN_BRANDS = [
    "paytm", "phonepe", "gpay", "googlepay", "sbi", "hdfc", "icici", "axis",
    "rbi", "kotak", "amazon", "flipkart", "irctc", "lic", "upi", "whatsapp",
]

SHORTENERS = {"bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "rb.gy", "shorturl.at"}
RISKY_TLDS = {"xyz", "top", "tk", "info", "club", "click", "link", "work", "live", "gq", "cf"}


def _ensure_scheme(raw_url: str) -> str:
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", raw_url):
        return "http://" + raw_url
    return raw_url


def inspect_url(raw_url: str) -> dict:
    url_with_scheme = _ensure_scheme(raw_url.strip())
    parsed = urlparse(url_with_scheme)
    hostname = (parsed.hostname or "").lower()
    indicators = []

    def add(id_, label, detail, severity):
        indicators.append({"id": id_, "label": label, "detail": detail, "severity": severity})

    if not hostname:
        add("unparseable", "Could not parse a valid hostname", "The text does not look like a well-formed URL.", "medium")
        return _build_response(raw_url, None, None, indicators)

    # 1. IP address instead of a domain name
    try:
        ipaddress.ip_address(hostname)
        add(
            "ip_hostname",
            "Uses a raw IP address instead of a domain name",
            "Legitimate banks and brands almost never link directly to a numeric IP address.",
            "high",
        )
    except ValueError:
        pass

    # 2. "@" obfuscation trick — e.g. http://sbi.co.in@evil.com/
    if "@" in parsed.netloc:
        add(
            "at_symbol",
            "Contains an '@' symbol in the address",
            "Everything before '@' is ignored by browsers — scammers use this to show a trusted-looking name while the real destination is after the '@'.",
            "high",
        )

    # 3. Known-brand name combined with a hyphen / extra words (lookalike domain)
    for brand in KNOWN_BRANDS:
        if brand in hostname and not hostname.endswith(f"{brand}.com") and not hostname.endswith(f"{brand}.in") and not hostname.endswith(f"{brand}.co.in"):
            add(
                "brand_lookalike",
                f"Mentions the brand '{brand}' but is not that brand's own domain",
                "A common trick is to add the real brand's name to an unrelated domain, e.g. 'paytm-kyc-update.xyz'.",
                "high",
            )
            break

    # 4. URL shortener
    if hostname in SHORTENERS or any(hostname.endswith("." + s) for s in SHORTENERS):
        add(
            "shortener",
            "Uses a link-shortening service",
            "Shorteners hide the real destination domain until you click — commonly used to disguise phishing links.",
            "medium",
        )

    # 5. Risky / unusual top-level domain
    tld = hostname.rsplit(".", 1)[-1] if "." in hostname else ""
    if tld in RISKY_TLDS:
        add(
            "risky_tld",
            f"Uses the '.{tld}' domain ending",
            "This domain ending is inexpensive and anonymous to register, so it's disproportionately common in phishing campaigns — though plenty of legitimate sites use it too.",
            "medium",
        )

    # 6. Excessive subdomains (e.g. sbi.login.verify.example.com)
    subdomain_count = hostname.count(".") 
    if subdomain_count >= 3:
        add(
            "many_subdomains",
            "Has an unusually long chain of subdomains",
            "Scammers sometimes bury a brand name in a subdomain (e.g. 'sbi.secure-login.example.com') to make the link look trustworthy at a glance.",
            "medium",
        )

    # 7. Punycode (used for homoglyph / lookalike character attacks)
    if hostname.startswith("xn--") or ".xn--" in hostname:
        add(
            "punycode",
            "Uses punycode-encoded characters in the domain",
            "This can be used to register domains with characters that look identical to Latin letters (a homoglyph attack).",
            "high",
        )

    # 8. No HTTPS
    if parsed.scheme == "http":
        add(
            "no_https",
            "Does not use a secure (https://) connection",
            "Not using HTTPS isn't proof of anything by itself (plenty of scam pages do use HTTPS too), but a legitimate bank/payment page should always be HTTPS.",
            "low",
        )

    # 9. Long random-looking path/query (common in redirect/obfuscation chains)
    if len(parsed.path) + len(parsed.query) > 60:
        add(
            "long_obfuscated_path",
            "Has an unusually long or random-looking path",
            "Long, random-looking paths or query strings are sometimes used to disguise tracking or redirect chains.",
            "low",
        )

    return _build_response(raw_url, parsed.scheme, hostname, indicators)


def _build_response(raw_url: str, scheme, hostname, indicators: list[dict]) -> dict:
    high = sum(1 for i in indicators if i["severity"] == "high")
    medium = sum(1 for i in indicators if i["severity"] == "medium")

    if high >= 2:
        caution_level = "Critical"
    elif high == 1:
        caution_level = "High"
    elif medium >= 1:
        caution_level = "Medium"
    else:
        caution_level = "Low"

    return {
        "submitted_url": raw_url,
        "hostname": hostname,
        "scheme": scheme,
        "indicators": indicators,
        "caution_level": caution_level,
    }
