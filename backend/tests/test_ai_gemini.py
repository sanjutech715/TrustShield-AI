import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import ai_gemini


def test_generate_explanation_uses_current_model_and_parses_json(monkeypatch):
    call = {}

    class FakeModels:
        def generate_content(self, **kwargs):
            call.update(kwargs)
            return SimpleNamespace(text='{"explanation":"Verify through your bank."}')

    class FakeClient:
        def __init__(self, api_key):
            self.models = FakeModels()

    monkeypatch.setenv("GEMINI_API_KEY", "test-key")
    monkeypatch.setattr(ai_gemini, "is_configured", lambda: True)
    monkeypatch.setattr(ai_gemini.genai, "Client", FakeClient)

    explanation = ai_gemini.generate_explanation(
        "A sample message",
        [{"category": "Urgent OTP Request"}],
        "en",
    )

    assert explanation == "Verify through your bank."
    assert call["model"] == "gemini-3.5-flash-lite"
    assert call["config"].response_mime_type == "application/json"
