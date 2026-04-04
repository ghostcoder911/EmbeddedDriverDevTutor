# Bit manipulation in C — study guide

This guide matches the numbered index in `Bit manipulation _260405_011137.pdf` (see the PDF’s index page). Suggested answers are concise interview notes; verify edge cases (sign, width, overflow) on your target.

---

## 1. Check if the ith bit is set or not?

Test bit i (0-based from LSB): `(x >> i) & 1` or mask `x & (1u << i)` (nonzero means set). Use unsigned shifts for unsigned `x` to avoid UB. On MCUs this is how you read register flags.

## 2. Set the ith bit of a number?

Set bit i: `x | (1u << i)`. Often written as `x |= (1u << i);` for GPIO BSRR or flag registers.

## 3. clear the ith bit of a number?

Clear bit i: `x & ~(1u << i)` or `x &= ~(1u << i);`. The mask must be wide enough—use `1UL` on 32-bit if needed.

## 4. Remove the last set bit of a number?

Lowest set bit: `x & -x` isolates it. Remove lowest set bit (Brian Kernighan): `x & (x - 1)`. Also used in counting set bits and power-of-two tests.

## 5. Find whether a number is even or odd?

Even if `(x & 1) == 0`, odd if `(x & 1) == 1`. Equivalent to `x % 2` but cheaper and works for unsigned without division.

## 6. Check if the number is a power of 2?

Positive `n` is a power of two iff exactly one bit is set: `n > 0 && (n & (n - 1)) == 0`. Exclude zero. Works for unsigned types.

## 7. Check if a number is a power of 4?

Must be a power of two and a power of four: e.g. `n > 0 && !(n & (n-1)) && (n & 0x55555555U)` (on 32-bit) or check `(n - 1) % 3 == 0` after the power-of-two test.

## 8. Check if a number is a power of 8?

After `n > 0 && !(n & (n-1))`, powers of eight satisfy `(n - 1) % 7 == 0` (for n in 32-bit range). Alternatively use a loop dividing by 8 or precomputed masks for interviews.

## 9. Check if a number is a power of 16?

After power-of-two test, powers of 16 satisfy `(n - 1) % 15 == 0` (for valid range). Or repeatedly divide by 16 until 1 with zero remainder at each step.

## 10. Toggle ith Bit of a number?

Toggle bit i: `x ^ (1u << i)` or `x ^= (1u << i);`. XOR with 1 flips that bit.

## 11. Count the number of set bits in a number?

Popcount: GCC/Clang `__builtin_popcount(x)` (unsigned). Portable loop: while (x) { x &= x-1; ++count; } Hardware POPCNT on x86 when available. For 64-bit use `__builtin_popcountll`.

## 12. Find the two non-repeating elements in an array of repeating elements/ Unique Numbers 2?

XOR all elements → `xor_all = a^b` for the two unique values. Find any set bit in `xor_all`, split numbers by that bit into two buckets, XOR each bucket to recover one answer each. O(n) time, O(1) extra.

## 13. Convert Uppercase to LowerCase?

ASCII letters: OR with `0x20` to lower if `c` is uppercase: `c | 0x20` (or `c + 32` if in range). Check range with `c >= 'A' && c <= 'Z'` first.

## 14. Convert Lowercase to Uppercase?

Clear bit 5 for ASCII: `c & ~0x20` or `c - 32` if lowercase. Guard with `c >= 'a' && c <= 'z'`.

## 15. Invert Alphabet’s Case?

Flip case for ASCII letters: `c ^= 0x20` when the character is A–Z or a–z.

## 16. Find Letter Position in alphabet?

For A–Z: `c - 'A' + 1`; for a–z: `c - 'a' + 1`. Normalize with `tolower`/`toupper` first if input mixed.

## 17. Given a set of numbers where all elements occur an even number of times except one number, ﬁnd the odd occurring number?

All others appear even times: XOR entire array—pairs cancel (`x^x=0`), odd one remains. O(n), O(1) space.

## 18. Swap two numbers using Bit manipulation?

XOR swap (same memory address is undefined—do not use `a` and `a`): `a ^= b; b ^= a; a ^= b;`. Prefer a temp for clarity unless constrained in a puzzle.

## 19. Calculate XOR from 1 to n?

Pattern: XOR 1..n cycles mod 4: n%4==0 → n, n%4==1 → 1, n%4==2 → n+1, n%4==3 → 0. Derive with recurrence or prove by induction.

## 20. Find XOR of numbers from the range [L,R]?

