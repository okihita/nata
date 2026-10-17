"""Verify that this project can do multimodal (image) calls, and on which models.

Encodes a finding that cost time to establish: Gemini on this project is only
reachable through the `global` endpoint. `asia-southeast2` returns
FAILED_PRECONDITION, so any regional default is wrong for the model even though
it is right for Cloud Run.

Run it before blaming the app for a failed receipt:

    uv run python scripts/probe_multimodal.py

It answers three questions at once:
  1. does a bare image call succeed (isolating app code from the model)?
  2. is the failure model-specific?
  3. is the failure region-specific?
"""

from __future__ import annotations

import base64
import time
from pathlib import Path

from google import genai
from google.genai import types

PROJECT = "nata-hackathon"
IMAGE = Path("web/public/samples/atk.png")

#: Models worth probing: the default, two GA alternatives, and the one the
#: competition brief names for deep reasoning.
MODELS = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-2.5-flash"]

PROMPT = "Read this receipt and reply with only the merchant and the total, like: MERCHANT | TOTAL"


def attempt(model: str, location: str, image: bytes) -> tuple[bool, str]:
    """One image call. Returns (ok, human-readable detail)."""
    client = genai.Client(vertexai=True, project=PROJECT, location=location)
    started = time.time()
    try:
        response = client.models.generate_content(
            model=model,
            contents=[
                types.Part.from_bytes(data=image, mime_type="image/png"),
                PROMPT,
            ],
        )
        text = (response.text or "").strip().replace("\n", " ")
        return True, f"{time.time() - started:5.1f}s  {text[:60]}"
    except Exception as error:  # noqa: BLE001 - the message *is* the finding
        message = str(error)
        elapsed = time.time() - started
        # Keep the discriminating part: a 429 is transient and retryable, while
        # FAILED_PRECONDITION means the region cannot serve the model at all.
        if "429" in message or "RESOURCE_EXHAUSTED" in message:
            return False, f"{elapsed:5.1f}s  429 RESOURCE_EXHAUSTED (transient; retry helps)"
        if "FAILED_PRECONDITION" in message:
            return False, f"{elapsed:5.1f}s  FAILED_PRECONDITION (this region cannot serve it)"
        if "404" in message or "NOT_FOUND" in message:
            return False, f"{elapsed:5.1f}s  404 model or endpoint not found"
        if "403" in message or "PERMISSION" in message:
            return False, f"{elapsed:5.1f}s  403 denied"
        return False, f"{elapsed:5.1f}s  {message[:90]}"


def main() -> int:
    if not IMAGE.exists():
        raise SystemExit(f"sample image not found: {IMAGE}")
    image = IMAGE.read_bytes()
    print(f"image: {IMAGE} ({len(image):,} bytes)\n")

    print("-- model comparison on the global endpoint --")
    for model in MODELS:
        ok, detail = attempt(model, "global", image)
        print(f"  {'PASS' if ok else 'FAIL'}  {model:<18} {detail}")
        time.sleep(1)

    print("\n-- region check on the default model --")
    ok, detail = attempt(MODELS[0], "asia-southeast2", image)
    print(f"  {'PASS' if ok else 'FAIL'}  {MODELS[0]:<18} {detail}")
    if not ok:
        print("\n  Expected: Gemini is served only on `global` for this project.")
        print("  Cloud Run stays regional; only the model call needs `global`.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
