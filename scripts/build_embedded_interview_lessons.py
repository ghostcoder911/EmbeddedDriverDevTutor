#!/usr/bin/env python3
"""Regenerate lessons/embedded-interview-lessons.js + guides/Bit_Manipulation_C_Study_Guide.md.

Sources: interview PDF, DOC PDF, curated C Q&A, Bit manipulation PDF index (page 2) + bit_manipulation_qa_data.py answers.
"""
from __future__ import annotations

import html
import re
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader

# When run as `python3 scripts/build_embedded_interview_lessons.py`, helpers live next to this file
from bit_manipulation_qa_data import BIT_ANSWERS

ROOT = Path(__file__).resolve().parents[1]
INTERVIEW_PDF = ROOT / "Embedded systems Interview questions_260405_004437.pdf"
DOC_PDF = ROOT / "DOC-20260215-WA0007_260405_004541.pdf"
BIT_MANIPULATION_PDF = ROOT / "Bit manipulation _260405_011137.pdf"
OUT_JS = ROOT / "lessons" / "embedded-interview-lessons.js"
OUT_BIT_GUIDE = ROOT / "guides" / "Bit_Manipulation_C_Study_Guide.md"

# Additional curated C / embedded-C interview Q&A (not tied to PDF headings)
EXTRA_C_QA: list[tuple[str, str]] = [
    (
        "What does `volatile` mean in C, and when do you use it?",
        "A `volatile` object may change outside the compiler's view (hardware registers, ISRs, other threads on some systems). The compiler must not optimize away reads/writes or cache the value in a register unless you explicitly read it each time. Typical uses: memory-mapped hardware registers, flags updated by interrupts, and carefully shared variables in embedded systems.",
    ),
    (
        "What is the difference between `const int *p` and `int * const p`?",
        "`const int *p` (pointer to const int): you cannot change the integer through `*p`, but you can change `p` to point elsewhere. `int * const p` (const pointer to int): you cannot reassign `p`, but you can change the value at `*p`. `const int * const p` fixes both the pointer and the value.",
    ),
    (
        "Why is `malloc(sizeof *p)` preferred over `malloc(sizeof(TYPE))`?",
        "If `p` has type `T *`, then `sizeof *p` is `sizeof(T)` and stays correct if the type of `p` changes. It reduces duplication and avoids mismatches when types are refactored.",
    ),
    (
        "What is a translation unit in C?",
        "A translation unit is one `.c` file after preprocessing: it is what the compiler compiles into an object file. `static` globals and functions have internal linkage and are visible only within that translation unit.",
    ),
    (
        "What is linkage (internal vs external)?",
        "External linkage means the symbol can be referenced from other translation units (e.g. non-static global function). Internal linkage means the symbol is local to one translation unit (`static` file-scope variables and functions). `extern` on a declaration says the definition lives elsewhere.",
    ),
    (
        "Explain little-endian vs big-endian.",
        "Endianness defines byte order of multi-byte values in memory. Little-endian: least significant byte at lowest address (common on ARM Cortex-M). Big-endian: most significant byte first. Network byte order is big-endian; you may need `htonl`/`ntohl` when sending binary over networks.",
    ),
    (
        "What is structure padding, and why does it happen?",
        "The compiler inserts unused bytes between struct members to satisfy alignment requirements of each member. Alignment allows efficient loads on the CPU. Use `offsetof` and `sizeof` to reason about layout; `#pragma pack` changes packing (trade-offs: size vs speed and portability).",
    ),
    (
        "What is a union, and when would you use it?",
        "A union overlays all members at the same address; size is at least the largest member. Used for type punning (with care), interpreting the same bits as different types, or packing variants. Beware strict-aliasing rules: prefer `memcpy` for safe reinterpretation when in doubt.",
    ),
    (
        "What is the difference between `++*p`, `*p++`, and `*++p`?",
        "`++*p` increments the value pointed to. `*p++` returns `*p` then advances `p` (postfix `++` on pointer). `*++p` advances `p` first, then dereferences. Precedence: `*` and postfix `++` bind so `*p++` is `*(p++)` in effect for the value read.",
    ),
    (
        "What is strict aliasing?",
        "The compiler may assume pointers of different types do not alias the same memory (except `char *`). Casting `T*` to `U*` and accessing through both can invoke undefined behavior unless rules are followed; use `memcpy` or `union` patterns that your toolchain documents as safe.",
    ),
    (
        "What is the difference between a macro and an `enum` constant?",
        "Macros are text substitution by the preprocessor (no type, no scope, no debug symbol). `enum` constants are in the language proper, have scope, and are visible to the debugger. Prefer `enum` or `static const` for typed integer constants when possible.",
    ),
    (
        "What is `restrict` in C99?",
        "`restrict` promises that for the lifetime of the pointer, only that pointer or pointers derived from it access the object. It enables optimizations. Misuse leads to undefined behavior.",
    ),
    (
        "How do you detect integer overflow safely in C?",
        "Unsigned overflow wraps modulo 2^n (defined). Signed overflow is undefined behavior - avoid `a + b > MAX` naively. Check operands before the operation, use wider types, or compiler builtins/intrinsics for checked arithmetic when available.",
    ),
    (
        "What is the difference between `strcmp` and `strncmp`?",
        "`strcmp` compares two strings until `\\0`. `strncmp` compares at most `n` characters - useful to bound work and avoid reading past a buffer when you are not sure a string is terminated.",
    ),
    (
        "Why can `sizeof` not be used on VLAs the same way everywhere?",
        "VLAs (variable-length arrays) are a C99 feature; `sizeof` on a VLA is evaluated at runtime. On embedded projects, VLAs are often disabled (no unbounded stack use) and replaced with fixed buffers or `malloc`.",
    ),
    (
        "What is a circular buffer (ring buffer), and why use it in embedded?",
        "A fixed-size array with head/tail indices used as a queue - common for UART RX, ISR-to-task handoff. Often lock-free with one writer and one reader, or protected by a mutex if multiple writers exist.",
    ),
    (
        "What is the purpose of `assert` in development?",
        "`assert(condition)` aborts if the condition is false when `NDEBUG` is not defined. Strip assertions in production by defining `NDEBUG` for release builds after thorough testing.",
    ),
    (
        "Explain `size_t` vs `ssize_t`.",
        "`size_t` is an unsigned type for sizes and counts (result of `sizeof`). `ssize_t` is signed; used by some POSIX APIs (e.g. `read`/`write`) to signal errors with `-1`. Mixing signed/unsigned in comparisons is a common bug - promote carefully.",
    ),
    (
        "What is a function pointer, and a typical embedded use?",
        "A variable that holds the address of a function - type is `return_type (*)(args)`. Used for callbacks, state machines, HAL tables, and virtual dispatch. Ensure the signature matches exactly.",
    ),
    (
        "What is the difference between `char *` and `unsigned char *` for buffers?",
        "`char` may be signed or unsigned (implementation-defined). For raw byte buffers, `uint8_t` or `unsigned char` makes intent clear and avoids sign-extension surprises when converting to wider types.",
    ),
    (
        "What is stack overflow in embedded C, and how do you mitigate it?",
        "The stack holds return addresses, locals, and saved registers. Deep recursion or large local arrays can exceed the stack region - often catastrophic on MCUs. Mitigate: avoid unbounded recursion, cap buffer sizes, use static or heap where appropriate, and measure high-water marks in RTOS tasks.",
    ),
    (
        "What is `memcpy` vs `memmove`?",
        "`memcpy` assumes non-overlapping regions. `memmove` works when regions overlap by copying safely. For overlapping buffers, use `memmove`.",
    ),
    (
        "What is the preprocessor `#` and `##` operators?",
        "`#` stringizes a macro argument: `#x` becomes `\"x\"`. `##` token-pastes two tokens together. Used in macro metaprogramming; misuse can make errors hard to read.",
    ),
    (
        "What is `_Static_assert` (C11)?",
        "Compile-time assertion: `_Static_assert(sizeof(int) == 4, \"expected 4-byte int\");` fails the build if the condition is false - useful for ABI/layout checks in portable code.",
    ),
    (
        "Why avoid floating point on small MCUs unless necessary?",
        "Software floating point is slow and code-size heavy; hardware FPU may not exist. Fixed-point arithmetic or integers with scaling are common. If you use `float`, know your denormal/NaN handling and link the right libraries.",
    ),
    (
        "What is the purpose of `errno`?",
        "A thread-local (in modern libs) int set by some library functions on error (e.g. `strtol`, `fopen`). You must check return values and often clear `errno` before calls when required by the API contract.",
    ),
    (
        "Difference between `exit` and `_Exit`?",
        "`exit` runs `atexit` handlers and flushes stdio. `_Exit` terminates immediately without those - closer to immediate halt; sometimes relevant in bare-metal hosted environments.",
    ),
    (
        "What is a reentrant function?",
        "Safe to call while another invocation is in progress (e.g. from main and ISR) if it uses only stack locals and no shared mutable globals. Standard C library functions may not all be reentrant - check vendor docs for embedded libraries.",
    ),
    (
        "What is tail recursion? Is it optimized on embedded compilers?",
        "Tail recursion is when the recursive call is the last operation; theoretically convertible to a loop. Do not rely on it for stack safety on embedded - prefer iterative code unless you verify the compiler optimizes it away.",
    ),
    (
        "What is `intptr_t` / `uintptr_t`?",
        "Integer types guaranteed to hold a pointer value (optional in freestanding). Use for portable pointer↔integer conversions when you must store an address as an integer.",
    ),
    (
        "What is the difference between `NULL` and `0` for pointers?",
        "In C, `NULL` is typically `((void*)0)` or `0`; converting `0` to a pointer yields a null pointer. Prefer `NULL` for clarity in pointer context.",
    ),
    (
        "What is a flexible array member (C99)?",
        "Last member of a struct can be `char data[]` with unknown size; you allocate `sizeof(struct) + n` bytes. Used for variable-length payloads; not available in C++.",
    ),
    (
        "What is the difference between bitwise AND `&` and logical AND `&&`?",
        "`&` operates on each bit (e.g. masking). `&&` short-circuits logical truth - stops evaluating if the result is known. Do not confuse when testing register bits.",
    ),
    (
        "How do you swap two integers without a temporary (and should you)?",
        "XOR swap or arithmetic tricks exist but are often less clear and can overflow. Prefer a temporary variable for readability and defined behavior.",
    ),
    (
        "What is an opaque pointer (handle) in APIs?",
        "The header exposes only `typedef struct Foo *FooHandle;` while the struct definition is hidden in one `.c` file - encapsulation, ABI stability, and simpler client code.",
    ),
    (
        "What is the difference between `fprintf`, `sprintf`, and `snprintf`?",
        "`sprintf` is unsafe without bounds - buffer overrun. `snprintf` takes a size limit and is preferred. Never use unchecked `sprintf` on user or external data.",
    ),
    (
        "What is undefined behavior vs implementation-defined vs unspecified?",
        "UB: program can do anything (optimize away, crash). Implementation-defined: compiler documents choice (e.g. `char` signedness). Unspecified: one of several allowed outcomes (e.g. order of argument evaluation). Embedded debugging often chases UB in pointer arithmetic and strict aliasing.",
    ),
    (
        "What is a memory barrier / fence (conceptually)?",
        "Hardware and compiler reordering can break lock-free patterns. A fence ensures visibility/order of memory operations. In bare metal, often use device-specific barriers or disable interrupts around short critical sections.",
    ),
    (
        "Why initialize all locals in safety-critical code?",
        "Uninitialized automatic variables are indeterminate; reading them is UB. Defensive style initializes every local and validates inputs.",
    ),
    (
        "What is the purpose of `const` correctness?",
        "Marking pointers and parameters `const` documents immutability and lets the compiler catch accidental writes - especially for buffers passed through driver APIs.",
    ),
    (
        "Difference between `read`/`write` (POSIX) and `fread`/`fwrite`?",
        "Lower-level byte I/O vs stdio buffered I/O. On embedded Linux, mixing without care can cause ordering issues; often use one style consistently or `fflush` when required.",
    ),
    (
        "What is dead code elimination?",
        "The compiler removes code that cannot execute or whose result is unused. `volatile` accesses cannot be eliminated the same way - important for hardware register sequences.",
    ),
    (
        "What is a callback function in embedded drivers?",
        "A function pointer registered with a driver to be invoked when an operation completes or data arrives - decouples the driver from application logic.",
    ),
    (
        "What is endianness when sending a `uint32_t` over UART?",
        "You must define wire format: often send MSB first or LSB first explicitly, or send ASCII hex. Never assume the peer shares your CPU endianness.",
    ),
    (
        "What is the role of `stdin`/`stdout`/`stderr` on a bare-metal system?",
        "Often retargeted: `printf` goes to UART/SWO, or stubbed out. You provide `_write` (newlib) or similar for semihosting - know your toolchain's minimal syscall requirements.",
    ),
    (
        "What is a race condition in shared variables?",
        "Two contexts (tasks or ISR + main) read/modify/write without synchronization - last writer wins unpredictably. Fix: disable interrupts briefly, use atomic ops, mutex, or message passing - depending on context.",
    ),
    (
        "What is `intptr_t` used for in practice?",
        "Storing a pointer in an integer container portably when you must (hashes, tagged pointers). Cast through `uintptr_t`, not `unsigned long`, for maximum portability on odd platforms.",
    ),
    (
        "What is the difference between global and static global variables for memory?",
        "Both typically live in `.bss` (zero-init) or `.data` (init). `static` limits visibility to the file - can help the linker strip unused symbols and avoids polluting the global namespace.",
    ),
]


