"""
Sample test cases for TrustShield AI's rule-based engine.

Run with:
    cd backend
    pip install -r requirements.txt pytest
    pytest -v
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import risk_engine, url_inspector  # noqa: E402


def test_high_risk_kyc_otp_message_scores_high_or_critical():
    msg = (
        "Dear Customer, your SBI account KYC is pending and will be blocked today. "
        "Share the OTP sent to your number immediately to verify: http://sbi-kyc-verify.xyz/update"
    )
    result = risk_engine.analyze_message(msg)
    assert result["risk_score"] >= 50
    assert result["risk_category"] in ("High", "Critical")
    categories = {s["category"] for s in result["signals"]}
    assert "Fake KYC Update" in categories
    assert "Urgent OTP Request" in categories


def test_job_offer_with_registration_fee_is_flagged():
    msg = (
        "Congratulations! You are selected for a work from home job, earn Rs 5000 daily. "
        "Pay a small registration fee of Rs 499 to confirm your seat."
    )
    result = risk_engine.analyze_message(msg)
    assert result["risk_score"] >= 25
    categories = {s["category"] for s in result["signals"]}
    assert "Unrealistic Job Offer" in categories or "Suspicious Payment Request" in categories


def test_normal_appointment_reminder_scores_low():
    msg = "Hi Arun, this is a reminder for your dentist appointment tomorrow at 4 PM. Reply YES to confirm."
    result = risk_engine.analyze_message(msg)
    assert result["risk_category"] == "Low"
    assert result["risk_score"] < 25


def test_tanglish_message_is_detected_and_scored():
    msg = "Unga bank account-la problem irukku, OTP sollunga urgent-a verify pannunga illa account block aagum"
    result = risk_engine.analyze_message(msg, requested_language="auto")
    assert result["language_detected"] in ("tanglish", "ta")
    assert result["risk_score"] > 0


def test_password_request_flagged_as_credential_request():
    msg = "We need your net banking password and CVV to process a refund."
    result = risk_engine.analyze_message(msg)
    categories = {s["category"] for s in result["signals"]}
    assert "Password / Banking Detail Request" in categories
    assert result["risk_category"] in ("Medium", "High", "Critical")


def test_url_inspector_flags_lookalike_domain_and_shortener():
    result = url_inspector.inspect_url("http://paytm-kyc-verify.xyz/login")
    ids = {i["id"] for i in result["indicators"]}
    assert "brand_lookalike" in ids
    assert "risky_tld" in ids
    assert result["caution_level"] in ("High", "Critical")


def test_url_inspector_flags_ip_address_host():
    result = url_inspector.inspect_url("http://192.168.10.55/secure-login")
    ids = {i["id"] for i in result["indicators"]}
    assert "ip_hostname" in ids


def test_url_inspector_on_plain_legit_looking_domain_has_fewer_flags():
    result = url_inspector.inspect_url("https://www.wikipedia.org/wiki/Phishing")
    assert result["caution_level"] == "Low"
