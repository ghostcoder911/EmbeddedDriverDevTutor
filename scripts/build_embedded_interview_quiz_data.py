#!/usr/bin/env python3
"""Build lessons/embedded-interview-quiz-data.js from EmbeddedInterviewPrep server JSON files."""
from __future__ import annotations

import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "lessons" / "embedded-interview-quiz-data.js"

# Same metadata as EmbeddedInterviewPrep/server/index.js CATEGORIES
CATEGORIES = [
    {
        "id": "bit_manipulation",
        "title": "Bit manipulation",
        "description": "Masks, XOR, powers of two (from your PDF index).",
    },
    {
        "id": "embedded_c",
        "title": "Embedded C",
        "description": "Storage classes, pointers, malloc, volatile (from your notes).",
    },
    {
        "id": "embedded_systems",
        "title": "Embedded systems",
        "description": "Interrupts, DMA, watchdog, memory.",
    },
]


def find_prep_root() -> Path | None:
    env = os.environ.get("EMBEDDED_INTERVIEW_PREP_ROOT", "").strip()
    if env:
        p = Path(env).expanduser().resolve()
        if (p / "server" / "questions.json").is_file():
            return p
    # Sibling on Desktop: .../Desktop/EmbeddedInterviewPrep next to .../Desktop/DriverTutor/EmbeddedDriverDevTutor
    sibling = ROOT.parent.parent / "EmbeddedInterviewPrep"
    if (sibling / "server" / "questions.json").is_file():
        return sibling
    # Explicit common path
    fallback = Path("/home/neeraj/Desktop/EmbeddedInterviewPrep")
    if (fallback / "server" / "questions.json").is_file():
        return fallback
    return None


def load_questions(prep: Path) -> list[dict]:
    server = prep / "server"
    base_path = server / "questions.json"
    raw = json.loads(base_path.read_text(encoding="utf-8"))
    more_path = server / "questions_more.json"
    if more_path.is_file():
        raw = raw + json.loads(more_path.read_text(encoding="utf-8"))
    return raw


def main() -> None:
    prep = find_prep_root()
    if not prep:
        print(
            "ERROR: EmbeddedInterviewPrep not found. Set EMBEDDED_INTERVIEW_PREP_ROOT or place "
            "EmbeddedInterviewPrep next to the repo parent (e.g. Desktop/EmbeddedInterviewPrep)."
        )
        raise SystemExit(1)

    rows = load_questions(prep)
    by_cat: dict[str, list[dict]] = {c["id"]: [] for c in CATEGORIES}
    for q in rows:
        cat = q.get("category")
        if cat not in by_cat:
            continue
        by_cat[cat].append(
            {
                "question_text": q["question_text"],
                "options": q["options"],
                "correct_index": int(q["correct_index"]),
                "difficulty": q.get("difficulty") or "medium",
            }
        )

    payload = {
        "source": "EmbeddedInterviewPrep",
        "prepPath": str(prep),
        "categories": CATEGORIES,
        "questions": by_cat,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    OUT.write_text(
        "/**\n"
        " * MCQ bank from EmbeddedInterviewPrep (questions.json + questions_more.json)\n"
        " * Regenerate: python3 scripts/build_embedded_interview_quiz_data.py\n"
        " */\n"
        f"window.embeddedInterviewQuiz = {body};\n",
        encoding="utf-8",
    )
    counts = ", ".join(f"{k}={len(v)}" for k, v in by_cat.items())
    print(f"Wrote {OUT} — {len(rows)} rows merged, per category: {counts}")


if __name__ == "__main__":
    main()