def extract_pdf_pages(path: Path, start_page: int = 0) -> str:
    r = PdfReader(str(path))
    return "\n".join((r.pages[i].extract_text() or "") for i in range(start_page, len(r.pages)))


def extract_pdf(path: Path) -> str:
    return extract_pdf_pages(path, 0)


def extract_pdf_page(path: Path, page_index: int) -> str:
    """Extract a single page (0-based index) - avoids reading huge PDFs end-to-end."""
    r = PdfReader(str(path))
    if page_index < 0 or page_index >= len(r.pages):
        return ""
    return (r.pages[page_index].extract_text() or "")


def clean_noise(text: str) -> str:
    out = []
    for line in text.splitlines():
        s = line.strip()
        if not s:
            continue
        low = s.lower()
        if "pantech" in low or "internship program" in low:
            continue
        if re.match(r"^https?://", s):
            continue
        if "want to design your own" in low:
            continue
        out.append(line)
    return "\n".join(out)


def parse_interview(text: str) -> list[tuple[int, str, str]]:
    lines = []
    for line in text.splitlines():
        if re.search(r"\.{6,}", line) and re.search(r"\b\d{1,3}\s*$", line):
            continue
        lines.append(line)
    text = "\n".join(lines)
    m = re.search(r"\n\s*1\)\s*What is an embedded system", text, re.I)
    if m:
        text = text[m.start() + 1 :]
    chunks = re.split(r"\n(?=\s*\d{1,3}\)\s*)", "\n" + text)
    seen: set[int] = set()
    out: list[tuple[int, str, str]] = []
    for ch in chunks:
        ch = ch.strip()
        if not ch:
            continue
        mm = re.match(r"^(\d{1,3})\)\s*(.*)$", ch, re.S)
        if not mm:
            continue
        num = int(mm.group(1))
        if num in seen or num < 1 or num > 100:
            continue
        seen.add(num)
        body = mm.group(2)
        iq = body.find("?")
        if iq != -1:
            q = re.sub(r"\s+", " ", body[: iq + 1].strip())
            a = body[iq + 1 :].strip()
        else:
            lines = body.split("\n")
            q = lines[0].strip()
            a = "\n".join(lines[1:]).strip()
        if re.match(r"^[\s\.]*\d{1,3}\s*$", a) or (len(a) < 30 and re.search(r"\.{4,}", a)):
            continue
        a = re.sub(r"\n{3,}", "\n\n", a)
        out.append((num, q, a))
    out.sort(key=lambda x: x[0])
    return out


