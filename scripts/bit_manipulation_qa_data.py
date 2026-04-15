"""Curated interview-style answers for questions indexed in Bit manipulation PDF (page 1).
Used by build_embedded_interview_lessons.py - keep keys 1..41 in sync with the PDF index."""

from __future__ import annotations

# Key = question number from PDF index; value = suggested answer (embedded C / interview style)
BIT_ANSWERS: dict[int, str] = {
    1: (
        "Test bit i (0-based from LSB): `(x >> i) & 1` or mask `x & (1u << i)` (nonzero means set). "
        "Use unsigned shifts for unsigned `x` to avoid UB. On MCUs this is how you read register flags."
    ),
    2: (
        "Set bit i: `x | (1u << i)`. Often written as `x |= (1u << i);` for GPIO BSRR or flag registers."
    ),
    3: (
        "Clear bit i: `x & ~(1u << i)` or `x &= ~(1u << i);`. The mask must be wide enough - use `1UL` on 32-bit if needed."
    ),
    4: (
        "Lowest set bit: `x & -x` isolates it. Remove lowest set bit (Brian Kernighan): `x & (x - 1)`. "
        "Also used in counting set bits and power-of-two tests."
    ),
    5: (
        "Even if `(x & 1) == 0`, odd if `(x & 1) == 1`. Equivalent to `x % 2` but cheaper and works for unsigned without division."
    ),
    6: (
        "Positive `n` is a power of two iff exactly one bit is set: `n > 0 && (n & (n - 1)) == 0`. "
        "Exclude zero. Works for unsigned types."
    ),
    7: (
        "Must be a power of two and a power of four: e.g. `n > 0 && !(n & (n-1)) && (n & 0x55555555U)` "
        "(on 32-bit) or check `(n - 1) % 3 == 0` after the power-of-two test."
    ),
    8: (
        "After `n > 0 && !(n & (n-1))`, powers of eight satisfy `(n - 1) % 7 == 0` (for n in 32-bit range). "
        "Alternatively use a loop dividing by 8 or precomputed masks for interviews."
    ),
    9: (
        "After power-of-two test, powers of 16 satisfy `(n - 1) % 15 == 0` (for valid range). "
        "Or repeatedly divide by 16 until 1 with zero remainder at each step."
    ),
    10: (
        "Toggle bit i: `x ^ (1u << i)` or `x ^= (1u << i);`. XOR with 1 flips that bit."
    ),
    11: (
        "Popcount: GCC/Clang `__builtin_popcount(x)` (unsigned). Portable loop: while (x) { x &= x-1; ++count; } "
        "Hardware POPCNT on x86 when available. For 64-bit use `__builtin_popcountll`."
    ),
    12: (
        "XOR all elements → `xor_all = a^b` for the two unique values. Find any set bit in `xor_all`, "
        "split numbers by that bit into two buckets, XOR each bucket to recover one answer each. O(n) time, O(1) extra."
    ),
    13: (
        "ASCII letters: OR with `0x20` to lower if `c` is uppercase: `c | 0x20` (or `c + 32` if in range). "
        "Check range with `c >= 'A' && c <= 'Z'` first."
    ),
    14: (
        "Clear bit 5 for ASCII: `c & ~0x20` or `c - 32` if lowercase. Guard with `c >= 'a' && c <= 'z'`."
    ),
    15: (
        "Flip case for ASCII letters: `c ^= 0x20` when the character is A–Z or a–z."
    ),
    16: (
        "For A–Z: `c - 'A' + 1`; for a–z: `c - 'a' + 1`. Normalize with `tolower`/`toupper` first if input mixed."
    ),
    17: (
        "All others appear even times: XOR entire array - pairs cancel (`x^x=0`), odd one remains. O(n), O(1) space."
    ),
    18: (
        "XOR swap (same memory address is undefined - do not use `a` and `a`): "
        "`a ^= b; b ^= a; a ^= b;`. Prefer a temp for clarity unless constrained in a puzzle."
    ),
    19: (
        "Pattern: XOR 1..n cycles mod 4: n%4==0 → n, n%4==1 → 1, n%4==2 → n+1, n%4==3 → 0. Derive with recurrence or prove by induction."
    ),
    20: (
        "Let `f(n) = 1^2^...^n`. XOR of range [L,R] is `f(R) ^ f(L-1)` because prefix XOR telescopes."
    ),
    21: (
        "Same as even test: `(n & 1) == 0` means even. Prefer bitwise in hot paths; `n % 2` is fine when readable."
    ),
    22: (
        "Each element appears in exactly half of all subsets (2^(n-1) times). If n≥2, every value is XORed an even number of times → total XOR is 0. "
        "If n==1, result is `a[0]`."
    ),
    23: (
        "Bits that differ: `A ^ B`. Count set bits in that: `__builtin_popcount(A ^ B)` or Kernighan loop - equals Hamming distance."
    ),
    24: (
        "Missing one of 1..n in permuted array: XOR all indices+1 with all values, or sum formula `n(n+1)/2` minus array sum (watch overflow - prefer XOR)."
    ),
    25: (
        "For 32-bit: `for (int i = 31; i >= 0; i--) putchar('0' + ((x >> i) & 1));` or print from LSB with a flag for leading zeros."
    ),
    26: (
        "Reverse bits in fixed width (e.g. 32): loop i in 0..31, build `out = (out << 1) | (x & 1); x >>= 1;`. "
        "Use `uint32_t` and avoid signed right shift on negatives."
    ),
    27: (
        "If bit i and j differ, flip both: `if (((x>>i)^(x>>j)) & 1) x ^= (1u<<i) | (1u<<j);` "
        "Or compare bits then XOR mask on both positions."
    ),
    28: (
        "Pairwise swap: `((x & 0xAAAAAAAAu) >> 1) | ((x & 0x55555555u) << 1)` for 32-bit even/odd bit positions."
    ),
    29: (
        "Build masks for bit range [lo,hi]: `m = ((1u << (hi-lo+1)) - 1) << lo`. Copy: `y = (y & ~m) | (x & m)`. "
        "Toggle: `x ^= m` on that range."
    ),
    30: (
        "Unsigned long division style: subtract `b` shifted left while `a >= b<<k`, accumulate quotient bits; or double `b` until overflow. "
        "Handle signs separately if using signed (overflow pitfalls)."
    ),
    31: (
        "Every number appears three times except one: sum bits per position mod 3, or finite-state per bit; "
        "LeetCode-style - O(32) space for 32-bit integers. XOR alone does not work as with ‘twice’."
    ),
    32: (
        "Often interpreted as minimum steps to reduce n to 1 with allowed ops (even: /2, odd: +1 or -1) - greedy with bit patterns, or BFS for small n. "
        "Clarify problem statement in interview."
    ),
    33: (
        "For signed integers: `(a ^ b) < 0` means opposite signs (beware overflow in `a*b`). "
        "Or `(a ^ b) >> (sizeof(int)*8 - 1)` as 0/1 with care."
    ),
    34: (
        "Bit trick: `-~x` is `x+1` for two’s complement (`~x` is bitwise NOT). Puzzle answer; in production use `x + 1`."
    ),
    35: (
        "Boolean algebra: `a ^ b` equals `(a & ~b) | (~a & b)` without using `^` operator."
    ),
    36: (
        "For integers: `!(a ^ b)` is 1 if equal (also `((a ^ b) | -(a ^ b)) >> 31` patterns - avoid for floats)."
    ),
    37: (
        "Branchless min of a,b: `b ^ ((a ^ b) & -(a < b))` (with `a<b` as 0/1 - still a comparison). "
        "Or use `a < b ? a : b` in real code."
    ),
    38: (
        "Array 1..n with one duplicate and one missing: XOR/sum mismatch, or cycle detection on index as pointer (Floyd). "
        "Use `long long` for sum difference to avoid overflow."
    ),
    39: (
        "Bitmask each word’s letter set; for each pair, if `mask[i] & mask[j] == 0`, update max `len[i]*len[j]`. O(n² * 26) with early skips."
    ),
    40: (
        "Rolling hash on binary string of length k over sliding window; track seen in hash set; need 2^k distinct substrings - use deque on large inputs."
    ),
    41: (
        "Classic: array values 1..n with one duplicate - Floyd cycle on index chain `i -> a[i]`, or XOR/sum math. "
        "LeetCode 287: treat as linked list cycle."
    ),
}
