#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Guard: the school's phone number must be identical everywhere, and must match constants.ts.

WHY (2026-09-11)
Jonathan confirmed the correct number is 251-295-7688. It was hardcoded as 251-201-9991 in
NINE places across six files — the transcript, report card, record release, enrollment form and
both church-form renderers — while src/lib/constants.ts held the correct value the whole time.
Every printed document a family received carried a wrong phone number, and nothing caught it
because no single source of truth was ever consulted.

This is the structural fix: any phone literal in src/ that is not the constant fails the check.
Run it before deploying, or from a cron.

Usage:  python check_phone_consistency.py        (exit 0 = consistent, 1 = drift)
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
CONSTANTS = SRC / "lib" / "constants.ts"

PHONE_LITERAL = re.compile(r"\(?251\)?[\s.\-]\d{3}[\s.\-]\d{4}")

# 555 is not an assignable central-office code in NANP — no real subscriber can have one, so any
# 251-555-xxxx is example text in a form placeholder, never the school's number. Exempting these
# matters: a guard that cries wolf on every placeholder gets switched off, which is how real
# drift survives. (555-0100..555-0199 is the block formally reserved for fiction.)
FICTIONAL = re.compile(r"\(?251\)?[\s.\-]555[\s.\-]\d{4}")


def normalize(s: str) -> str:
    """251-295-7688 / (251) 295-7688 / 251.295.7688 -> 2512957688"""
    return re.sub(r"\D", "", s)


def main() -> int:
    if not CONSTANTS.exists():
        print(f"FAIL: {CONSTANTS} not found")
        return 1

    text = CONSTANTS.read_text(encoding="utf-8", errors="replace")
    m = re.search(r"phone\s*:\s*['\"]([^'\"]+)['\"]", text)
    if not m:
        print("FAIL: could not read `phone:` from constants.ts")
        return 1

    canonical = normalize(m.group(1))
    print(f"constants.ts phone = {m.group(1)}  (canonical {canonical})")

    bad = []
    for path in SRC.rglob("*"):
        if not path.is_file() or path.suffix not in {".ts", ".tsx"}:
            continue
        if path == CONSTANTS:
            continue
        try:
            content = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        for lineno, line in enumerate(content.splitlines(), 1):
            for found in PHONE_LITERAL.findall(line):
                if FICTIONAL.match(found):
                    continue  # reserved fictional range — a placeholder, not the school's number
                if normalize(found) != canonical:
                    bad.append((path.relative_to(ROOT), lineno, found, line.strip()[:90]))

    if bad:
        print(f"\nFAIL: {len(bad)} phone number(s) do not match constants.ts:")
        for rel, lineno, found, ctx in bad:
            print(f"  {rel}:{lineno}  found {found!r}")
            print(f"      {ctx}")
        print("\nFix: use SCHOOL_CONFIG.phone, or correct the literal.")
        return 1

    print(f"PASS: every phone literal in src/ matches constants.ts")
    return 0


if __name__ == "__main__":
    sys.exit(main())