def parse_doc_qa(text: str) -> list[tuple[str, str]]:
    lines = [ln.rstrip() for ln in text.splitlines()]
    qa: list[tuple[str, str]] = []
    i = 0
    while i < len(lines):
        s = lines[i].strip()
        if not s.endswith("?") or len(s) < 15:
            i += 1
            continue
        if re.search(r"\.{6,}", s):
            i += 1
            continue
        q = s
        ans_lines: list[str] = []
        j = i + 1
        while j < len(lines):
            t = lines[j].strip()
            if t.endswith("?") and len(t) > 15 and not re.search(r"\.{6,}", t):
                break
            ans_lines.append(lines[j])
            j += 1
        ans = "\n".join(ans_lines).strip()
        if len(ans) >= 3:
            qa.append((q, ans))
        i = j if j > i else i + 1
    return qa


def parse_doc_sections(text: str) -> list[tuple[str, str]]:
    """Turn short title lines (no ?) into Explain: title + following body until next title."""
    lines = text.splitlines()
    # Skip first junk line "C"
    title_re = re.compile(
        r"^(Storage Class|Inline Function|Dynamic Memory Allocation|Static functions in C|"
        r"Different types of Pointers|Array\b|Pointer Size|Remember\b|"
        r"BIT FIELD|typedef|Structure|Bitwise operators|#define|macro\b|"
        r"SPI\b|I2C\b|UART\b|RTOS\b|PROCESS\b|THREAD\b|SEMAPHORE\b|MUTEX\b|"
        r"LINUX DEVICE DRIVER|DATA COMMUNICATION NETWORK|HUB\b|Bridge|Router|Switch)\s*$",
        re.I,
    )
    out: list[tuple[str, str]] = []
    i = 0
    while i < len(lines):
        s = lines[i].strip()
        if title_re.match(s) and len(s) < 80:
            title = s
            body = []
            i += 1
            while i < len(lines):
                t = lines[i].strip()
                if not t:
                    body.append("")
                    i += 1
                    continue
                if title_re.match(t) and len(t) < 80:
                    break
                if t.endswith("?") and len(t) > 30:
                    break
                body.append(lines[i])
                i += 1
            text_body = "\n".join(body).strip()
            if len(text_body) > 40:
                q = f"Explain: {title} (from typical C notes)."
                out.append((q, text_body))
            continue
        i += 1
    return out[:25]  # cap to avoid huge blobs


