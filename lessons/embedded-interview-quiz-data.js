/**
 * MCQ bank from EmbeddedInterviewPrep (questions.json + questions_more.json)
 * Regenerate: python3 scripts/build_embedded_interview_quiz_data.py
 */
window.embeddedInterviewQuiz = {
  "source": "EmbeddedInterviewPrep",
  "prepPath": "/home/neeraj/Desktop/EmbeddedInterviewPrep",
  "categories": [
    {
      "id": "bit_manipulation",
      "title": "Bit manipulation",
      "description": "Masks, XOR, powers of two (from your PDF index)."
    },
    {
      "id": "embedded_c",
      "title": "Embedded C",
      "description": "Storage classes, pointers, malloc, volatile (from your notes)."
    },
    {
      "id": "embedded_systems",
      "title": "Embedded systems",
      "description": "Interrupts, DMA, watchdog, memory."
    }
  ],
  "questions": {
    "bit_manipulation": [
      {
        "question_text": "To check if the i-th bit (0-based) is set in an integer `n`, which expression is correct?",
        "options": [
          "(n >> i) & 1",
          "n & (1 << i)",
          "Both A and B work",
          "n | (1 << i)"
        ],
        "correct_index": 2,
        "difficulty": "easy"
      },
      {
        "question_text": "To set the i-th bit of `n` to 1, you typically use:",
        "options": [
          "n &= ~(1 << i)",
          "n |= (1 << i)",
          "n ^= (1 << i)",
          "n = n >> i"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "To clear the i-th bit of `n` to 0, you typically use:",
        "options": [
          "n |= (1 << i)",
          "n &= ~(1 << i)",
          "n ^= (1 << i)",
          "n = ~n"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Removing the lowest set bit from `n` (n > 0) is done with:",
        "options": [
          "n = n & (n - 1)",
          "n = n | (n - 1)",
          "n = n ^ (n + 1)",
          "n = n >> 1"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Which is true for testing if a positive integer `n` is a power of two?",
        "options": [
          "(n & (n - 1)) == 0 and n != 0",
          "n % 2 == 0",
          "(n & 1) == 0",
          "n & (n + 1) == 0"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "The population count (number of set bits) of `n` is often computed using:",
        "options": [
          "Only a single XOR",
          "Repeatedly: n &= n - 1 in a loop",
          "n = n / 2 only",
          "Cannot be done in C"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "XOR of a number with itself is:",
        "options": [
          "1",
          "The number unchanged",
          "0",
          "Undefined"
        ],
        "correct_index": 2,
        "difficulty": "easy"
      },
      {
        "question_text": "Swapping two integers `a` and `b` without a temp using XOR requires:",
        "options": [
          "a ^= b; b ^= a; a ^= b;",
          "a = a + b; b = a - b; a = a - b; always safe",
          "Only a = b",
          "Not possible in C"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "For 32-bit two's complement, right shift of a signed negative integer is typically:",
        "options": [
          "Always logical (zero fill)",
          "Implementation-defined or arithmetic depending on C standard/version",
          "Always undefined",
          "Same as unsigned shift"
        ],
        "correct_index": 1,
        "difficulty": "hard"
      },
      {
        "question_text": "To isolate the lowest set bit of `n`:",
        "options": [
          "n & -n",
          "n | -n",
          "n ^ -n",
          "~n"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "XOR of all numbers from 1 to n has a closed form pattern useful for competitive/bit problems. For n mod 4 == 0, XOR(1..n) equals:",
        "options": [
          "n",
          "1",
          "n+1",
          "0"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "What does `n ^ n` evaluate to for any integer `n`?",
        "options": [
          "n",
          "2n",
          "0",
          "-1"
        ],
        "correct_index": 2,
        "difficulty": "hard"
      },
      {
        "question_text": "Toggle the i-th bit of `n` (0-based) using XOR:",
        "options": [
          "n ^= (1 << i)",
          "n &= (1 << i)",
          "n |= ~(1 << i)",
          "n <<= i"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Left shift `n << 1` on unsigned 32-bit is equivalent to:",
        "options": [
          "n / 2",
          "n * 2",
          "n + 1",
          "n ^ 1"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "For unsigned `n`, right shift `n >> 1` is typically:",
        "options": [
          "Multiply by 2",
          "Divide by 2 (floor)",
          "Undefined",
          "Rotate"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "Bitmask to keep only lower 8 bits of `n`:",
        "options": [
          "n & 0xFF",
          "n | 0xFF",
          "n ^ 0xFF",
          "~n"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Which clears bits 3 through 7 (inclusive) in `n`?",
        "options": [
          "n &= ~0xF8",
          "n |= 0xF8",
          "n ^= 0xFF",
          "n &= 0xF8"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Parity (even) of set bits can be computed using repeated:",
        "options": [
          "Addition only",
          "XOR of all bits",
          "OR of all bits",
          "AND of all bits"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "`INT_MAX + 1` on signed int overflow in C is:",
        "options": [
          "Always defined as 0",
          "Undefined behavior for signed overflow",
          "Always wraps silently",
          "Always traps"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Endianness describes:",
        "options": [
          "CPU clock speed",
          "Order of bytes in multi-byte values",
          "Cache size",
          "Pointer size"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "On a little-endian system, least significant byte of a 32-bit int is stored at:",
        "options": [
          "Highest address",
          "Lowest address",
          "Middle",
          "Register only"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "`htonl` is used to:",
        "options": [
          "Convert host to network byte order (32-bit)",
          "Allocate memory",
          "Hash strings",
          "Toggle bits"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Count trailing zeros (CTZ) of `n` is useful for:",
        "options": [
          "Finding lowest set bit index",
          "Sorting arrays",
          "String length",
          "Floating point"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`n & (n-1)` removes:",
        "options": [
          "Highest set bit",
          "Lowest set bit",
          "All bits",
          "Sign bit only"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "A number is a multiple of 4 if:",
        "options": [
          "(n & 1) == 0",
          "(n & 2) == 0",
          "(n & 3) == 0",
          "(n & 4) == 0"
        ],
        "correct_index": 2,
        "difficulty": "easy"
      },
      {
        "question_text": "Bit-reverse of `n` (within fixed width) is used in:",
        "options": [
          "Some FFT algorithms",
          "malloc",
          "printf",
          "strcpy"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Gray code of binary `n` is often `n ^ (n >> 1)`; Gray codes differ by:",
        "options": [
          "Two bits",
          "Exactly one bit",
          "All bits",
          "No bits"
        ],
        "correct_index": 1,
        "difficulty": "hard"
      },
      {
        "question_text": "`~0u` on 32-bit unsigned is:",
        "options": [
          "0",
          "UINT_MAX",
          "1",
          "Undefined"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Mask to select bits [4:1] (4 bits starting at bit 1):",
        "options": [
          "0x1E",
          "0xF0",
          "0x0F",
          "0x3C"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`a & b | a & c | b & c` relates to:",
        "options": [
          "Majority vote of three bits",
          "Always zero",
          "Parity",
          "Endian swap"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "SIMD-style parallelism is least related to:",
        "options": [
          "Vector instructions",
          "Bitwise AND on scalars",
          "GPU lanes",
          "NEON/AVX"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Compute `n % 32` using bitwise ops (n unsigned):",
        "options": [
          "n & 31",
          "n | 31",
          "n ^ 31",
          "n >> 31"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`1U << 31` on 32-bit unsigned is:",
        "options": [
          "0",
          "0x80000000",
          "Undefined",
          "1"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Sign extension when casting `int8_t` x to `int32_t` replicates:",
        "options": [
          "MSB of x",
          "LSB",
          "Always zero",
          "Random"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Branchless `min(a,b)` sometimes uses:",
        "options": [
          "Only division",
          "XOR/select tricks or compares",
          "Only sqrt",
          "malloc"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "Bloom filters rely on:",
        "options": [
          "Multiple hash functions and bit array",
          "Sorting",
          "Linked lists",
          "Only trees"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Find if exactly one bit set in `n` (power of two test):",
        "options": [
          "(n & (n-1))==0 && n",
          "n%2==0",
          "n&1",
          "n==0"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Rotate left `n` by `k` bits (width w):",
        "options": [
          "((n << k) | (n >> (w-k))) & mask",
          "n + k",
          "n ^ k",
          "n & k"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Hamming weight is another name for:",
        "options": [
          "Population count",
          "CRC",
          "Parity bit only",
          "Endianness"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`ffs()` / find first set (POSIX) returns:",
        "options": [
          "Index of least significant 1-bit",
          "Highest bit",
          "Popcount",
          "Log10"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Bitmask for inclusive range [hi:lo] bits:",
        "options": [
          "((1<<(hi-lo+1))-1)<<lo",
          "hi+lo",
          "1<<hi+lo",
          "0"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "XOR linked list pointer trick stores:",
        "options": [
          "Both prev and next in one field using XOR",
          "Sorted data",
          "Floats",
          "DMA state"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`n & -n` gives:",
        "options": [
          "Lowest set bit only",
          "Highest set bit",
          "n+1",
          "Always zero"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Signed right shift of -8 >> 1 often yields:",
        "options": [
          "-4 on two's complement arithmetic shift",
          "Large positive",
          "0",
          "Undefined always"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`uint32_t` rotation needs masking because:",
        "options": [
          "Shifts on uint are modulo width in C",
          "Shifts never wrap",
          "uint has no bits",
          "Illegal"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Bitset / bitmap allocator uses arrays of:",
        "options": [
          "Words of bits",
          "Floats",
          "Chars only",
          "Doubles"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Compute `n % 64` with bitwise ops (unsigned):",
        "options": [
          "n & 63",
          "n | 63",
          "n >> 6",
          "n + 64"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Isolate highest set bit (MSB) of `n` (classic bit hack uses:",
        "options": [
          "Loops or table; related to `n |= n>>1; ...` patterns",
          "Only n&1",
          "Only /2",
          "sqrt"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Subset XOR sum problems often use:",
        "options": [
          "Linear basis / Gaussian elimination over GF(2)",
          "Only sorting",
          "Only trees",
          "Only floats"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`__builtin_popcount` (GCC) returns:",
        "options": [
          "Population count",
          "Leading zeros",
          "Trailing zeros",
          "Sign"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`__builtin_clz` counts:",
        "options": [
          "Leading zeros",
          "Popcount",
          "Parity",
          "CRC"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "De Bruijn sequence bit tricks help:",
        "options": [
          "Constant-time lowest bit index tables",
          "malloc",
          "FFT only",
          "USB"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`n ^ m ^ n` simplifies to:",
        "options": [
          "m",
          "0",
          "n",
          "2n"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Swap two bits at positions i,j in n (conceptually):",
        "options": [
          "Mask, shift, merge",
          "Only addition",
          "Impossible",
          "Only float"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Next permutation on bits (combinatorial) differs from:",
        "options": [
          "Simple increment always",
          "Lexicographic bit patterns",
          "Only XOR",
          "Endian"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "`uint64_t` shift >= 64 in C is:",
        "options": [
          "Undefined behavior",
          "Defined wrap",
          "Always 0",
          "Mod 32"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      }
    ],
    "embedded_c": [
      {
        "question_text": "What does the `register` keyword suggest to the compiler in C?",
        "options": [
          "Variable must live in ROM",
          "Hint that the variable may be stored in a CPU register for speed",
          "Variable is volatile",
          "Variable is thread-local"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Compared to a function-like macro, an inline function typically:",
        "options": [
          "Never performs type checking",
          "Can provide better type checking and safer semantics",
          "Is always slower",
          "Cannot return values"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Which statement about `malloc` is most accurate?",
        "options": [
          "It zero-initializes memory",
          "It allocates uninitialized memory; contents are indeterminate",
          "It always allocates from stack",
          "It takes two arguments: count and size"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`calloc(n, size)` differs from `malloc(n * size)` mainly because calloc:",
        "options": [
          "Allocates on stack",
          "Allocates and initializes all bytes to zero",
          "Is always faster",
          "Frees memory automatically"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "A `static` function in a C file is visible:",
        "options": [
          "Everywhere in the program",
          "Only within that translation unit (file)",
          "Only in main()",
          "Only to the linker"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "A pointer that still references freed memory is called:",
        "options": [
          "Null pointer",
          "Wild pointer",
          "Dangling pointer",
          "Void pointer"
        ],
        "correct_index": 2,
        "difficulty": "easy"
      },
      {
        "question_text": "A pointer declared but not initialized to any valid address may be called:",
        "options": [
          "Null pointer",
          "Wild pointer",
          "Dangling pointer",
          "Generic pointer"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`void*` in C is useful because it:",
        "options": [
          "Points to nothing",
          "Can hold any object pointer and must be cast before dereferencing",
          "Is always 64-bit",
          "Cannot be assigned"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`volatile` tells the compiler that:",
        "options": [
          "The variable is constant",
          "The variable may change unexpectedly (e.g., hardware); optimizations must be careful",
          "The variable is in register only",
          "The code is C++"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "Why might embedded code use `volatile` for MMIO registers?",
        "options": [
          "To make access slower",
          "So reads/writes are not optimized away or reordered incorrectly",
          "To allocate in BSS",
          "To enable floating point"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "`realloc(ptr, new_size)` may:",
        "options": [
          "Always shrink in place only",
          "Move the block and copy data; old ptr may be invalid after success",
          "Never return NULL",
          "Free ptr without allocating"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "The `extern` keyword on a global variable declaration in a header typically:",
        "options": [
          "Allocates storage in every file",
          "Declares existence without defining storage (definition in one .c file)",
          "Makes the variable static",
          "Forces inline"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "`sizeof(char)` in C is:",
        "options": [
          "0",
          "1",
          "2",
          "Implementation-defined > 1"
        ],
        "correct_index": 1,
        "difficulty": "hard"
      },
      {
        "question_text": "`const int *p` means:",
        "options": [
          "p is const",
          "pointed-to int is const",
          "both const",
          "invalid"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`int * const p` means:",
        "options": [
          "pointed int is const",
          "pointer p is const",
          "both const",
          "invalid"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`memcpy` requires that source and destination:",
        "options": [
          "Never overlap",
          "Always overlap",
          "Are same size types only",
          "Are null-terminated"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`memmove` handles:",
        "options": [
          "Overlapping regions safely",
          "Only stack memory",
          "Only heap",
          "Strings only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`strncpy` may leave the destination:",
        "options": [
          "Always null-terminated",
          "Without null if source is long",
          "Always padded with zeros past len",
          "Invalid"
        ],
        "correct_index": 1,
        "difficulty": "hard"
      },
      {
        "question_text": "`snprintf` is preferred over `sprintf` because:",
        "options": [
          "It is faster",
          "It bounds writes to prevent buffer overflow",
          "It allocates heap",
          "It returns float"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "Undefined behavior examples include:",
        "options": [
          "Signed integer overflow in C",
          "Using memcpy on non-overlap",
          "Using const correctly",
          "All array access"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Sequence points / side effects: `i++ + i++` is:",
        "options": [
          "Well-defined",
          "Unspecified or UB in many cases",
          "Always 2*i",
          "Always 0"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`union` members share:",
        "options": [
          "The same memory location",
          "Separate stacks",
          "Heap only",
          "Read-only space"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Structure padding exists primarily due to:",
        "options": [
          "Alignment requirements",
          "Compiler bugs",
          "Randomness",
          "printf"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`#pragma pack` can:",
        "options": [
          "Reduce alignment/padding (with tradeoffs)",
          "Speed up all code",
          "Remove volatile",
          "Replace malloc"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`restrict` pointer promises:",
        "options": [
          "Pointer is NULL",
          "No other pointer aliases the same object in scope",
          "Pointer is const",
          "Pointer is volatile"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "`static` local variable lifetime is:",
        "options": [
          "Only during function call",
          "Program lifetime",
          "Thread-local always",
          "Heap allocated"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`enum` constants in C are:",
        "options": [
          "Always 64-bit",
          "Integral type compatible with int",
          "Always float",
          "Strings"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`intptr_t` is for:",
        "options": [
          "Storing pointers as integers portably",
          "Floating math",
          "Only ARM",
          "Only file offsets"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Calling `free` twice on same pointer is:",
        "options": [
          "Safe",
          "Undefined behavior",
          "Always ignored",
          "Reallocates"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`assert` is typically:",
        "options": [
          "Enabled in release for all compilers",
          "Stripped in NDEBUG release builds",
          "A syscall",
          "Same as static_assert"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`static_assert` / `_Static_assert` checks at:",
        "options": [
          "Runtime only",
          "Compile time",
          "Link time only",
          "Never"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "Flexible array member must be:",
        "options": [
          "First member of struct",
          "Last member of struct",
          "Middle member",
          "Not allowed in C"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Bit-field layout is:",
        "options": [
          "Fully portable",
          "Implementation-defined",
          "Always 32-bit",
          "Forbidden in embedded"
        ],
        "correct_index": 1,
        "difficulty": "hard"
      },
      {
        "question_text": "`volatile` applies to:",
        "options": [
          "Optimization assumptions about access",
          "Automatic const correctness",
          "Heap only",
          "C++ references"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Stack overflow in embedded is often detected by:",
        "options": [
          "Hardware MPU/stack canary / careful sizing",
          "malloc",
          "printf",
          "volatile"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`const` data may be placed in:",
        "options": [
          "ROM/flash in embedded toolchains",
          "Only heap",
          "Only registers",
          "GPU"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Function pointer type for `int f(int)` is:",
        "options": [
          "int f(int)",
          "int (*pf)(int)",
          "int *f(int)",
          "pointer int f"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "`qsort` comparison should return negative if:",
        "options": [
          "a < b",
          "a > b",
          "equal",
          "random"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`bsearch` requires:",
        "options": [
          "Sorted array",
          "Unsorted OK",
          "Linked list",
          "Heap"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Integer promotion: `unsigned char` operands often promote to:",
        "options": [
          "unsigned char still",
          "int",
          "double",
          "long double"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "`size_t` is best for:",
        "options": [
          "Sizes and array indexing (non-negative)",
          "Signed offsets only",
          "Float sizes",
          "File handles"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Double free is:",
        "options": [
          "Safe if NULL",
          "Undefined behavior (even if patterns exist)",
          "Defined in C11",
          "Same as free"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "`alloca` allocates on:",
        "options": [
          "Heap",
          "Stack (non-standard extension)",
          "BSS",
          "ROM"
        ],
        "correct_index": 1,
        "difficulty": "hard"
      },
      {
        "question_text": "Best practice for MMIO: use",
        "options": [
          "volatile pointers to hardware addresses",
          "float*",
          "only stack arrays",
          "register int for all"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`strnlen` is safer than `strlen` when:",
        "options": [
          "You have a maximum buffer bound",
          "Never",
          "Only on heap",
          "Only C++"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`strdup` is:",
        "options": [
          "POSIX/C23 extension; allocates copy",
          "Always in C89",
          "Stack only",
          "Macro only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`aligned_alloc` requires:",
        "options": [
          "Size multiple of alignment",
          "alignment=1 only",
          "Only stack",
          "C89 only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Unspecified behavior vs UB: reading uninitialized automatic `int` is:",
        "options": [
          "Unspecified value",
          "Always 0",
          "UB in many cases",
          "Defined"
        ],
        "correct_index": 2,
        "difficulty": "medium"
      },
      {
        "question_text": "`goto` across initialization in C is:",
        "options": [
          "Always fine",
          "Constrained; can be ill-formed",
          "Only C++",
          "Impossible"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Variable-length array (VLA) in C99 on stack:",
        "options": [
          "May fail at runtime if too large",
          "Unlimited always",
          "Heap always",
          "C++ core feature"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`setjmp/longjmp` can skip:",
        "options": [
          "Destructors (C++) / careful in C too",
          "Nothing",
          "Only malloc",
          "Only IRQ"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`printf(\"%p\", (void*)p)` prints:",
        "options": [
          "Implementation-defined pointer representation",
          "Always decimal",
          "Physical address",
          "PID"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Integer constant `0` converts to:",
        "options": [
          "Any null pointer value",
          "Always int",
          "Always void*",
          "Error"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`offsetof(struct S, m)` requires:",
        "options": [
          "stddef.h",
          "math.h",
          "Only C++",
          "inline only"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`container_of` macro pattern needs:",
        "options": [
          "Address of member + offsetof",
          "malloc",
          "Only C++",
          "virtual"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`volatile` on struct member affects:",
        "options": [
          "Accesses to that member",
          "Whole program speed",
          "Linker only",
          "Only const"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`const` correctness: casting away const and writing is:",
        "options": [
          "Often UB if object was originally const",
          "Always safe",
          "Only C++",
          "Defined"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`intptr_t` conversion of pointers:",
        "options": [
          "Implementation-defined; use carefully",
          "Always lossless",
          "Illegal",
          "Only 32-bit"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Strict aliasing rule: accessing through incompatible type is:",
        "options": [
          "Often UB",
          "Always OK with cast",
          "Only for floats",
          "Defined"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`memcpy` to overlapping buffers is:",
        "options": [
          "Undefined behavior",
          "Safe",
          "Same as memmove always",
          "Only for ints"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`exit` vs `_Exit`: `_Exit`:",
        "options": [
          "Does not run `atexit` handlers",
          "Runs atexit",
          "Only C++",
          "Restarts"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`atexit` handlers run:",
        "options": [
          "On normal `exit`",
          "On crash",
          "Never",
          "Before main only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`main` return value goes to:",
        "options": [
          "Host environment / OS",
          "Always stdout",
          "Heap",
          "Watchdog"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Macro multiple evaluation: `MAX(a++)` pitfalls are:",
        "options": [
          "Side effects duplicated",
          "Never happen",
          "Only with inline",
          "C++ only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`#include` guards prevent:",
        "options": [
          "Double inclusion issues",
          "Optimization",
          "Linking",
          "DMA errors"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`static` global variable linkage is:",
        "options": [
          "Internal to translation unit",
          "External always",
          "Weak only",
          "DLL export"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Translation unit is roughly:",
        "options": [
          "One .c file after preprocessing",
          "Whole program",
          "One function",
          "One header"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`extern inline` / inline linkage rules are:",
        "options": [
          "Compiler-specific nuances",
          "Always simple",
          "Illegal",
          "Only Java"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`errno` after failing `malloc` should be checked:",
        "options": [
          "Not guaranteed by C standard alone",
          "Always EINVAL",
          "Always 0",
          "Useless"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`FILE*` stream error indicator: use",
        "options": [
          "ferror()",
          "errno only",
          "printf",
          "volatile"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`fread` return value should be compared to:",
        "options": [
          "Expected element count",
          "Always 1",
          "sizeof",
          "NULL"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`realloc(NULL, size)` behaves like:",
        "options": [
          "malloc(size)",
          "free",
          "noop",
          "calloc"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`calloc` overflow check: `n * size` can overflow; modern calloc:",
        "options": [
          "May check internally",
          "Never overflows",
          "Uses float",
          "Illegal"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Pointer subtraction `p - q` valid only if:",
        "options": [
          "Same array object",
          "Any pointers",
          "Any void*",
          "Always"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`sizeof` on VLA is evaluated at:",
        "options": [
          "Runtime",
          "Always compile time",
          "Never",
          "Link time"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`char` signedness is:",
        "options": [
          "Implementation-defined",
          "Always signed",
          "Always unsigned",
          "float"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`uint8_t` printing: cast to `unsigned int` avoids:",
        "options": [
          "Unexpected sign extension on some platforms",
          "Nothing",
          "DMA issues",
          "SPI errors"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`memcpy` to device register buffer may need:",
        "options": [
          "volatile or proper barriers",
          "Only float",
          "Nothing",
          "realloc"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Compiler barrier / memory barrier in concurrent bare-metal often needs:",
        "options": [
          "Hardware-specific instructions or intrinsics",
          "Only volatile",
          "Only malloc",
          "Nothing"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`printf` format `%zu` is for:",
        "options": [
          "size_t",
          "ssize_t",
          "float",
          "pointer"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`ptrdiff_t` is for:",
        "options": [
          "Difference of two pointers to same array object",
          "malloc size",
          "File size",
          "Thread ID"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`errno` thread-local in POSIX:",
        "options": [
          "Often yes via TLS",
          "Never",
          "Global only",
          "Per file"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`fgets` includes newline if:",
        "options": [
          "Room in buffer and line ended with newline",
          "Never",
          "Always strips",
          "Only binary"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`perror` prints:",
        "options": [
          "errno-based message to stderr",
          "stdout only",
          "Nothing",
          "Stack trace"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`strtol` allows:",
        "options": [
          "Base and error checking via endptr",
          "Only base 10",
          "No errors",
          "Only floats"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`isdigit` vs `isdigit((unsigned char)c)` note:",
        "options": [
          "Cast avoids UB for negative char",
          "Never needed",
          "Only C++",
          "Only ARM"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`toupper` / locale:",
        "options": [
          "May depend on locale",
          "Always ASCII only",
          "Only macros",
          "Heap"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`memcmp` compares:",
        "options": [
          "Raw bytes",
          "Null-terminated strings only",
          "Unicode",
          "Structs portably always"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`memset` to zero structs:",
        "options": [
          "Common; padding may remain",
          "Guaranteed all padding zero",
          "Illegal",
          "Only ints"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`#define` vs `const int` for array size in C:",
        "options": [
          "`const int` not always compile-time in older C for array size",
          "Always same",
          "Never use const",
          "Only C++"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Compound literal `(struct S){1,2}` lifetime:",
        "options": [
          "Automatic storage in block scope",
          "Static always",
          "Heap",
          "Invalid in C"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Designated initializers `struct s = {.x=1}` are:",
        "options": [
          "C99",
          "C89 only",
          "C++ only",
          "Invalid"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`typeof` is:",
        "options": [
          "GCC extension (also in some standards)",
          "C89",
          "Only Java",
          "Only MSVC"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`__attribute__((packed))` may:",
        "options": [
          "Break alignment assumptions; careful with unaligned access",
          "Always safe",
          "Only C++",
          "Disable interrupts"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`weak` symbol linkage:",
        "options": [
          "Can be overridden by strong symbol",
          "Always wins",
          "Illegal",
          "Only C++"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`asm volatile` in GCC inline asm:",
        "options": [
          "Compiler may not delete; clobber list matters",
          "Always optimized out",
          "Only x86",
          "Only kernel"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`stdatomic.h` provides:",
        "options": [
          "Atomic operations for concurrency",
          "Only mutex",
          "Only DMA",
          "Graphics"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`_Noreturn` on function:",
        "options": [
          "Tells compiler function does not return",
          "Returns twice",
          "Only C++",
          "Inline only"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "`aligned_union` / max_align_t relates to:",
        "options": [
          "Alignment of storage",
          "Only float",
          "Only bit fields",
          "Endian"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      }
    ],
    "embedded_systems": [
      {
        "question_text": "In a typical bare-metal MCU, where does the interrupt vector table usually reside?",
        "options": [
          "Heap",
          "Fixed memory region at reset (often start of flash)",
          "Stack only",
          "External SDRAM always"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "Interrupt latency is most affected by:",
        "options": [
          "Only CPU clock",
          "ISR length, interrupt masking, and priority/preemption",
          "Only compiler brand",
          "Only printf usage in main"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "Watchdog timers are used to:",
        "options": [
          "Increase power always",
          "Reset the system if firmware stops servicing them in time",
          "Measure exact nanoseconds only",
          "Replace the main clock"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "DMA is primarily used to:",
        "options": [
          "Replace the CPU entirely",
          "Transfer data between peripherals and memory with minimal CPU involvement",
          "Increase stack size",
          "Debug only"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "A race condition between an ISR and main code sharing data is often solved by:",
        "options": [
          "Ignoring it",
          "Disabling interrupts briefly, atomics, or buffers with careful design",
          "Using only floats",
          "Doubling RAM"
        ],
        "correct_index": 1,
        "difficulty": "medium"
      },
      {
        "question_text": "Flash memory compared to RAM on MCUs is typically:",
        "options": [
          "Faster for random writes",
          "Non-volatile and slower for erase/program cycles",
          "Volatile",
          "Same speed as cache always"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "UART async communication needs:",
        "options": [
          "Shared clock line always",
          "Agreed baud rate",
          "DMA only",
          "SPI mode"
        ],
        "correct_index": 1,
        "difficulty": "hard"
      },
      {
        "question_text": "SPI typically has signals:",
        "options": [
          "SDA/SCL",
          "MISO/MOSI/SCK/CS",
          "TX/RX only",
          "D+ D-"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "I2C uses:",
        "options": [
          "Push-pull outputs always",
          "Open-drain with pull-ups",
          "Single wire UART",
          "Differential pairs only"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "I2C clock stretching allows:",
        "options": [
          "Slave to hold SCL low",
          "Master to stop forever",
          "USB speed change",
          "DMA pause"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Cortex-M NVIC manages:",
        "options": [
          "Interrupt priorities and enables",
          "FPU only",
          "Cache only",
          "Ethernet PHY"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "SysTick is often used for:",
        "options": [
          "RTOS tick / timebase",
          "USB PHY",
          "ADC calibration only",
          "JTAG"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Brown-out detector (BOD) helps:",
        "options": [
          "Detect low supply voltage",
          "Increase voltage",
          "USB enumeration",
          "DMA speed"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "JTAG/SWD are used for:",
        "options": [
          "Debugging and programming",
          "Ethernet",
          "Audio",
          "Battery charging"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Flash wear: repeated erase/program cycles:",
        "options": [
          "Are unlimited",
          "Wear out cells over time",
          "Only affect RAM",
          "Only on SD cards"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Option bytes / fuses may control:",
        "options": [
          "Read protection, brown-out, watchdog",
          "Only LED color",
          "WiFi password",
          "Compiler version"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "GPIO alternate function mux selects:",
        "options": [
          "Which peripheral drives the pin",
          "Only pull-up value",
          "CPU frequency",
          "Heap size"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Timer PWM mode varies:",
        "options": [
          "Duty cycle via compare register",
          "Only frequency",
          "Only ADC",
          "USB bit stuffing"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "ADC sampling time tradeoff:",
        "options": [
          "Longer sample → better for higher source impedance",
          "Always use minimum",
          "Unrelated",
          "Only for audio"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "DMA circular mode is useful for:",
        "options": [
          "Continuous UART/ADC streaming buffers",
          "One-shot SPI",
          "GPIO toggle only",
          "JTAG"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Cache coherency matters when:",
        "options": [
          "CPU and DMA access same RAM",
          "Only when using printf",
          "Never on MCUs",
          "Only x86 servers"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "RTOS mutex vs semaphore: mutex often supports:",
        "options": [
          "Priority inheritance",
          "Only counting",
          "Only polling",
          "USB"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Deadlock needs at least:",
        "options": [
          "One task",
          "Circular wait for resources",
          "Only interrupts",
          "Only DMA"
        ],
        "correct_index": 1,
        "difficulty": "easy"
      },
      {
        "question_text": "Priority inversion can be mitigated by:",
        "options": [
          "Priority inheritance / ceiling",
          "Lower CPU clock",
          "More printf",
          "Disabling caches"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "ISR should avoid:",
        "options": [
          "Long blocking work / heavy printf",
          "Quick register clears",
          "Clearing flags",
          "Minimal work"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Re-entrant function is safe if:",
        "options": [
          "Uses only stack locals and no static state conflicts",
          "Uses only static globals",
          "Calls malloc always",
          "Always inline"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Bootloader updates application in:",
        "options": [
          "Flash regions; may use dual-bank",
          "Only RAM",
          "Only EEPROM on PC",
          "GPU memory"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "CRC is used in embedded for:",
        "options": [
          "Data integrity checks",
          "Compression",
          "Encryption always",
          "Floating point"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "HAL vs register-level coding:",
        "options": [
          "HAL abstracts peripherals; may cost overhead",
          "Always slower by 10x",
          "Impossible on ARM",
          "Same as Python"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Low-power modes (sleep/stop) trade:",
        "options": [
          "Wake latency vs current consumption",
          "Nothing",
          "Only GPIO",
          "ADC accuracy only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "External interrupts EXTI are configured via:",
        "options": [
          "Edge selection and masks",
          "Only timer",
          "Only UART",
          "Ethernet MAC"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Quadrature encoder decoding often uses:",
        "options": [
          "GPIO interrupts / timer modes",
          "Only ADC",
          "SPI only",
          "USB"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "PLL generates:",
        "options": [
          "Higher internal clock from reference",
          "Lower voltage",
          "USB packets",
          "ADC noise"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Crossbar / bus matrix routes:",
        "options": [
          "Masters (CPU, DMA) to slaves (mem, peripherals)",
          "Only JTAG",
          "WiFi",
          "Bluetooth pairing"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Semihosting in embedded:",
        "options": [
          "Uses debugger for I/O; not for production",
          "Fast production logging",
          "Required",
          "Hardware DMA"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "ECC in RAM/flash controllers helps:",
        "options": [
          "Detect/correct some bit errors",
          "Increase clock",
          "Reduce pins",
          "USB speed"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "TRNG/HRNG peripheral provides:",
        "options": [
          "Random numbers for crypto seeds",
          "Deterministic PWM",
          "ADC calibration",
          "I2C addresses"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "MPU (Memory Protection Unit) can:",
        "options": [
          "Restrict access regions",
          "Speed up printf",
          "Replace MMU fully like Linux",
          "Disable interrupts"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "FPU context: lazy stacking on Cortex-M4F:",
        "options": [
          "Defers FPU save until FPU used in ISR",
          "Always saves 1KB",
          "Disables DMA",
          "Only for USB"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Bit-banging GPIO for protocol is:",
        "options": [
          "Software-timed; can be CPU heavy",
          "Always faster than hardware",
          "DMA-only",
          "Impossible"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Oscillator HSE vs HSI:",
        "options": [
          "HSE external crystal often more accurate",
          "HSI always faster",
          "HSE is internal",
          "Same thing"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Brown-out vs POR:",
        "options": [
          "POR on power-up; BOD monitors voltage during run",
          "Identical",
          "Only Ethernet",
          "Only WiFi"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Linker script defines:",
        "options": [
          "Memory regions and section placement",
          "CPU temperature",
          "WiFi SSID",
          "USB descriptors only"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "`.bss` section holds:",
        "options": [
          "Zero-initialized globals",
          "Constants in ROM",
          "Stack frames",
          "Interrupt vectors only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`.text` is typically:",
        "options": [
          "Program code in flash",
          "Heap",
          "Registers",
          "DMA descriptors"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Vector table offset register allows:",
        "options": [
          "Relocate vector table (bootloader)",
          "Change CPU ID",
          "USB speed",
          "ADC gain"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "HardFault on Cortex-M may indicate:",
        "options": [
          "Invalid memory access, unaligned, etc.",
          "Normal sleep",
          "Successful DMA",
          "GPIO toggle"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "SysTick calibration value is:",
        "options": [
          "Chip-specific; may aid tick accuracy",
          "Always 1000",
          "USB VID",
          "Random"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "DMA burst vs single:",
        "options": [
          "Burst can improve throughput on wide buses",
          "Always illegal",
          "Same as IRQ",
          "JTAG only"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Analog watchdog in ADC can:",
        "options": [
          "Trigger interrupt on threshold crossing",
          "Replace DMA",
          "Encode USB",
          "Set I2C address"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "CAN bus uses:",
        "options": [
          "Differential pair, arbitration by ID priority",
          "Single wire UART",
          "SPI only",
          "USB"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "LIN bus is:",
        "options": [
          "Low-cost single-wire master/slave",
          "Same as CAN speed",
          "Ethernet",
          "PCIe"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "USB full-speed is:",
        "options": [
          "12 Mbps",
          "480 Mbps",
          "1 Mbps",
          "100 Mbps"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "USB device descriptors describe:",
        "options": [
          "Device capabilities and endpoints",
          "Only voltage",
          "Only flash size",
          "CPU ID"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Ethernet MAC + PHY: PHY handles:",
        "options": [
          "Analog line signaling",
          "TCP stack",
          "USB",
          "ADC"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "TCP/IP stack on MCU often:",
        "options": [
          "Smaller footprint with lwIP etc.",
          "Always runs Linux",
          "Impossible",
          "Only WiFi chips"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Modbus RTU framing uses:",
        "options": [
          "Slave address, function, CRC",
          "CAN IDs only",
          "USB descriptors",
          "SPI CS"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "RS-485 is:",
        "options": [
          "Differential multi-drop serial",
          "Same as UART voltage levels always",
          "USB-C",
          "I2S"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Crystal load capacitors affect:",
        "options": [
          "Oscillator startup and frequency accuracy",
          "Only LED brightness",
          "DMA",
          "ADC reference"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Decoupling capacitors near IC supply pins help:",
        "options": [
          "Supply high-frequency current locally",
          "Increase EMI always",
          "Replace regulator",
          "Debug USB"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Reset pin RC network may:",
        "options": [
          "Control power-on reset timing",
          "Set baud rate",
          "Enable WiFi",
          "Configure PLL"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "EMI reduction techniques include:",
        "options": [
          "Proper grounding, slew rate, filtering",
          "More printf",
          "Higher clocks always",
          "Remove decoupling"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Watchdog clock independence matters so:",
        "options": [
          "It can reset if main clock fails",
          "It runs USB",
          "It speeds CPU",
          "It disables IRQ"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Brown-out interrupt can:",
        "options": [
          "Save state to flash before shutdown",
          "Always crash",
          "Disable watchdog",
          "Increase VCC"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "RTC backup domain on STM32-like MCUs:",
        "options": [
          "May keep time on battery",
          "Always loses time",
          "Uses USB",
          "Only Ethernet"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "GPIO speed/slew settings trade:",
        "options": [
          "EMI vs timing",
          "Only power",
          "Only ADC",
          "Nothing"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Analog reference voltage choice affects:",
        "options": [
          "ADC quantization step size",
          "UART baud",
          "SPI mode",
          "USB"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Op-amp before ADC can:",
        "options": [
          "Buffer and scale signals",
          "Replace DMA",
          "Generate USB",
          "Run RTOS"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Sampling theorem: need sample rate >",
        "options": [
          "2 * f_max (Nyquist)",
          "f_max",
          "f_max/2",
          "DC only"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Aliasing happens when:",
        "options": [
          "Signal has energy above Nyquist for sample rate",
          "Using DMA",
          "Using SPI",
          "Using printf"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Digital filter before downsampling helps:",
        "options": [
          "Anti-aliasing",
          "Increase EMI",
          "USB speed",
          "JTAG"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "H-bridge drives:",
        "options": [
          "Brushed DC motor direction",
          "Stepper only",
          "USB PHY",
          "Ethernet"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Stepper microstepping:",
        "options": [
          "Smoother motion via intermediate currents",
          "Only full steps",
          "USB feature",
          "DMA mode"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Encoder index pulse:",
        "options": [
          "Once per revolution reference",
          "Every step",
          "USB SOF",
          "SPI byte"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Cyclic redundancy check polynomial choice affects:",
        "options": [
          "Error detection properties",
          "CPU clock",
          "GPIO only",
          "PLL"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "AES accelerator in MCU:",
        "options": [
          "Speeds crypto; still need secure key storage",
          "Replaces TRNG always",
          "Only Linux",
          "USB only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Secure boot verifies:",
        "options": [
          "Firmware authenticity before execution",
          "Only voltage",
          "Only temperature",
          "Baud rate"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Read-out protection (RDP) on MCUs:",
        "options": [
          "Limits flash read via debug",
          "Increases RAM",
          "USB only",
          "SPI only"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "OTA update should verify:",
        "options": [
          "Signature/hash before boot switch",
          "Nothing",
          "Only file name",
          "GPIO only"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Dual-bank flash for firmware A/B:",
        "options": [
          "Allows fallback if update fails",
          "Impossible on MCU",
          "Only servers",
          "USB only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Task stack size in RTOS is critical because:",
        "options": [
          "Overflow corrupts memory",
          "It sets CPU frequency",
          "It configures UART",
          "It replaces NVIC"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "FreeRTOS `vTaskDelay` uses:",
        "options": [
          "Tick granularity",
          "nanosecond always",
          "SPI clock",
          "ADC"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Priority ceiling protocol reduces:",
        "options": [
          "Blocking chains in priority scheduling",
          "CPU MHz",
          "Flash wear",
          "USB errors"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Message queue vs mailbox:",
        "options": [
          "Queue holds multiple items typically",
          "Same always",
          "Only DMA",
          "Illegal"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Software timer in RTOS:",
        "options": [
          "Callback in timer service task context",
          "Runs in any ISR always",
          "Hardware only",
          "USB IRQ"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "`FromISR` FreeRTOS APIs must be used:",
        "options": [
          "Inside interrupt context",
          "In main only",
          "Never",
          "Only Linux"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Cortex-M4 DSP instructions help:",
        "options": [
          "Signal processing workloads",
          "USB enumeration",
          "Only GPIO",
          "JTAG"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "FPU lazy stacking saves:",
        "options": [
          "Stack memory when FPU unused in ISR",
          "Nothing",
          "Flash",
          "USB bandwidth"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Bit-banding (some ARM) maps:",
        "options": [
          "Individual bits to word addresses",
          "USB endpoints",
          "DMA channels",
          "PLL"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "SysTick as RTOS tick source is common because:",
        "options": [
          "Simple core peripheral",
          "Requires Ethernet",
          "USB only",
          "GPU"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "QSPI vs SPI:",
        "options": [
          "QSPI often multi-line I/O for flash",
          "Same as I2C",
          "USB",
          "Ethernet PHY"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "OctoSPI / OSPI:",
        "options": [
          "High-speed external memory mapped flash",
          "UART mode",
          "CAN only",
          "ADC"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "SD/eMMC uses:",
        "options": [
          "MMC/SD protocol; block transfers",
          "SPI always",
          "I2C only",
          "JTAG"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "NAND vs NOR flash:",
        "options": [
          "NAND higher density; NOR random read",
          "Identical",
          "NOR is always USB",
          "NAND is ROM"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Wear leveling in flash file systems:",
        "options": [
          "Spreads writes to prolong life",
          "Increases wear",
          "Only HDD",
          "USB only"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "ECC flash pages:",
        "options": [
          "Detect/correct bit errors in storage",
          "Increase clock",
          "SPI mode",
          "I2C pull-ups"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "TRNG health tests (NIST) help:",
        "options": [
          "Detect failure modes",
          "Speed up AES",
          "USB",
          "DMA"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "Side-channel attacks target:",
        "options": [
          "Power/timing leakage",
          "Only network",
          "Only stack size",
          "Only printf"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Glitch attacks on MCU:",
        "options": [
          "Violate voltage/clock assumptions",
          "Normal use",
          "Only Linux",
          "Ethernet"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Secure element stores:",
        "options": [
          "Keys with hardware protections",
          "Only firmware",
          "Only RAM",
          "ADC samples"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Tamper pins on chips:",
        "options": [
          "Detect physical intrusion",
          "USB D+",
          "SPI CS",
          "PWM"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Clock security system (CSS) may:",
        "options": [
          "Detect HSE failure and fallback",
          "Only USB",
          "Only ADC",
          "Disable NVIC"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "RCC / reset and clock control configures:",
        "options": [
          "Clock sources, dividers, enables",
          "Only GPIO",
          "Only DMA",
          "Only FPU"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "APB vs AHB buses:",
        "options": [
          "Different speed domains; bridges",
          "Same always",
          "USB only",
          "JTAG only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "DMA FIFO helps:",
        "options": [
          "Absorb bursts across clock domains",
          "Replace CPU",
          "USB only",
          "ADC reference"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Burst length in AXI/AHB DMA affects:",
        "options": [
          "Throughput and arbitration",
          "Only GPIO",
          "Only UART baud",
          "JTAG"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Scatter-gather DMA:",
        "options": [
          "Chained descriptors for non-contiguous buffers",
          "Single buffer only",
          "USB only",
          "Illegal"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Double-buffered UART RX with DMA:",
        "options": [
          "Process one buffer while hardware fills other",
          "Impossible",
          "Only polling",
          "SPI only"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Timer input capture measures:",
        "options": [
          "Pulse width / frequency",
          "Only PWM out",
          "ADC",
          "USB"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "One-pulse mode timer:",
        "options": [
          "Single pulse after trigger",
          "Continuous only",
          "USB SOF",
          "I2C"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Dead-time insertion in motor PWM:",
        "options": [
          "Prevents shoot-through in H-bridge",
          "Increases EMI only",
          "USB",
          "ADC"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Resolver / RDC vs encoder:",
        "options": [
          "Analog sin/cos position sensing",
          "Digital quadrature only",
          "USB",
          "SPI flash"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "CPLD vs FPGA in embedded:",
        "options": [
          "CPLD often simpler glue logic; FPGA more logic",
          "Identical",
          "Only CPU",
          "Only RAM"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "JTAG boundary scan can:",
        "options": [
          "Test board interconnects",
          "Run Linux",
          "USB data",
          "ADC"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "SWO (Serial Wire Output) for tracing:",
        "options": [
          "Single pin printf-style trace",
          "JTAG 4-wire only",
          "USB HS",
          "SPI"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "ETM / instruction trace:",
        "options": [
          "Deep CPU debug capability",
          "Only GPIO",
          "Only DMA",
          "WiFi"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "EnergyTrace measures:",
        "options": [
          "MCU current consumption profiling",
          "Voltage only",
          "USB",
          "Ethernet"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Radio sub-GHz vs 2.4GHz tradeoffs:",
        "options": [
          "Range vs antenna size / regulations",
          "Identical",
          "Only WiFi",
          "USB"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "BLE connection intervals affect:",
        "options": [
          "Latency vs power",
          "Nothing",
          "Only SPI",
          "ADC"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      },
      {
        "question_text": "Zigbee mesh:",
        "options": [
          "Many-to-many routing at low rate",
          "Same as BLE always",
          "USB",
          "Ethernet"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Modbus TCP vs RTU:",
        "options": [
          "TCP/IP vs serial framing",
          "Same",
          "USB only",
          "I2C"
        ],
        "correct_index": 0,
        "difficulty": "hard"
      },
      {
        "question_text": "OPC-UA in industrial:",
        "options": [
          "Rich information modeling for machines",
          "Only Modbus",
          "Only USB",
          "Only GPIO"
        ],
        "correct_index": 0,
        "difficulty": "easy"
      },
      {
        "question_text": "Time-sensitive networking (TSN):",
        "options": [
          "Deterministic Ethernet",
          "WiFi best-effort only",
          "USB 1.1",
          "SPI"
        ],
        "correct_index": 0,
        "difficulty": "medium"
      }
    ]
  }
};
