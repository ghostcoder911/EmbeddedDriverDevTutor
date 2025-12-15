/**
 * Embedded C Programming Lessons
 * Comprehensive C programming tutorial for embedded systems
 * With detailed descriptions and code examples
 */

window.cProgrammingLessons = [
    {
        title: "Introduction to Embedded C",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">💻</div>
                <p>Welcome to Embedded C Programming! This comprehensive tutorial covers C programming concepts essential for embedded systems development.</p>
            </div>

            <h2>What is Embedded C?</h2>
            <p><strong>Embedded C</strong> is a set of language extensions for the C programming language designed specifically for programming <strong>embedded systems</strong>. An embedded system is a computer system designed for specific control functions within a larger system, often with real-time computing constraints.</p>
            
            <p>Unlike general-purpose computers, embedded systems are typically dedicated to specific tasks such as:</p>
            <ul>
                <li>Controlling motors in washing machines</li>
                <li>Managing sensors in automobiles</li>
                <li>Processing signals in medical devices</li>
                <li>Running IoT devices and wearables</li>
            </ul>

            <h2>Why C for Embedded Systems?</h2>
            <p>C remains the dominant language for embedded programming for several compelling reasons:</p>
            
            <table class="lesson-table">
                <tr><th>Advantage</th><th>Description</th></tr>
                <tr>
                    <td><strong>Low-level Hardware Access</strong></td>
                    <td>C provides direct access to memory addresses and hardware registers through pointers, enabling precise control over microcontroller peripherals.</td>
                </tr>
                <tr>
                    <td><strong>Efficiency</strong></td>
                    <td>C compiles to highly optimized machine code with minimal overhead, crucial for resource-constrained devices with limited memory and processing power.</td>
                </tr>
                <tr>
                    <td><strong>Portability</strong></td>
                    <td>Well-written C code can be ported across different microcontroller families with minimal modifications.</td>
                </tr>
                <tr>
                    <td><strong>Deterministic Behavior</strong></td>
                    <td>Unlike languages with garbage collection, C gives programmers complete control over memory allocation, ensuring predictable execution times.</td>
                </tr>
                <tr>
                    <td><strong>Industry Standard</strong></td>
                    <td>Most microcontroller vendors provide C compilers, and legacy codebases are predominantly written in C.</td>
                </tr>
            </table>

            <h2>Differences from Desktop C Programming</h2>
            <p>Embedded C programming differs from standard C in several ways:</p>
            <ul>
                <li><strong>No Operating System</strong> - Code runs directly on hardware ("bare metal")</li>
                <li><strong>Limited Resources</strong> - Typical MCUs have KBs of RAM, not GBs</li>
                <li><strong>Direct Hardware Manipulation</strong> - Writing to specific memory addresses to control hardware</li>
                <li><strong>Real-time Constraints</strong> - Code must respond within strict time limits</li>
                <li><strong>No Standard I/O</strong> - No printf() to screen (unless you implement it!)</li>
            </ul>

            <h2>Course Overview</h2>
            <p>This tutorial will take you from C fundamentals to advanced embedded concepts:</p>
            <ol>
                <li><strong>Data Types & Variables</strong> - Fixed-width integers, proper sizing</li>
                <li><strong>Operators</strong> - Arithmetic, logical, and crucial bitwise operations</li>
                <li><strong>Control Structures</strong> - Decision making and loops</li>
                <li><strong>Functions</strong> - Modular code organization</li>
                <li><strong>Pointers</strong> - The key to hardware register access</li>
                <li><strong>Structures</strong> - Organizing related data and register maps</li>
                <li><strong>Memory Keywords</strong> - volatile, const, static</li>
                <li><strong>Preprocessor</strong> - Macros and conditional compilation</li>
                <li><strong>Interrupts</strong> - Hardware event handling</li>
            </ol>

            <div class="info-box">
                <h4>📌 Prerequisites</h4>
                <p>Basic understanding of programming concepts is helpful but not required. We start from the fundamentals and build up to advanced topics!</p>
            </div>
        `
    },
    {
        title: "Data Types for Embedded Systems",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">📊</div>
                <p>Data types define what kind of data a variable can hold and how much memory it occupies. In embedded systems, choosing the right data type is critical for memory optimization and hardware compatibility.</p>
            </div>

            <h2>What are Data Types?</h2>
            <p>A <strong>data type</strong> is an attribute of data that tells the compiler or interpreter how the programmer intends to use the data. It defines:</p>
            <ul>
                <li>The <strong>size</strong> of memory allocated for the variable</li>
                <li>The <strong>range</strong> of values that can be stored</li>
                <li>The <strong>operations</strong> that can be performed on the data</li>
            </ul>

            <h2>Standard C Data Types</h2>
            <p>Standard C provides several fundamental data types:</p>
            
            <table class="lesson-table">
                <tr><th>Type</th><th>Typical Size</th><th>Range</th><th>Use Case</th></tr>
                <tr><td><code>char</code></td><td>1 byte</td><td>-128 to 127</td><td>Characters, small integers</td></tr>
                <tr><td><code>short</code></td><td>2 bytes</td><td>-32,768 to 32,767</td><td>Small integers</td></tr>
                <tr><td><code>int</code></td><td>2-4 bytes</td><td>Platform dependent!</td><td>General integers</td></tr>
                <tr><td><code>long</code></td><td>4 bytes</td><td>±2.1 billion</td><td>Large integers</td></tr>
                <tr><td><code>float</code></td><td>4 bytes</td><td>±3.4E38</td><td>Decimal numbers</td></tr>
                <tr><td><code>double</code></td><td>8 bytes</td><td>±1.7E308</td><td>Precise decimals</td></tr>
            </table>

            <div class="warning-box">
                <h4>⚠️ The Problem with Standard Types</h4>
                <p>The C standard does NOT guarantee the exact size of data types! The size of <code>int</code> varies between platforms:</p>
                <ul>
                    <li>On 8-bit AVR microcontrollers: <code>int</code> = 16 bits</li>
                    <li>On 32-bit ARM Cortex-M: <code>int</code> = 32 bits</li>
                    <li>On 64-bit desktop: <code>int</code> = 32 bits, but pointers are 64 bits</li>
                </ul>
                <p>This causes <strong>portability nightmares</strong> when moving code between platforms!</p>
            </div>

            <h2>Fixed-Width Integer Types (stdint.h)</h2>
            <p>The <strong>C99 standard</strong> introduced <code>&lt;stdint.h&gt;</code> which provides <strong>fixed-width integer types</strong>. These types guarantee a specific size regardless of the platform:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Fixed-width types (ALWAYS use these!)</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#include</span> &lt;stdint.h&gt;

<span class="comment">/* Unsigned integer types (can only be positive) */</span>
uint8_t   pin_state;     <span class="comment">// Exactly 8 bits  (0 to 255)</span>
uint16_t  adc_value;     <span class="comment">// Exactly 16 bits (0 to 65,535)</span>
uint32_t  frequency;     <span class="comment">// Exactly 32 bits (0 to 4,294,967,295)</span>
uint64_t  timestamp;     <span class="comment">// Exactly 64 bits</span>

<span class="comment">/* Signed integer types (can be negative or positive) */</span>
int8_t    temperature;   <span class="comment">// -128 to +127</span>
int16_t   sensor_value;  <span class="comment">// -32,768 to +32,767</span>
int32_t   position;      <span class="comment">// -2,147,483,648 to +2,147,483,647</span></code></pre>
                </div>
            </div>

            <h2>Choosing the Right Data Type</h2>
            <p>In embedded systems, every byte matters! Choose the smallest type that can hold your data:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Practical examples</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// GPIO pin numbers (0-15) - use uint8_t</span>
uint8_t led_pin = 5;

<span class="comment">// ADC values (12-bit ADC = 0-4095) - use uint16_t</span>
uint16_t adc_reading = 2048;

<span class="comment">// System tick counter (can get very large) - use uint32_t</span>
uint32_t sys_tick = 0;

<span class="comment">// Temperature in Celsius (can be negative) - use int8_t or int16_t</span>
int8_t temp_celsius = -15;

<span class="comment">// Boolean flags - use uint8_t (or bool from stdbool.h)</span>
uint8_t is_ready = 1;</code></pre>
                </div>
            </div>

            <div class="info-box">
                <h4>💡 Best Practice</h4>
                <p>Always use <code>uint8_t</code>, <code>uint16_t</code>, <code>uint32_t</code> instead of <code>char</code>, <code>short</code>, <code>int</code>. This ensures your code works identically on any platform!</p>
            </div>

            <h2>Unsigned vs Signed</h2>
            <p>Understanding when to use unsigned vs signed types is crucial:</p>
            <ul>
                <li><strong>Unsigned (uint8_t, uint16_t...)</strong>: Use for values that are never negative - pin numbers, addresses, counters, flags</li>
                <li><strong>Signed (int8_t, int16_t...)</strong>: Use for values that can be negative - temperature, position, error codes</li>
            </ul>
        `
    },
    {
        title: "Variables and Constants",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">📦</div>
                <p>Variables are named storage locations in memory that hold data values. Constants are fixed values that cannot be changed during program execution. Understanding both is fundamental to programming.</p>
            </div>

            <h2>What is a Variable?</h2>
            <p>A <strong>variable</strong> is a named container for storing data values in computer memory. Think of it as a labeled box where you can store and retrieve information.</p>
            
            <p>Every variable has three essential properties:</p>
            <ul>
                <li><strong>Name</strong> - An identifier used to reference the variable (e.g., <code>counter</code>)</li>
                <li><strong>Type</strong> - Defines what kind of data it can hold (e.g., <code>uint8_t</code>)</li>
                <li><strong>Value</strong> - The actual data stored (e.g., <code>42</code>)</li>
            </ul>

            <h2>Variable Declaration and Initialization</h2>
            <p><strong>Declaration</strong> tells the compiler to allocate memory for a variable. <strong>Initialization</strong> assigns an initial value to it.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Variable declaration and initialization</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Declaration only (value is undefined/garbage!)</span>
uint8_t pin_number;

<span class="comment">// Declaration with initialization (RECOMMENDED)</span>
uint8_t led_state = 0;
uint32_t counter = 0;
uint16_t adc_buffer[10];  <span class="comment">// Array of 10 values</span>

<span class="comment">// Multiple declarations on one line</span>
uint8_t a, b, c;
uint8_t x = 1, y = 2, z = 3;

<span class="comment">// Initializing arrays</span>
uint8_t data[] = {0x01, 0x02, 0x03, 0x04};  <span class="comment">// Size = 4</span>
uint8_t zeros[100] = {0};  <span class="comment">// All 100 elements set to 0</span></code></pre>
                </div>
            </div>

            <div class="warning-box">
                <h4>⚠️ Always Initialize Variables!</h4>
                <p>Uninitialized variables contain <strong>garbage values</strong> - whatever was previously in that memory location. This is a common source of bugs in embedded systems!</p>
            </div>

            <h2>Variable Naming Conventions</h2>
            <p>Good variable names make code self-documenting:</p>
            <ul>
                <li>Use descriptive names: <code>motor_speed</code> not <code>ms</code></li>
                <li>Use snake_case or camelCase consistently</li>
                <li>Prefix with type hint for clarity: <code>g_</code> for global, <code>p</code> for pointer</li>
                <li>Names are case-sensitive: <code>Count</code> ≠ <code>count</code></li>
            </ul>

            <h2>Constants - Values That Never Change</h2>
            <p>A <strong>constant</strong> is a value that remains fixed throughout program execution. Constants improve code readability and maintainability by giving meaningful names to magic numbers.</p>

            <h3>Method 1: #define (Preprocessor Macro)</h3>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Preprocessor constants</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#define</span> LED_PIN         5
<span class="preprocessor">#define</span> MAX_BUFFER_SIZE 256
<span class="preprocessor">#define</span> CLOCK_FREQ      16000000UL  <span class="comment">// 16 MHz (UL = unsigned long)</span>
<span class="preprocessor">#define</span> PI              3.14159f   <span class="comment">// f = float constant</span>

<span class="comment">// Usage - preprocessor replaces text before compilation</span>
GPIOA->ODR |= (1 << LED_PIN);  <span class="comment">// Becomes: GPIOA->ODR |= (1 << 5);</span></code></pre>
                </div>
            </div>

            <h3>Method 2: const Keyword</h3>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">const keyword</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="keyword">const</span> uint8_t MAX_RETRIES = 3;
<span class="keyword">const</span> uint32_t BAUD_RATE = 115200;

<span class="comment">// Array constants - stored in Flash (ROM), saves RAM!</span>
<span class="keyword">const</span> uint8_t lookup_table[] = {0, 1, 4, 9, 16, 25, 36, 49};
<span class="keyword">const</span> char device_name[] = "STM32F446";</code></pre>
                </div>
            </div>

            <h2>#define vs const - When to Use Which?</h2>
            <table class="lesson-table">
                <tr><th>Feature</th><th>#define</th><th>const</th></tr>
                <tr><td>Type checking</td><td>❌ No - just text replacement</td><td>✅ Yes - compiler checks type</td></tr>
                <tr><td>Memory usage</td><td>None (replaced at compile time)</td><td>Stored in Flash/ROM</td></tr>
                <tr><td>Debugging</td><td>Harder (symbol disappears)</td><td>Easier (symbol preserved)</td></tr>
                <tr><td>Scope</td><td>Global from definition point</td><td>Can be local or global</td></tr>
                <tr><td>Best for</td><td>Simple numeric constants</td><td>Arrays, typed constants</td></tr>
            </table>

            <div class="info-box">
                <h4>💡 Embedded Tip</h4>
                <p>Use <code>const</code> for arrays and lookup tables - they're stored in Flash (which you have plenty of) instead of RAM (which is precious)!</p>
            </div>
        `
    },
    {
        title: "Operators in C",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">➕</div>
                <p>Operators are special symbols that perform operations on variables and values. C provides a rich set of operators for arithmetic, comparison, logic, and bit manipulation.</p>
            </div>

            <h2>What are Operators?</h2>
            <p>An <strong>operator</strong> is a symbol that tells the compiler to perform specific mathematical, relational, or logical operations. Operators work on <strong>operands</strong> - the values or variables they act upon.</p>
            
            <p>For example, in <code>a + b</code>:</p>
            <ul>
                <li><code>+</code> is the operator</li>
                <li><code>a</code> and <code>b</code> are the operands</li>
            </ul>

            <h2>Arithmetic Operators</h2>
            <p>Arithmetic operators perform mathematical calculations:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Arithmetic operations</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>uint8_t a = 10, b = 3;
uint8_t result;

result = a + b;   <span class="comment">// Addition: 13</span>
result = a - b;   <span class="comment">// Subtraction: 7</span>
result = a * b;   <span class="comment">// Multiplication: 30</span>
result = a / b;   <span class="comment">// Division: 3 (integer division - no decimals!)</span>
result = a % b;   <span class="comment">// Modulo (remainder): 1 (10 ÷ 3 = 3 remainder 1)</span>

<span class="comment">// Increment and Decrement</span>
a++;              <span class="comment">// Post-increment: use a, then add 1 (a becomes 11)</span>
++a;              <span class="comment">// Pre-increment: add 1, then use a (a becomes 12)</span>
b--;              <span class="comment">// Post-decrement: use b, then subtract 1</span>
--b;              <span class="comment">// Pre-decrement: subtract 1, then use b</span></code></pre>
                </div>
            </div>

            <div class="warning-box">
                <h4>⚠️ Integer Division</h4>
                <p>When dividing integers, the result is always an integer - the decimal part is truncated!<br>
                <code>10 / 3 = 3</code> (not 3.33)</p>
            </div>

            <h2>Comparison (Relational) Operators</h2>
            <p>Comparison operators compare two values and return <code>1</code> (true) or <code>0</code> (false):</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Comparison operations</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>uint8_t a = 10, b = 5;
uint8_t result;

result = (a == b);  <span class="comment">// Equal to: 0 (false)</span>
result = (a != b);  <span class="comment">// Not equal to: 1 (true)</span>
result = (a > b);   <span class="comment">// Greater than: 1 (true)</span>
result = (a < b);   <span class="comment">// Less than: 0 (false)</span>
result = (a >= b);  <span class="comment">// Greater than or equal: 1 (true)</span>
result = (a <= b);  <span class="comment">// Less than or equal: 0 (false)</span></code></pre>
                </div>
            </div>

            <h2>Logical Operators</h2>
            <p>Logical operators combine multiple conditions. They treat any non-zero value as <strong>true</strong> and zero as <strong>false</strong>:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Logical operations</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>uint8_t a = 1, b = 0;

a && b  <span class="comment">// Logical AND: 0 (both must be true)</span>
a || b  <span class="comment">// Logical OR: 1 (at least one must be true)</span>
!a      <span class="comment">// Logical NOT: 0 (inverts the value)</span>
!b      <span class="comment">// Logical NOT: 1</span>

<span class="comment">// Practical example</span>
<span class="keyword">if</span> (temperature > 50 && humidity > 80) {
    <span class="comment">// Both conditions must be true</span>
    Activate_Cooling();
}

<span class="keyword">if</span> (button_pressed || timeout_expired) {
    <span class="comment">// Either condition can be true</span>
    Process_Event();
}</code></pre>
                </div>
            </div>

            <h2>Assignment Operators</h2>
            <p>Assignment operators store values in variables. Compound assignment operators combine an operation with assignment:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Assignment operations</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>uint8_t a = 10;

a = 5;    <span class="comment">// Simple assignment: a is now 5</span>
a += 3;   <span class="comment">// Add and assign: a = a + 3 (a is now 8)</span>
a -= 2;   <span class="comment">// Subtract and assign: a = a - 2 (a is now 6)</span>
a *= 4;   <span class="comment">// Multiply and assign: a = a * 4 (a is now 24)</span>
a /= 3;   <span class="comment">// Divide and assign: a = a / 3 (a is now 8)</span>
a %= 3;   <span class="comment">// Modulo and assign: a = a % 3 (a is now 2)</span>

<span class="comment">// Bitwise assignment (covered in next lesson)</span>
a |= 0x0F;  <span class="comment">// OR and assign</span>
a &= 0xF0;  <span class="comment">// AND and assign</span>
a ^= 0xFF;  <span class="comment">// XOR and assign</span></code></pre>
                </div>
            </div>

            <h2>Operator Precedence</h2>
            <p>Operators are evaluated in a specific order. Higher precedence operators are evaluated first:</p>
            <table class="lesson-table">
                <tr><th>Precedence</th><th>Operators</th><th>Description</th></tr>
                <tr><td>Highest</td><td><code>() [] -> .</code></td><td>Parentheses, array, member access</td></tr>
                <tr><td>↓</td><td><code>! ~ ++ -- - *</code></td><td>Unary operators</td></tr>
                <tr><td>↓</td><td><code>* / %</code></td><td>Multiplication, division, modulo</td></tr>
                <tr><td>↓</td><td><code>+ -</code></td><td>Addition, subtraction</td></tr>
                <tr><td>↓</td><td><code>&lt;&lt; &gt;&gt;</code></td><td>Bit shifts</td></tr>
                <tr><td>↓</td><td><code>&lt; &lt;= &gt; &gt;=</code></td><td>Comparisons</td></tr>
                <tr><td>↓</td><td><code>== !=</code></td><td>Equality</td></tr>
                <tr><td>Lowest</td><td><code>= += -=</code></td><td>Assignment</td></tr>
            </table>

            <div class="info-box">
                <h4>💡 Use Parentheses!</h4>
                <p>When in doubt, use parentheses to make the order of operations explicit. It improves readability and prevents bugs!</p>
                <code>result = (a + b) * c;</code>
            </div>
        `
    },
    {
        title: "Bitwise Operators - The Heart of Embedded C",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🔧</div>
                <p><strong>This is the most important lesson!</strong> Bitwise operators manipulate individual bits within a byte or word. They are used constantly in embedded programming to control hardware registers.</p>
            </div>

            <h2>What are Bitwise Operators?</h2>
            <p><strong>Bitwise operators</strong> perform operations on the individual bits of integer values. Unlike logical operators that work with true/false values, bitwise operators work at the binary level - treating each bit (0 or 1) separately.</p>
            
            <p>Understanding bitwise operations is essential because:</p>
            <ul>
                <li><strong>Hardware registers</strong> are controlled bit-by-bit</li>
                <li><strong>Flags and status bits</strong> must be set, cleared, or checked individually</li>
                <li><strong>Memory optimization</strong> - pack multiple values into one byte</li>
                <li><strong>Performance</strong> - bitwise operations are extremely fast</li>
            </ul>

            <h2>The Six Bitwise Operators</h2>
            <table class="lesson-table">
                <tr><th>Operator</th><th>Name</th><th>Description</th><th>Example</th></tr>
                <tr><td><code>&</code></td><td>AND</td><td>1 only if BOTH bits are 1</td><td><code>1010 & 1100 = 1000</code></td></tr>
                <tr><td><code>|</code></td><td>OR</td><td>1 if EITHER bit is 1</td><td><code>1010 | 1100 = 1110</code></td></tr>
                <tr><td><code>^</code></td><td>XOR</td><td>1 if bits are DIFFERENT</td><td><code>1010 ^ 1100 = 0110</code></td></tr>
                <tr><td><code>~</code></td><td>NOT</td><td>Inverts all bits</td><td><code>~1010 = 0101</code></td></tr>
                <tr><td><code>&lt;&lt;</code></td><td>Left Shift</td><td>Shifts bits left (multiply by 2)</td><td><code>0011 << 2 = 1100</code></td></tr>
                <tr><td><code>&gt;&gt;</code></td><td>Right Shift</td><td>Shifts bits right (divide by 2)</td><td><code>1100 >> 2 = 0011</code></td></tr>
            </table>

            <h2>AND Operator (&) - Masking and Clearing</h2>
            <p>The AND operator compares each bit of two numbers. The result bit is 1 only if <strong>both</strong> corresponding bits are 1. It's used to <strong>clear bits</strong> or <strong>extract specific bits</strong>.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">AND operation - Clear bits / Check bits</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Visual example:</span>
<span class="comment">//   1 0 1 1 0 1 0 0  (0xB4 = 180)</span>
<span class="comment">// & 1 1 1 1 0 0 0 0  (0xF0 = mask)</span>
<span class="comment">// = 1 0 1 1 0 0 0 0  (0xB0 = result)</span>

uint8_t value = 0xB4;
uint8_t result = value & 0xF0;  <span class="comment">// Result: 0xB0 (cleared lower 4 bits)</span>

<span class="comment">// Check if a specific bit is set</span>
<span class="keyword">if</span> (GPIOA->IDR & (1 << 5)) {
    <span class="comment">// Bit 5 is HIGH (1)</span>
} <span class="keyword">else</span> {
    <span class="comment">// Bit 5 is LOW (0)</span>
}</code></pre>
                </div>
            </div>

            <h2>OR Operator (|) - Setting Bits</h2>
            <p>The OR operator sets a bit to 1 if <strong>either</strong> corresponding bit is 1. It's used to <strong>set bits</strong> without affecting others.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">OR operation - Set bits</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Visual example:</span>
<span class="comment">//   1 0 1 1 0 0 0 0  (0xB0)</span>
<span class="comment">// | 0 0 0 0 1 1 0 0  (0x0C = bits to set)</span>
<span class="comment">// = 1 0 1 1 1 1 0 0  (0xBC = result)</span>

uint8_t value = 0xB0;
value = value | 0x0C;  <span class="comment">// Result: 0xBC (set bits 2 and 3)</span>

<span class="comment">// Turn on LED connected to pin 5</span>
GPIOA->ODR |= (1 << 5);  <span class="comment">// Set bit 5 to 1</span></code></pre>
                </div>
            </div>

            <h2>XOR Operator (^) - Toggling Bits</h2>
            <p>The XOR (exclusive OR) operator returns 1 if the bits are <strong>different</strong>. It's perfect for <strong>toggling bits</strong> - flipping them between 0 and 1.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">XOR operation - Toggle bits</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Visual example:</span>
<span class="comment">//   1 0 1 1 0 0 0 0  (original)</span>
<span class="comment">// ^ 0 0 1 0 0 0 0 0  (toggle bit 5)</span>
<span class="comment">// = 1 0 0 1 0 0 0 0  (bit 5 flipped!)</span>

<span class="comment">// Toggle LED - if ON, turn OFF; if OFF, turn ON</span>
GPIOA->ODR ^= (1 << 5);  <span class="comment">// Toggle bit 5</span>

<span class="comment">// Blinking LED example</span>
<span class="keyword">while</span>(1) {
    GPIOA->ODR ^= (1 << LED_PIN);
    delay_ms(500);
}</code></pre>
                </div>
            </div>

            <h2>NOT Operator (~) - Inverting Bits</h2>
            <p>The NOT operator <strong>inverts all bits</strong> - 0 becomes 1, and 1 becomes 0. It's often used with AND to create masks for clearing bits.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">NOT operation - Invert</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Visual example (8-bit):</span>
<span class="comment">//  ~ 0 0 1 0 0 0 0 0  (1 << 5 = 0x20)</span>
<span class="comment">//  = 1 1 0 1 1 1 1 1  (~(1 << 5) = 0xDF)</span>

<span class="comment">// Clear bit 5 using AND with NOT</span>
GPIOA->ODR &= ~(1 << 5);  <span class="comment">// Clear bit 5, leave others unchanged</span></code></pre>
                </div>
            </div>

            <h2>Shift Operators (<< and >>)</h2>
            <p>Shift operators move bits left or right by a specified number of positions. <strong>Left shift</strong> multiplies by powers of 2, <strong>right shift</strong> divides.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Shift operations</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Left shift - multiply by 2^n</span>
uint8_t a = 1;          <span class="comment">// 0000 0001</span>
a = a << 3;             <span class="comment">// 0000 1000 = 8 (1 × 2³)</span>

<span class="comment">// Create bit mask for any pin</span>
(1 << 0)   <span class="comment">// 0000 0001 - bit 0</span>
(1 << 5)   <span class="comment">// 0010 0000 - bit 5</span>
(1 << 7)   <span class="comment">// 1000 0000 - bit 7</span>

<span class="comment">// Right shift - divide by 2^n</span>
uint8_t b = 64;         <span class="comment">// 0100 0000</span>
b = b >> 2;             <span class="comment">// 0001 0000 = 16 (64 ÷ 2² = 16)</span>

<span class="comment">// Extract a bit value</span>
uint8_t bit5 = (value >> 5) & 1;  <span class="comment">// Get bit 5 as 0 or 1</span></code></pre>
                </div>
            </div>

            <div class="info-box">
                <h4>💡 Why (1 << n)?</h4>
                <p>The pattern <code>(1 << n)</code> creates a "mask" with only bit n set to 1:</p>
                <ul>
                    <li><code>(1 << 0)</code> = 0x01 = 0000 0001</li>
                    <li><code>(1 << 3)</code> = 0x08 = 0000 1000</li>
                    <li><code>(1 << 7)</code> = 0x80 = 1000 0000</li>
                </ul>
            </div>
        `
    },
    {
        title: "Bit Manipulation Patterns - The Essential Four",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🎯</div>
                <p>These four bit manipulation patterns are the building blocks of ALL embedded driver code. Master them and you can program any microcontroller!</p>
            </div>

            <h2>The Four Essential Patterns</h2>
            <p>Every register manipulation in embedded systems boils down to these four operations:</p>
            <ol>
                <li><strong>SET</strong> a bit (turn it to 1)</li>
                <li><strong>CLEAR</strong> a bit (turn it to 0)</li>
                <li><strong>TOGGLE</strong> a bit (flip its state)</li>
                <li><strong>CHECK</strong> a bit (read its value)</li>
            </ol>

            <h2>Pattern 1: SET a Bit</h2>
            <p>Use the <strong>OR operator</strong> with a bit mask to set specific bits to 1 without affecting other bits.</p>
            
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">SET pattern: register |= (1 << bit)</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Set bit 5 to 1</span>
GPIOA->ODR |= (1 << 5);

<span class="comment">// How it works:</span>
<span class="comment">//   ODR:  0100 0010</span>
<span class="comment">//   mask: 0010 0000  (1 << 5)</span>
<span class="comment">//   OR  = 0110 0010  (bit 5 is now 1, others unchanged)</span>

<span class="comment">// Set multiple bits at once</span>
GPIOA->ODR |= (1 << 3) | (1 << 5) | (1 << 7);  <span class="comment">// Set bits 3, 5, and 7</span>

<span class="comment">// Enable peripheral clock</span>
RCC->AHB1ENR |= (1 << 0);  <span class="comment">// Enable GPIOA clock</span></code></pre>
                </div>
            </div>

            <h2>Pattern 2: CLEAR a Bit</h2>
            <p>Use <strong>AND with inverted mask</strong> to clear specific bits to 0 without affecting others.</p>
            
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">CLEAR pattern: register &= ~(1 << bit)</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Clear bit 5 to 0</span>
GPIOA->ODR &= ~(1 << 5);

<span class="comment">// How it works:</span>
<span class="comment">//   ODR:      0110 0010</span>
<span class="comment">//   (1<<5):   0010 0000</span>
<span class="comment">//   ~(1<<5):  1101 1111  (inverted - all 1s except bit 5)</span>
<span class="comment">//   AND     = 0100 0010  (bit 5 cleared, others unchanged)</span>

<span class="comment">// Clear 2-bit field (like GPIO mode bits)</span>
GPIOA->MODER &= ~(0x3 << 10);  <span class="comment">// Clear bits 10-11</span>

<span class="comment">// Clear multiple bits</span>
GPIOA->ODR &= ~((1 << 3) | (1 << 5));  <span class="comment">// Clear bits 3 and 5</span></code></pre>
                </div>
            </div>

            <h2>Pattern 3: TOGGLE a Bit</h2>
            <p>Use the <strong>XOR operator</strong> to flip a bit's state - 0 becomes 1, 1 becomes 0.</p>
            
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">TOGGLE pattern: register ^= (1 << bit)</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Toggle bit 5</span>
GPIOA->ODR ^= (1 << 5);

<span class="comment">// How it works:</span>
<span class="comment">//   If bit was 0: 0 XOR 1 = 1 (turned ON)</span>
<span class="comment">//   If bit was 1: 1 XOR 1 = 0 (turned OFF)</span>

<span class="comment">// Classic LED blink</span>
<span class="keyword">while</span>(1) {
    GPIOA->ODR ^= (1 << LED_PIN);  <span class="comment">// Toggle LED</span>
    delay_ms(500);                  <span class="comment">// Wait 500ms</span>
}</code></pre>
                </div>
            </div>

            <h2>Pattern 4: CHECK/READ a Bit</h2>
            <p>Use the <strong>AND operator</strong> to isolate and test the value of a specific bit.</p>
            
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">CHECK pattern: if(register & (1 << bit))</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Check if bit 5 is set</span>
<span class="keyword">if</span> (GPIOA->IDR & (1 << 5)) {
    <span class="comment">// Bit is 1 (HIGH) - button pressed</span>
} <span class="keyword">else</span> {
    <span class="comment">// Bit is 0 (LOW) - button not pressed</span>
}

<span class="comment">// Wait until a flag is set (polling)</span>
<span class="keyword">while</span> (!(SPI1->SR & (1 << 1))) {
    <span class="comment">// Wait for TXE (bit 1) to become 1</span>
}

<span class="comment">// Get actual bit value (0 or 1)</span>
uint8_t bit_value = (GPIOA->IDR >> 5) & 1;</code></pre>
                </div>
            </div>

            <div class="success-box">
                <h4>✅ Master Cheat Sheet</h4>
                <table class="lesson-table">
                    <tr><th>Action</th><th>Pattern</th><th>Operator</th><th>Why It Works</th></tr>
                    <tr><td><strong>SET</strong></td><td><code>reg |= (1 << n)</code></td><td>OR</td><td>OR with 1 always gives 1</td></tr>
                    <tr><td><strong>CLEAR</strong></td><td><code>reg &= ~(1 << n)</code></td><td>AND NOT</td><td>AND with 0 always gives 0</td></tr>
                    <tr><td><strong>TOGGLE</strong></td><td><code>reg ^= (1 << n)</code></td><td>XOR</td><td>XOR with 1 flips the bit</td></tr>
                    <tr><td><strong>CHECK</strong></td><td><code>reg & (1 << n)</code></td><td>AND</td><td>Isolates the bit</td></tr>
                </table>
            </div>

            <h2>Real-World Example: GPIO Configuration</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Complete GPIO setup example</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Configure PA5 as output</span>

<span class="comment">// 1. Enable GPIOA clock (SET bit 0 in AHB1ENR)</span>
RCC->AHB1ENR |= (1 << 0);

<span class="comment">// 2. Clear mode bits for pin 5 (bits 10-11)</span>
GPIOA->MODER &= ~(0x3 << 10);

<span class="comment">// 3. Set mode to output (01) for pin 5</span>
GPIOA->MODER |= (0x1 << 10);

<span class="comment">// 4. Turn on LED</span>
GPIOA->ODR |= (1 << 5);

<span class="comment">// 5. Toggle LED forever</span>
<span class="keyword">while</span>(1) {
    GPIOA->ODR ^= (1 << 5);
    delay_ms(500);
}</code></pre>
                </div>
            </div>
        `
    },
    {
        title: "Control Flow - Decision Making",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🔀</div>
                <p>Control flow statements allow your program to make decisions and execute different code paths based on conditions. They form the logic of your program.</p>
            </div>

            <h2>What is Control Flow?</h2>
            <p><strong>Control flow</strong> (or flow of control) refers to the order in which individual statements, instructions, or function calls are executed in a program. By default, code executes sequentially from top to bottom, but control flow statements allow us to:</p>
            <ul>
                <li><strong>Branch</strong> - Execute different code based on conditions (if-else, switch)</li>
                <li><strong>Loop</strong> - Repeat code multiple times (for, while, do-while)</li>
                <li><strong>Jump</strong> - Skip to different parts of code (break, continue, return)</li>
            </ul>

            <h2>The if Statement</h2>
            <p>The <code>if</code> statement is the most fundamental decision-making construct. It executes a block of code only if a specified condition is <strong>true</strong> (non-zero).</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">if statement</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Simple if</span>
<span class="keyword">if</span> (temperature > 100) {
    Activate_Alarm();
}

<span class="comment">// if with else</span>
<span class="keyword">if</span> (button_state == 1) {
    LED_On();
} <span class="keyword">else</span> {
    LED_Off();
}

<span class="comment">// if-else if-else chain</span>
<span class="keyword">if</span> (temp > 100) {
    Fan_Speed(HIGH);
} <span class="keyword">else if</span> (temp > 50) {
    Fan_Speed(MEDIUM);
} <span class="keyword">else if</span> (temp > 25) {
    Fan_Speed(LOW);
} <span class="keyword">else</span> {
    Fan_Off();
}</code></pre>
                </div>
            </div>

            <h2>The Ternary Operator (?:)</h2>
            <p>The <strong>ternary operator</strong> is a compact way to write simple if-else statements in a single line. Its syntax is: <code>condition ? value_if_true : value_if_false</code></p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Ternary operator</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Instead of:</span>
<span class="keyword">if</span> (x > 10) {
    result = 1;
} <span class="keyword">else</span> {
    result = 0;
}

<span class="comment">// Use ternary:</span>
result = (x > 10) ? 1 : 0;

<span class="comment">// Practical example</span>
LED_Write((button_pressed) ? LED_ON : LED_OFF);

<span class="comment">// Finding maximum</span>
max = (a > b) ? a : b;</code></pre>
                </div>
            </div>

            <h2>The switch Statement</h2>
            <p>The <code>switch</code> statement tests a variable against multiple constant values. It's more readable than multiple if-else statements when comparing one variable against many values.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">switch statement</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="keyword">switch</span> (command) {
    <span class="keyword">case</span> CMD_READ:
        Read_Data();
        <span class="keyword">break</span>;  <span class="comment">// IMPORTANT: exit switch</span>
    
    <span class="keyword">case</span> CMD_WRITE:
        Write_Data();
        <span class="keyword">break</span>;
    
    <span class="keyword">case</span> CMD_ERASE:
        Erase_Sector();
        <span class="keyword">break</span>;
    
    <span class="keyword">case</span> CMD_STATUS:
    <span class="keyword">case</span> CMD_INFO:      <span class="comment">// Multiple cases, same action</span>
        Send_Status();
        <span class="keyword">break</span>;
    
    <span class="keyword">default</span>:            <span class="comment">// No match - handle unknown commands</span>
        Error_Handler();
        <span class="keyword">break</span>;
}</code></pre>
                </div>
            </div>

            <div class="warning-box">
                <h4>⚠️ Don't Forget break!</h4>
                <p>Without <code>break</code>, execution "falls through" to the next case. This is usually a bug, not intentional behavior!</p>
            </div>

            <h2>Common Embedded Patterns</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Embedded control flow patterns</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Check register flag</span>
<span class="keyword">if</span> (USART1->SR & (1 << 5)) {  <span class="comment">// RXNE flag set?</span>
    data = USART1->DR;
}

<span class="comment">// State machine pattern</span>
<span class="keyword">switch</span> (current_state) {
    <span class="keyword">case</span> STATE_IDLE:
        <span class="keyword">if</span> (event) current_state = STATE_RUNNING;
        <span class="keyword">break</span>;
    <span class="keyword">case</span> STATE_RUNNING:
        Process();
        <span class="keyword">break</span>;
}</code></pre>
                </div>
            </div>
        `
    },
    {
        title: "Loops - Repeating Code",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🔄</div>
                <p>Loops allow you to execute a block of code repeatedly. In embedded systems, loops are used for polling hardware, creating delays, processing data buffers, and running the main application forever.</p>
            </div>

            <h2>What is a Loop?</h2>
            <p>A <strong>loop</strong> is a programming construct that repeats a block of code while a condition is true, or for a specified number of iterations. C provides three types of loops:</p>
            <ul>
                <li><strong>for</strong> - When you know how many times to iterate</li>
                <li><strong>while</strong> - When you don't know how many iterations needed</li>
                <li><strong>do-while</strong> - When you need at least one iteration</li>
            </ul>

            <h2>The for Loop</h2>
            <p>The <code>for</code> loop is ideal when you know exactly how many times you want to repeat. It combines initialization, condition, and increment in one line.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">for loop syntax and examples</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Syntax: for (init; condition; increment)</span>

<span class="comment">// Count from 0 to 9</span>
<span class="keyword">for</span> (uint8_t i = 0; i < 10; i++) {
    buffer[i] = 0;  <span class="comment">// Clear each element</span>
}

<span class="comment">// Initialize 8 GPIO pins</span>
<span class="keyword">for</span> (uint8_t pin = 0; pin < 8; pin++) {
    GPIO_SetMode(GPIOA, pin, OUTPUT);
}

<span class="comment">// Count backwards</span>
<span class="keyword">for</span> (int8_t i = 10; i >= 0; i--) {
    Display_Number(i);  <span class="comment">// 10, 9, 8, ... 0</span>
}

<span class="comment">// Infinite loop (common in embedded main())</span>
<span class="keyword">for</span> (;;) {
    <span class="comment">// Application runs forever</span>
    Process_Tasks();
}</code></pre>
                </div>
            </div>

            <h2>The while Loop</h2>
            <p>The <code>while</code> loop repeats as long as a condition is true. It checks the condition <strong>before</strong> each iteration, so it may not execute at all if the condition is initially false.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">while loop - polling and waiting</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Wait for hardware flag (polling)</span>
<span class="keyword">while</span> (!(SPI1->SR & (1 << 1))) {
    <span class="comment">// Wait until TX buffer is empty</span>
}

<span class="comment">// Infinite loop for main application</span>
<span class="keyword">while</span> (1) {
    Read_Sensors();
    Process_Data();
    Update_Display();
}

<span class="comment">// Wait with timeout (avoid infinite waits!)</span>
uint32_t timeout = 100000;
<span class="keyword">while</span> (!(I2C1->SR1 & (1 << 0)) && timeout > 0) {
    timeout--;
}
<span class="keyword">if</span> (timeout == 0) {
    Handle_Timeout_Error();
}</code></pre>
                </div>
            </div>

            <h2>The do-while Loop</h2>
            <p>The <code>do-while</code> loop is similar to while, but checks the condition <strong>after</strong> each iteration. This guarantees the code runs <strong>at least once</strong>.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">do-while loop</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Retry until success</span>
uint8_t attempts = 0;
<span class="keyword">do</span> {
    result = Connect_To_Server();
    attempts++;
} <span class="keyword">while</span> (result == FAIL && attempts < 3);

<span class="comment">// Read at least once, continue if more data</span>
<span class="keyword">do</span> {
    data = UART_Read();
    Process(data);
} <span class="keyword">while</span> (data != END_OF_MESSAGE);

<span class="comment">// Common in multi-statement macros</span>
<span class="preprocessor">#define</span> SAFE_WRITE(x) <span class="keyword">do</span> { \\
    Disable_Interrupts(); \\
    Write_Register(x); \\
    Enable_Interrupts(); \\
} <span class="keyword">while</span>(0)</code></pre>
                </div>
            </div>

            <h2>Loop Control: break and continue</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Controlling loop execution</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// break - exit loop immediately</span>
<span class="keyword">for</span> (int i = 0; i < 100; i++) {
    <span class="keyword">if</span> (data[i] == STOP_MARKER) {
        <span class="keyword">break</span>;  <span class="comment">// Exit loop when marker found</span>
    }
    Process(data[i]);
}

<span class="comment">// continue - skip to next iteration</span>
<span class="keyword">for</span> (int i = 0; i < 100; i++) {
    <span class="keyword">if</span> (data[i] == SKIP_VALUE) {
        <span class="keyword">continue</span>;  <span class="comment">// Skip this element</span>
    }
    Process(data[i]);  <span class="comment">// Process only non-skip values</span>
}</code></pre>
                </div>
            </div>

            <div class="info-box">
                <h4>💡 Embedded Best Practice</h4>
                <p>Always add a timeout to while loops that wait for hardware! Hardware can fail, and infinite loops will hang your system.</p>
            </div>
        `
    },
    {
        title: "Functions - Building Blocks of Code",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">📋</div>
                <p>Functions are self-contained blocks of code that perform a specific task. They are the foundation of modular programming, making code reusable, readable, and maintainable.</p>
            </div>

            <h2>What is a Function?</h2>
            <p>A <strong>function</strong> is a named block of code that:</p>
            <ul>
                <li>Performs a specific task</li>
                <li>Can accept <strong>input</strong> (parameters)</li>
                <li>Can produce <strong>output</strong> (return value)</li>
                <li>Can be called (invoked) from anywhere in the program</li>
            </ul>
            
            <p>Functions promote the <strong>DRY principle</strong> (Don't Repeat Yourself) - write code once, use it many times.</p>

            <h2>Function Anatomy</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Function structure</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Function declaration (prototype) - usually in .h file</span>
<span class="type">return_type</span> <span class="function">function_name</span>(parameter_list);

<span class="comment">// Function definition - in .c file</span>
<span class="type">return_type</span> <span class="function">function_name</span>(parameter_list) {
    <span class="comment">// Function body - code to execute</span>
    <span class="keyword">return</span> value;  <span class="comment">// Optional, depends on return_type</span>
}

<span class="comment">// Complete example</span>
<span class="type">uint8_t</span> <span class="function">GPIO_ReadPin</span>(GPIO_TypeDef *port, uint8_t pin) {
    <span class="keyword">return</span> (port->IDR >> pin) & 0x01;
}</code></pre>
                </div>
            </div>

            <h2>Return Types</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Different return types</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// void - no return value</span>
<span class="type">void</span> <span class="function">LED_Toggle</span>(<span class="type">void</span>) {
    GPIOA->ODR ^= (1 << 5);
    <span class="comment">// No return statement needed</span>
}

<span class="comment">// Return a value</span>
<span class="type">uint16_t</span> <span class="function">ADC_Read</span>(<span class="type">void</span>) {
    <span class="keyword">while</span> (!(ADC1->SR & (1 << 1)));  <span class="comment">// Wait for conversion</span>
    <span class="keyword">return</span> ADC1->DR;  <span class="comment">// Return the result</span>
}

<span class="comment">// Return status code</span>
<span class="type">uint8_t</span> <span class="function">I2C_Write</span>(uint8_t addr, uint8_t *data, uint8_t len) {
    <span class="comment">// ... write operation ...</span>
    <span class="keyword">if</span> (error) <span class="keyword">return</span> 1;  <span class="comment">// Error</span>
    <span class="keyword">return</span> 0;              <span class="comment">// Success</span>
}</code></pre>
                </div>
            </div>

            <h2>Pass by Value vs Pass by Pointer</h2>
            <p><strong>Pass by value</strong> copies the argument. Changes inside the function don't affect the original.<br>
            <strong>Pass by pointer</strong> passes the address. The function can modify the original variable.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Parameter passing</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Pass by value - original unchanged</span>
<span class="type">void</span> <span class="function">Double</span>(uint8_t x) {
    x = x * 2;  <span class="comment">// Only local copy is changed</span>
}

uint8_t num = 5;
Double(num);  <span class="comment">// num is still 5!</span>

<span class="comment">// Pass by pointer - can modify original</span>
<span class="type">void</span> <span class="function">Double_Ptr</span>(uint8_t *x) {
    *x = *x * 2;  <span class="comment">// Modifies original through pointer</span>
}

Double_Ptr(&num);  <span class="comment">// num is now 10!</span>

<span class="comment">// Returning multiple values via pointers</span>
<span class="type">void</span> <span class="function">Get_Sensor_Data</span>(uint16_t *temp, uint16_t *humidity) {
    *temp = Read_Temperature();
    *humidity = Read_Humidity();
}

<span class="comment">// Usage</span>
uint16_t t, h;
Get_Sensor_Data(&t, &h);</code></pre>
                </div>
            </div>

            <h2>Function Prototypes</h2>
            <p>A <strong>prototype</strong> declares a function before it's defined, allowing you to call it from anywhere. Place prototypes in header files.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#ifndef</span> GPIO_DRIVER_H
<span class="preprocessor">#define</span> GPIO_DRIVER_H

<span class="comment">// Function prototypes</span>
<span class="type">void</span> GPIO_Init(GPIO_TypeDef *port, uint8_t pin, uint8_t mode);
<span class="type">void</span> GPIO_WritePin(GPIO_TypeDef *port, uint8_t pin, uint8_t value);
<span class="type">uint8_t</span> GPIO_ReadPin(GPIO_TypeDef *port, uint8_t pin);

<span class="preprocessor">#endif</span></code></pre>
                </div>
            </div>
        `
    },
    {
        title: "Pointers - The Key to Hardware Access",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">👆</div>
                <p>Pointers are THE most important concept in embedded C. They store memory addresses, enabling direct hardware register access. Master pointers and you can program any microcontroller!</p>
            </div>

            <h2>What is a Pointer?</h2>
            <p>A <strong>pointer</strong> is a variable that stores the <strong>memory address</strong> of another variable. Instead of holding data directly, it "points to" where the data lives in memory.</p>
            
            <p>Why are pointers essential in embedded systems?</p>
            <ul>
                <li><strong>Hardware registers</strong> are accessed by their memory addresses</li>
                <li><strong>Efficient data passing</strong> - pass address instead of copying large data</li>
                <li><strong>Dynamic data structures</strong> - linked lists, buffers</li>
                <li><strong>Function callbacks</strong> - passing functions as parameters</li>
            </ul>

            <h2>Pointer Basics</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Pointer declaration and operators</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>uint8_t value = 42;        <span class="comment">// Normal variable, holds value 42</span>
uint8_t *ptr = &value;     <span class="comment">// Pointer, holds ADDRESS of value</span>

<span class="comment">// Two key operators:</span>
<span class="comment">// &  = "address of" - get the memory address</span>
<span class="comment">// *  = "dereference" - get value at the address</span>

printf("value = %d\\n", value);    <span class="comment">// Prints: 42</span>
printf("ptr = %p\\n", ptr);        <span class="comment">// Prints: 0x20000100 (address)</span>
printf("*ptr = %d\\n", *ptr);      <span class="comment">// Prints: 42 (value at address)</span>

<span class="comment">// Modify through pointer</span>
*ptr = 100;  <span class="comment">// Changes value to 100!</span>
printf("value = %d\\n", value);    <span class="comment">// Prints: 100</span></code></pre>
                </div>
            </div>

            <h2>Pointers to Hardware Registers</h2>
            <p>In embedded systems, hardware registers are at fixed memory addresses. We use pointers to access them:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Direct register access via pointers</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// GPIOA Output Data Register is at address 0x40020014</span>
<span class="keyword">volatile</span> uint32_t *GPIOA_ODR = (<span class="keyword">volatile</span> uint32_t*)0x40020014;

<span class="comment">// Turn on LED (set bit 5)</span>
*GPIOA_ODR |= (1 << 5);

<span class="comment">// This is EXACTLY what happens when you write:</span>
GPIOA->ODR |= (1 << 5);
<span class="comment">// The -> operator dereferences the pointer AND accesses the member</span></code></pre>
                </div>
            </div>

            <h2>Pointer Arithmetic</h2>
            <p>When you add/subtract from a pointer, it moves by the <strong>size of the data type</strong>, not just 1 byte:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Pointer arithmetic</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>uint32_t arr[5] = {10, 20, 30, 40, 50};
uint32_t *ptr = arr;  <span class="comment">// Points to arr[0]</span>

*ptr        <span class="comment">// 10 (arr[0])</span>
*(ptr + 1)  <span class="comment">// 20 (arr[1]) - moved 4 bytes for uint32_t</span>
*(ptr + 2)  <span class="comment">// 30 (arr[2]) - moved 8 bytes</span>

ptr++;      <span class="comment">// Now points to arr[1]</span>
*ptr        <span class="comment">// 20</span>

<span class="comment">// Iterate through array with pointer</span>
<span class="keyword">for</span> (uint32_t *p = arr; p < arr + 5; p++) {
    printf("%d ", *p);  <span class="comment">// Prints: 10 20 30 40 50</span>
}</code></pre>
                </div>
            </div>

            <h2>Common Pointer Patterns in Drivers</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Driver patterns</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Pass array by pointer</span>
<span class="type">void</span> <span class="function">SPI_Transmit</span>(uint8_t *data, uint16_t length) {
    <span class="keyword">for</span> (uint16_t i = 0; i < length; i++) {
        SPI1->DR = data[i];
        <span class="keyword">while</span> (!(SPI1->SR & (1 << 1)));  <span class="comment">// Wait for TXE</span>
    }
}

<span class="comment">// Return data via pointer parameter</span>
<span class="type">void</span> <span class="function">ADC_ReadMultiple</span>(uint16_t *results, uint8_t count) {
    <span class="keyword">for</span> (uint8_t i = 0; i < count; i++) {
        results[i] = ADC_Read();
    }
}

<span class="comment">// Pass structure by pointer (efficient)</span>
<span class="type">void</span> <span class="function">GPIO_Init</span>(GPIO_Handle_t *pGPIOHandle) {
    <span class="comment">// Access structure members with -></span>
    pGPIOHandle->pGPIOx->MODER |= ...
}</code></pre>
                </div>
            </div>

            <div class="warning-box">
                <h4>⚠️ Null Pointer Danger</h4>
                <p>Dereferencing a NULL pointer crashes the program! Always check pointers before using:</p>
                <code>if (ptr != NULL) { *ptr = value; }</code>
            </div>
        `
    },
    {
        title: "Structures - Grouping Related Data",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🏗️</div>
                <p>Structures group related variables under one name. They're essential for organizing peripheral register definitions and driver configurations in embedded systems.</p>
            </div>

            <h2>What is a Structure?</h2>
            <p>A <strong>structure</strong> (or <code>struct</code>) is a user-defined data type that groups together variables of different types under a single name. Each variable inside is called a <strong>member</strong> or <strong>field</strong>.</p>
            
            <p>Structures are perfect for:</p>
            <ul>
                <li><strong>Hardware register maps</strong> - Group related registers together</li>
                <li><strong>Configuration data</strong> - Combine settings for a peripheral</li>
                <li><strong>Complex data types</strong> - Sensor readings with multiple values</li>
            </ul>

            <h2>Basic Structure Usage</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Defining and using structures</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Define a structure type</span>
<span class="keyword">struct</span> SensorData {
    uint16_t temperature;
    uint16_t humidity;
    uint32_t timestamp;
};

<span class="comment">// Declare a variable of this type</span>
<span class="keyword">struct</span> SensorData reading;

<span class="comment">// Access members with dot (.) operator</span>
reading.temperature = 2500;  <span class="comment">// 25.00°C (fixed-point)</span>
reading.humidity = 6000;     <span class="comment">// 60.00%</span>
reading.timestamp = Get_Tick();

<span class="comment">// Initialize at declaration</span>
<span class="keyword">struct</span> SensorData initial = {2500, 6000, 0};

<span class="comment">// C99 designated initializers (clearer)</span>
<span class="keyword">struct</span> SensorData sensor = {
    .temperature = 2500,
    .humidity = 6000,
    .timestamp = 0
};</code></pre>
                </div>
            </div>

            <h2>Structures for Register Mapping (Key Pattern!)</h2>
            <p>This is THE most important use of structures in embedded systems - mapping hardware registers:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Register structure (stm32f446xx.h style)</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// GPIO register structure</span>
<span class="keyword">typedef struct</span> {
    <span class="keyword">volatile</span> uint32_t MODER;   <span class="comment">// Offset 0x00</span>
    <span class="keyword">volatile</span> uint32_t OTYPER;  <span class="comment">// Offset 0x04</span>
    <span class="keyword">volatile</span> uint32_t OSPEEDR; <span class="comment">// Offset 0x08</span>
    <span class="keyword">volatile</span> uint32_t PUPDR;   <span class="comment">// Offset 0x0C</span>
    <span class="keyword">volatile</span> uint32_t IDR;     <span class="comment">// Offset 0x10</span>
    <span class="keyword">volatile</span> uint32_t ODR;     <span class="comment">// Offset 0x14</span>
} GPIO_TypeDef;

<span class="comment">// Create pointer to GPIO at its base address</span>
<span class="preprocessor">#define</span> GPIOA ((GPIO_TypeDef*)0x40020000)

<span class="comment">// Now access registers easily!</span>
GPIOA->MODER |= (1 << 10);  <span class="comment">// Set mode for pin 5</span>
GPIOA->ODR |= (1 << 5);     <span class="comment">// Turn on pin 5</span></code></pre>
                </div>
            </div>

            <h2>typedef with Structures</h2>
            <p>Using <code>typedef</code> creates an alias so you don't need to write <code>struct</code> every time:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">typedef for cleaner code</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Without typedef - verbose</span>
<span class="keyword">struct</span> GPIO_Config config1;

<span class="comment">// With typedef - cleaner</span>
<span class="keyword">typedef struct</span> {
    uint8_t Pin;
    uint8_t Mode;
    uint8_t Speed;
    uint8_t PullUpDown;
} GPIO_PinConfig_t;

GPIO_PinConfig_t config2;  <span class="comment">// No 'struct' keyword needed</span></code></pre>
                </div>
            </div>

            <h2>Pointer to Structure (Arrow Operator)</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Arrow operator (->) for pointer access</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>GPIO_PinConfig_t config = {5, 1, 2, 0};
GPIO_PinConfig_t *ptr = &config;

<span class="comment">// Two equivalent ways to access:</span>
(*ptr).Pin = 7;   <span class="comment">// Dereference, then access</span>
ptr->Pin = 7;     <span class="comment">// Arrow operator (preferred!)</span>

<span class="comment">// Function taking structure pointer</span>
<span class="type">void</span> <span class="function">GPIO_Init</span>(GPIO_PinConfig_t *pConfig) {
    uint8_t pin = pConfig->Pin;      <span class="comment">// Access member</span>
    uint8_t mode = pConfig->Mode;
    <span class="comment">// Configure GPIO...</span>
}</code></pre>
                </div>
            </div>
        `
    },
    {
        title: "volatile, const, static - Memory Keywords",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🔒</div>
                <p>These three keywords control how variables behave in memory. Understanding them is crucial for correct embedded programming!</p>
            </div>

            <h2>The volatile Keyword</h2>
            <p><strong>volatile</strong> tells the compiler that a variable's value may change at any time without any action being taken by the surrounding code. This is CRITICAL for:</p>
            <ul>
                <li><strong>Hardware registers</strong> - Values change due to hardware events</li>
                <li><strong>ISR variables</strong> - Values change in interrupt handlers</li>
                <li><strong>Memory-mapped I/O</strong> - External devices change memory</li>
            </ul>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">volatile prevents dangerous optimizations</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// WITHOUT volatile - DANGEROUS BUG!</span>
uint32_t *status = (uint32_t*)0x40020010;
<span class="keyword">while</span> (*status == 0) {
    <span class="comment">// Compiler may optimize to: while(1) {}</span>
    <span class="comment">// Because it doesn't see *status changing!</span>
}

<span class="comment">// WITH volatile - CORRECT</span>
<span class="keyword">volatile</span> uint32_t *status = (<span class="keyword">volatile</span> uint32_t*)0x40020010;
<span class="keyword">while</span> (*status == 0) {
    <span class="comment">// Compiler reads from memory EVERY time</span>
}

<span class="comment">// Variable shared with ISR</span>
<span class="keyword">volatile</span> uint8_t button_pressed = 0;

<span class="type">void</span> EXTI0_IRQHandler(<span class="type">void</span>) {
    button_pressed = 1;  <span class="comment">// Set by interrupt</span>
}

<span class="type">int</span> main(<span class="type">void</span>) {
    <span class="keyword">while</span>(!button_pressed);  <span class="comment">// Without volatile, loop may never exit!</span>
}</code></pre>
                </div>
            </div>

            <h2>The const Keyword</h2>
            <p><strong>const</strong> declares that a variable's value cannot be changed after initialization. In embedded systems, const data is stored in <strong>Flash/ROM</strong>, saving precious RAM!</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">const for read-only data</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Constants stored in Flash (saves RAM!)</span>
<span class="keyword">const</span> uint8_t DEVICE_ID = 0x42;
<span class="keyword">const</span> uint32_t BAUD_RATE = 115200;

<span class="comment">// Lookup table in Flash</span>
<span class="keyword">const</span> uint8_t sin_table[256] = {0, 3, 6, 9, ...};

<span class="comment">// String constants</span>
<span class="keyword">const</span> <span class="keyword">char</span> version[] = "v1.2.3";

<span class="comment">// Pointer to const - can't modify data</span>
<span class="keyword">const</span> uint8_t *ptr = data;
*ptr = 10;  <span class="comment">// ERROR! Can't modify through ptr</span>
ptr++;      <span class="comment">// OK - can change where ptr points</span>

<span class="comment">// Const pointer - can't change pointer</span>
uint8_t * <span class="keyword">const</span> ptr2 = buffer;
*ptr2 = 10;  <span class="comment">// OK - can modify data</span>
ptr2++;      <span class="comment">// ERROR! Can't change pointer</span></code></pre>
                </div>
            </div>

            <h2>The static Keyword</h2>
            <p><strong>static</strong> has two different uses depending on context:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">static - two different meanings</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// 1. Inside a function: PERSISTENT local variable</span>
<span class="type">uint32_t</span> <span class="function">Get_Tick</span>(<span class="type">void</span>) {
    <span class="keyword">static</span> uint32_t tick = 0;  <span class="comment">// Retains value between calls!</span>
    <span class="keyword">return</span> tick++;
}
<span class="comment">// First call returns 0, second returns 1, third returns 2...</span>

<span class="comment">// 2. At file scope: PRIVATE to this file</span>
<span class="keyword">static</span> uint8_t rx_buffer[256];  <span class="comment">// Only visible in this .c file</span>
<span class="keyword">static</span> <span class="type">void</span> <span class="function">helper_func</span>(<span class="type">void</span>);  <span class="comment">// Private helper function</span>

<span class="comment">// Without static - visible from other files</span>
uint8_t tx_buffer[256];  <span class="comment">// Can be accessed with 'extern'</span></code></pre>
                </div>
            </div>

            <div class="success-box">
                <h4>✅ Quick Reference</h4>
                <table class="lesson-table">
                    <tr><th>Keyword</th><th>Purpose</th><th>Use When</th></tr>
                    <tr><td><code>volatile</code></td><td>Prevent optimization</td><td>Hardware registers, ISR variables</td></tr>
                    <tr><td><code>const</code></td><td>Read-only, stored in Flash</td><td>Lookup tables, config values</td></tr>
                    <tr><td><code>static</code></td><td>Persistent/Private</td><td>Counters, file-private data</td></tr>
                </table>
            </div>
        `
    },
    {
        title: "Preprocessor and Macros",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">⚙️</div>
                <p>The C preprocessor processes your code BEFORE compilation. It handles file inclusion, macro substitution, and conditional compilation - essential tools for embedded development.</p>
            </div>

            <h2>What is the Preprocessor?</h2>
            <p>The <strong>preprocessor</strong> is a text processing stage that runs before the actual compilation. All preprocessor directives start with <code>#</code>. It performs:</p>
            <ul>
                <li><strong>File inclusion</strong> - #include brings in header files</li>
                <li><strong>Macro substitution</strong> - #define replaces text</li>
                <li><strong>Conditional compilation</strong> - #if, #ifdef, #ifndef</li>
            </ul>

            <h2>#include - File Inclusion</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Including header files</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// System headers - search system include paths</span>
<span class="preprocessor">#include</span> &lt;stdint.h&gt;    <span class="comment">// uint8_t, uint32_t, etc.</span>
<span class="preprocessor">#include</span> &lt;stdbool.h&gt;   <span class="comment">// bool, true, false</span>

<span class="comment">// User headers - search local paths first</span>
<span class="preprocessor">#include</span> "stm32f446xx.h"
<span class="preprocessor">#include</span> "gpio_driver.h"</code></pre>
                </div>
            </div>

            <h2>Header Guards</h2>
            <p>Header guards prevent a file from being included multiple times, which would cause "redefinition" errors:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Header guard pattern</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// gpio_driver.h</span>
<span class="preprocessor">#ifndef</span> GPIO_DRIVER_H   <span class="comment">// If not defined...</span>
<span class="preprocessor">#define</span> GPIO_DRIVER_H   <span class="comment">// ...define it</span>

<span class="comment">// Header content goes here</span>
<span class="keyword">void</span> GPIO_Init(<span class="type">void</span>);

<span class="preprocessor">#endif</span>  <span class="comment">// End of guard</span></code></pre>
                </div>
            </div>

            <h2>#define Macros</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Object-like and function-like macros</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Object-like macros (constants)</span>
<span class="preprocessor">#define</span> LED_PIN         5
<span class="preprocessor">#define</span> CLOCK_FREQ      16000000UL
<span class="preprocessor">#define</span> ENABLE          1
<span class="preprocessor">#define</span> DISABLE         0

<span class="comment">// Function-like macros</span>
<span class="preprocessor">#define</span> SET_BIT(reg, bit)    ((reg) |= (1 << (bit)))
<span class="preprocessor">#define</span> CLEAR_BIT(reg, bit)  ((reg) &= ~(1 << (bit)))
<span class="preprocessor">#define</span> READ_BIT(reg, bit)   (((reg) >> (bit)) & 1)
<span class="preprocessor">#define</span> MIN(a, b)            (((a) < (b)) ? (a) : (b))
<span class="preprocessor">#define</span> MAX(a, b)            (((a) > (b)) ? (a) : (b))

<span class="comment">// Multi-line macro (use backslash)</span>
<span class="preprocessor">#define</span> GPIO_RESET(port) <span class="keyword">do</span> { \\
    RCC->AHB1RSTR |= (1 << port); \\
    RCC->AHB1RSTR &= ~(1 << port); \\
} <span class="keyword">while</span>(0)</code></pre>
                </div>
            </div>

            <h2>Conditional Compilation</h2>
            <p>Compile different code based on conditions - useful for debugging, platform-specific code, and feature toggles:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Conditional compilation</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Debug output only when DEBUG is defined</span>
<span class="preprocessor">#ifdef</span> DEBUG
    printf("Value = %d\\n", value);
<span class="preprocessor">#endif</span>

<span class="comment">// Platform-specific code</span>
<span class="preprocessor">#if defined(STM32F446xx)</span>
    <span class="preprocessor">#define</span> GPIO_PORTS  8
<span class="preprocessor">#elif defined(STM32F103xx)</span>
    <span class="preprocessor">#define</span> GPIO_PORTS  7
<span class="preprocessor">#else</span>
    <span class="preprocessor">#error</span> "Unknown MCU - please define target"
<span class="preprocessor">#endif</span>

<span class="comment">// Feature toggle</span>
<span class="preprocessor">#ifndef</span> USE_DMA
    <span class="preprocessor">#define</span> USE_DMA  0  <span class="comment">// Default: DMA disabled</span>
<span class="preprocessor">#endif</span></code></pre>
                </div>
            </div>

            <div class="warning-box">
                <h4>⚠️ Macro Pitfalls</h4>
                <ul>
                    <li>Always wrap parameters in parentheses: <code>(a)</code> not <code>a</code></li>
                    <li>Beware of side effects: <code>MAX(i++, j)</code> evaluates i++ twice!</li>
                    <li>Use do-while(0) for multi-statement macros</li>
                </ul>
            </div>
        `
    },
    {
        title: "Summary & Best Practices",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🎓</div>
                <p>Congratulations! You've learned the essential Embedded C programming concepts. Here's a comprehensive summary of key practices for writing robust embedded code.</p>
            </div>

            <h2>Data Types Best Practices</h2>
            <ul>
                <li>✅ Always use <code>uint8_t, uint16_t, uint32_t</code> from <code>&lt;stdint.h&gt;</code></li>
                <li>✅ Choose the smallest type that fits your data</li>
                <li>❌ Avoid <code>int</code> - its size varies by platform</li>
            </ul>

            <h2>Bit Manipulation Cheat Sheet</h2>
            <table class="lesson-table">
                <tr><th>Action</th><th>Pattern</th><th>Example</th></tr>
                <tr><td>SET bit</td><td><code>reg |= (1 << n)</code></td><td><code>GPIOA->ODR |= (1 << 5)</code></td></tr>
                <tr><td>CLEAR bit</td><td><code>reg &= ~(1 << n)</code></td><td><code>GPIOA->ODR &= ~(1 << 5)</code></td></tr>
                <tr><td>TOGGLE bit</td><td><code>reg ^= (1 << n)</code></td><td><code>GPIOA->ODR ^= (1 << 5)</code></td></tr>
                <tr><td>CHECK bit</td><td><code>if(reg & (1 << n))</code></td><td><code>if(GPIOA->IDR & (1 << 5))</code></td></tr>
            </table>

            <h2>Memory Keywords Summary</h2>
            <table class="lesson-table">
                <tr><th>Keyword</th><th>Use For</th><th>Example</th></tr>
                <tr><td><code>volatile</code></td><td>Hardware registers, ISR variables</td><td><code>volatile uint32_t *reg</code></td></tr>
                <tr><td><code>const</code></td><td>Read-only data, lookup tables</td><td><code>const uint8_t table[]</code></td></tr>
                <tr><td><code>static</code></td><td>Persistent locals, private globals</td><td><code>static uint32_t count</code></td></tr>
            </table>

            <h2>Function Best Practices</h2>
            <ul>
                <li>✅ Pass large data by pointer, not by value</li>
                <li>✅ Use <code>void</code> for functions with no parameters</li>
                <li>✅ Return status codes for error handling</li>
                <li>✅ Keep functions short and focused</li>
            </ul>

            <h2>Common Embedded Patterns</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Essential patterns</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// 1. Register access</span>
PERIPHERAL->REGISTER |= (value << bit_position);

<span class="comment">// 2. Polling with timeout</span>
uint32_t timeout = 100000;
<span class="keyword">while</span> (!(REG & FLAG) && --timeout);
<span class="keyword">if</span> (timeout == 0) Handle_Error();

<span class="comment">// 3. ISR flag pattern</span>
<span class="keyword">volatile</span> uint8_t flag = 0;
<span class="type">void</span> ISR(<span class="type">void</span>) { flag = 1; }
<span class="keyword">while</span>(1) { <span class="keyword">if</span>(flag) { flag=0; Process(); }}

<span class="comment">// 4. Configuration structure</span>
<span class="keyword">typedef struct</span> {
    uint8_t Mode;
    uint32_t Speed;
} Config_t;</code></pre>
                </div>
            </div>

            <h2>Things to Avoid</h2>
            <ul>
                <li>❌ <code>malloc()</code> and dynamic memory - use static allocation</li>
                <li>❌ Floating point on MCUs without FPU - use fixed-point</li>
                <li>❌ Infinite loops without timeout when waiting for hardware</li>
                <li>❌ Forgetting <code>volatile</code> for hardware registers</li>
                <li>❌ Assuming data type sizes</li>
            </ul>

            <div class="success-box">
                <h4>🎉 You're Ready for Driver Development!</h4>
                <p>With these C fundamentals, you can now:</p>
                <ul>
                    <li>Access and manipulate hardware registers</li>
                    <li>Write efficient, portable embedded code</li>
                    <li>Create well-structured drivers</li>
                    <li>Handle interrupts safely</li>
                    <li>Debug common embedded issues</li>
                </ul>
                <p><strong>Next step: Continue to the MCU Header tutorial to start building real drivers!</strong></p>
            </div>
        `
    }
];