def parse_bit_manipulation_index(pdf_path: Path) -> list[tuple[int, str]]:
    """Parse Q1–Q41 titles from Bit manipulation PDF (index is on the second page, index 1)."""
    if not pdf_path.is_file():
        return []
    text = extract_pdf_page(pdf_path, page_index=1)
    idx = text.find("Q 1.")
    if idx == -1:
        return []
    text = text[idx:]
    parts = re.split(r"(?=Q\s*\d+)", text)
    out: list[tuple[int, str]] = []
    for p in parts:
        p = p.strip()
        if not p.startswith("Q"):
            continue
        m = re.match(r"Q\s*(\d+)\s*(.+)", p, re.S)
        if not m:
            continue
        num = int(m.group(1))
        body = re.sub(r"^[\s.)]+", "", m.group(2))
        q = body.strip()
        if q:
            out.append((num, q))
    out.sort(key=lambda x: x[0])
    return out


def build_bit_manipulation_qa(pdf_path: Path) -> list[tuple[int, str, str]]:
    """(Index, question, answer) from PDF index + curated answers (PDF body text is often garbled when extracted)."""
    rows = parse_bit_manipulation_index(pdf_path)
    combined: list[tuple[int, str, str]] = []
    for num, q in rows:
        ans = BIT_ANSWERS.get(num) or "(Add notes from the PDF or a reference.)"
        qt = q.strip().rstrip(".:")
        if not qt.endswith("?"):
            qt += "?"
        combined.append((num, qt, ans))
    return combined