Let `f(n) = 1^2^...^n`. XOR of range [L,R] is `f(R) ^ f(L-1)` because prefix XOR telescopes.

## 21. Check whether the number is even or not?

Same as even test: `(n & 1) == 0` means even. Prefer bitwise in hot paths; `n % 2` is fine when readable.

## 22. Find  the XOR of the XOR of all subsets of an array?

Each element appears in exactly half of all subsets (2^(n-1) times). If n≥2, every value is XORed an even number of times → total XOR is 0. If n==1, result is `a[0]`.

## 23. Count Number of bits to be ﬂipped to convert A to B?

Bits that differ: `A ^ B`. Count set bits in that: `__builtin_popcount(A ^ B)` or Kernighan loop—equals Hamming distance.

## 24. Find missing number in an array?

Missing one of 1..n in permuted array: XOR all indices+1 with all values, or sum formula `n(n+1)/2` minus array sum (watch overflow—prefer XOR).

## 25. Print the binary representation of decimal number?

For 32-bit: `for (int i = 31; i >= 0; i--) putchar('0' + ((x >> i) & 1));` or print from LSB with a flag for leading zeros.

## 26. Reverse the bits of a number?

Reverse bits in fixed width (e.g. 32): loop i in 0..31, build `out = (out << 1) | (x & 1); x >>= 1;`. Use `uint32_t` and avoid signed right shift on negatives.

## 27. Swap the ith and Jth bit?

If bit i and j differ, flip both: `if (((x>>i)^(x>>j)) & 1) x ^= (1u<<i) | (1u<<j);` Or compare bits then XOR mask on both positions.

## 28. Swap all even and odd bits?

Pairwise swap: `((x & 0xAAAAAAAAu) >> 1) | ((x & 0x55555555u) << 1)` for 32-bit even/odd bit positions.

## 29. Copy set bits in a range, toggle set bits in a range?

Build masks for bit range [lo,hi]: `m = ((1u << (hi-lo+1)) - 1) << lo`. Copy: `y = (y & ~m) | (x & m)`. Toggle: `x ^= m` on that range.

## 30. Divide two integers without using Multiplication, Division and mod operator?

Unsigned long division style: subtract `b` shifted left while `a >= b<<k`, accumulate quotient bits; or double `b` until overflow. Handle signs separately if using signed (overflow pitfalls).

## 31. One unique rest thrice?

Every number appears three times except one: sum bits per position mod 3, or finite-state per bit; LeetCode-style—O(32) space for 32-bit integers. XOR alone does not work as with ‘twice’.

## 32. Reduce a Number to 1?

Often interpreted as minimum steps to reduce n to 1 with allowed ops (even: /2, odd: +1 or -1)—greedy with bit patterns, or BFS for small n. Clarify problem statement in interview.

## 33. Detect if two integers have opposite sign?

For signed integers: `(a ^ b) < 0` means opposite signs (beware overflow in `a*b`). Or `(a ^ b) >> (sizeof(int)*8 - 1)` as 0/1 with care.

## 34. Add 1 to an integer?

Bit trick: `-~x` is `x+1` for two’s complement (`~x` is bitwise NOT). Puzzle answer; in production use `x + 1`.

## 35. Find Xor of a number without using XOR operator?

Boolean algebra: `a ^ b` equals `(a & ~b) | (~a & b)` without using `^` operator.

## 36. Determine if two integers are equal without using comparison and arithmetic operators?

For integers: `!(a ^ b)` is 1 if equal (also `((a ^ b) | -(a ^ b)) >> 31` patterns—avoid for floats).

## 37. Find minimum or maximum of two integers without using branching?

Branchless min of a,b: `b ^ ((a ^ b) & -(a < b))` (with `a<b` as 0/1—still a comparison). Or use `a < b ? a : b` in real code.

## 38. Find missing and repeating number / Set mismatch?

Array 1..n with one duplicate and one missing: XOR/sum mismatch, or cycle detection on index as pointer (Floyd). Use `long long` for sum difference to avoid overflow.

## 39. Maximum Product of Word Lengths?

Bitmask each word’s letter set; for each pair, if `mask[i] & mask[j] == 0`, update max `len[i]*len[j]`. O(n² * 26) with early skips.

## 40. Check if a String Contains all binary codes of size k?

Rolling hash on binary string of length k over sliding window; track seen in hash set; need 2^k distinct substrings—use deque on large inputs.

## 41. Find the Duplicate Number?

Classic: array values 1..n with one duplicate—Floyd cycle on index chain `i -> a[i]`, or XOR/sum math. LeetCode 287: treat as linked list cycle.