def write_bit_manipulation_guide_md(path: Path, qa: list[tuple[int, str, str]], pdf_name: str) -> None:
    lines = [
        "# Bit manipulation in C - study guide",
        "",
        f"This guide matches the numbered index in `{pdf_name}` (see the PDF’s index page). "
        "Suggested answers are concise interview notes; verify edge cases (sign, width, overflow) on your target.",
        "",
        "---",
        "",
    ]
    for num, q, a in qa:
        lines.append(f"## {num}. {q}")
        lines.append("")
        for para in re.split(r"\n\n+", a.strip()):
            if para.strip():
                lines.append(para.strip())
                lines.append("")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def esc_js(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${}")


def fmt_answer_html(a: str) -> str:
    a = a.strip()
    if not a:
        return "<p><em>(Expand from your notes.)</em></p>"
    parts: list[str] = []
    for p in re.split(r"\n\n+", a):
        p = p.strip()
        if not p:
            continue
        code_like = "\n" in p and any(
            x in p for x in ("#include", "printf", "int main", "void ", "{", "}", "malloc", "calloc")
        )
        if code_like:
            parts.append(f"<pre><code>{html.escape(p)}</code></pre>")
        else:
            parts.append(f"<p>{html.escape(p).replace(chr(10), '<br/>')}</p>")
    return "\n".join(parts) if parts else f"<p>{html.escape(a)}</p>"


def qa_block(q: str, a_html: str) -> str:
    return (
        f'<div class="qa-item"><p class="qa-q"><strong>Q:</strong> {html.escape(q)}</p>'
        f'<div class="qa-a"><strong>A:</strong>{a_html}</div></div>'
    )


def main() -> None:
    interview = parse_interview(
        clean_noise(extract_pdf_pages(INTERVIEW_PDF, start_page=4))
    )
    doc_text = clean_noise(extract_pdf(DOC_PDF))
    doc_qa = parse_doc_qa(doc_text)
    section_qa = parse_doc_sections(doc_text)

    # Merge C sources: PDF ?-questions, section summaries, then curated extras (dedupe questions loosely)
    seen_q: set[str] = set()
    c_combined: list[tuple[str, str]] = []
    for q, a in doc_qa + section_qa:
        key = q[:120].lower()
        if key in seen_q:
            continue
        seen_q.add(key)
        c_combined.append((q, a))
    for q, a in EXTRA_C_QA:
        key = q[:120].lower()
        if key in seen_q:
            continue
        seen_q.add(key)
        c_combined.append((q, a))

    lessons: list[dict[str, str]] = []
    lessons.append(
        {
            "title": "How to use this interview prep",
            "content": """
            <p>This track is a question-and-answer review for embedded software interviews. Work through each step in order, or jump to a topic from the sidebar.</p>
            <div class="info-box tip">
                <div class="info-box-title">Tips</div>
                <ul>
                    <li>Try answering aloud before reading the suggested answer.</li>
                    <li>Use the copy button on any code snippet when you practice on a board.</li>
                    <li>Follow up with datasheets and your MCU reference manual for details specific to your chip.</li>
                </ul>
            </div>
        """,
        }
    )

    batch = 10
    for start in range(0, len(interview), batch):
        chunk = interview[start : start + batch]
        first, last = chunk[0][0], chunk[-1][0]
        parts = [qa_block(q, fmt_answer_html(a)) for _, q, a in chunk]
        lessons.append(
            {
                "title": f"Embedded concepts - questions {first}–{last}",
                "content": "\n".join(parts),
            }
        )

    c_batch = 6
    for i in range(0, len(c_combined), c_batch):
        chunk = c_combined[i : i + c_batch]
        parts = [qa_block(q, fmt_answer_html(a)) for q, a in chunk]
        n = i // c_batch + 1
        lessons.append(
            {
                "title": f"C programming - practice set {n}",
                "content": "\n".join(parts),
            }
        )

    bit_qa = build_bit_manipulation_qa(BIT_MANIPULATION_PDF)
    if bit_qa:
        write_bit_manipulation_guide_md(OUT_BIT_GUIDE, bit_qa, BIT_MANIPULATION_PDF.name)
    bit_batch = 6
    for i in range(0, len(bit_qa), bit_batch):
        chunk = bit_qa[i : i + bit_batch]
        parts = [
            qa_block(f"[{num}] {q}", fmt_answer_html(a)) for num, q, a in chunk
        ]
        n = i // bit_batch + 1
        lessons.append(
            {
                "title": f"Bit manipulation - practice set {n}",
                "content": "\n".join(parts),
            }
        )

    lines_out = [
        "/**",
        " * Embedded interview preparation (Q&A) - generated by scripts/build_embedded_interview_lessons.py",
        " */",
        "",
        "window.embeddedInterviewLessons = [",
    ]
    for i, les in enumerate(lessons):
        lines_out.append("    {")
        lines_out.append(f"        title: `{esc_js(les['title'])}`,")
        lines_out.append(f"        content: `{esc_js(les['content'])}`")
        lines_out.append("    }" + ("," if i < len(lessons) - 1 else ""))
    lines_out.append("];")

    OUT_JS.parent.mkdir(parents=True, exist_ok=True)
    OUT_JS.write_text("\n".join(lines_out), encoding="utf-8")
    print(
        f"Wrote {OUT_JS} - {len(lessons)} lessons, "
        f"interview={len(interview)}, C items={len(c_combined)}, bit items={len(bit_qa)}"
    )
    if bit_qa:
        print(f"Wrote {OUT_BIT_GUIDE}")


if __name__ == "__main__":
    main()
