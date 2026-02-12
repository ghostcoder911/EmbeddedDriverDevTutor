/**
 * GPIO Interrupt Configuration Lessons
 * Complete guide to implementing GPIO interrupts on STM32F407xx
 */

window.gpioInterruptLessons = [
    // Lesson 1: Introduction to GPIO Interrupts
    {
        title: "Introduction to GPIO Interrupts",
        content: `
            <h2>What are GPIO Interrupts?</h2>
            <p>GPIO (General Purpose Input/Output) interrupts allow the microcontroller to respond to external events (like button presses, sensor signals) without continuously polling the GPIO pins.</p>

            <div class="info-box tip">
                <div class="info-box-title">💡 Why Use Interrupts?</div>
                <ul>
                    <li><strong>Lower power consumption</strong> - CPU can sleep until an interrupt occurs</li>
                    <li><strong>Faster response time</strong> - Immediate reaction to external events</li>
                    <li><strong>Better CPU utilization</strong> - CPU can execute other tasks</li>
                </ul>
            </div>

            <h2>Polling vs Interrupts</h2>
            <div class="comparison-grid">
                <div class="comparison-item bad">
                    <h3>❌ Polling Method (Inefficient)</h3>
                    <div class="code-block">
                        <div class="code-header">
                            <span class="code-filename">Inefficient Polling</span>
                            <button class="copy-btn">Copy</button>
                        </div>
                        <div class="code-content">
                            <pre><code>while(1) {
    if(GPIO_ReadPin() == PRESSED) {
        // Handle event
    }
    // CPU is constantly busy checking
    // Wastes power and CPU cycles!
}</code></pre>
                        </div>
                    </div>
                </div>

                <div class="comparison-item good">
                    <h3>✅ Interrupt Method (Efficient)</h3>
                    <div class="code-block">
                        <div class="code-header">
                            <span class="code-filename">Efficient Interrupt</span>
                            <button class="copy-btn">Copy</button>
                        </div>
                        <div class="code-content">
                            <pre><code>// CPU does other work or sleeps
while(1) {
    // Other important tasks
}

// When event occurs → Interrupt fires → ISR executes
void EXTI0_IRQHandler(void) {
    // Handle event immediately!
}</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <div class="info-box note">
                <div class="info-box-title">📘 Key Takeaway</div>
                <p>With interrupts, your code responds immediately to events while the CPU remains free to do other work. This is the foundation of efficient embedded systems!</p>
            </div>
        `
    },

    // Lesson 2: Hardware Architecture
    {
        title: "Hardware Architecture Overview",
        content: `
            <h2>The GPIO Interrupt Chain</h2>
            <p>Understanding the hardware flow is crucial. GPIO interrupts involve four major components working together:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Interrupt Signal Flow</span>
                </div>
                <div class="code-content">
                    <pre><code>┌─────────────┐      ┌──────────────┐      ┌──────────────┐      ┌─────────┐
│   GPIO Pin  │─────>│    SYSCFG    │─────>│     EXTI     │─────>│  NVIC   │─────> CPU
│   (PA0-PI15)│      │ (Multiplexer)│      │ (Controller) │      │ (Core)  │
└─────────────┘      └──────────────┘      └──────────────┘      └─────────┘
     Step 1               Step 2                Step 3             Step 4</code></pre>
                </div>
            </div>

            <h2>Component Breakdown</h2>

            <div class="info-box">
                <div class="info-box-title">1️⃣ GPIO (General Purpose Input/Output)</div>
                <ul>
                    <li>Physical pins on the microcontroller</li>
                    <li>9 ports (A-I) with up to 16 pins each</li>
                    <li>Each pin can be configured as input, output, alternate function, or analog</li>
                </ul>
            </div>

            <div class="info-box">
                <div class="info-box-title">2️⃣ SYSCFG (System Configuration Controller)</div>
                <ul>
                    <li><strong>Purpose:</strong> Multiplexes GPIO pins to EXTI lines</li>
                    <li><strong>Why needed?</strong> Multiple GPIO pins share the same EXTI line</li>
                    <li><strong>Example:</strong> PA0, PB0, PC0... PI0 all map to EXTI0</li>
                    <li><strong>Register:</strong> SYSCFG_EXTICR[0:3]</li>
                    <li><strong>Bus:</strong> APB2 at address 0x40013800</li>
                </ul>
            </div>

            <div class="info-box">
                <div class="info-box-title">3️⃣ EXTI (External Interrupt/Event Controller)</div>
                <ul>
                    <li><strong>Purpose:</strong> Detects edges (rising/falling) and generates interrupt requests</li>
                    <li><strong>Lines:</strong> 23 EXTI lines (0-22)</li>
                    <li><strong>EXTI0-15:</strong> Connected to GPIO pins</li>
                    <li><strong>EXTI16-22:</strong> Connected to internal peripherals</li>
                </ul>
            </div>

            <div class="info-box">
                <div class="info-box-title">4️⃣ NVIC (Nested Vectored Interrupt Controller)</div>
                <ul>
                    <li><strong>Purpose:</strong> ARM Cortex-M4 interrupt controller</li>
                    <li>Manages all interrupts in the system</li>
                    <li>Supports priority levels (0-15, where 0 is highest)</li>
                    <li>Only 4 priority bits implemented in STM32F407xx</li>
                </ul>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Important Constraint</div>
                <p>Only ONE port pin can be connected to an EXTI line at a time!</p>
                <ul>
                    <li>✅ <strong>Valid:</strong> PA0 and PB1 (different EXTI lines)</li>
                    <li>❌ <strong>Invalid:</strong> PA0 and PB0 simultaneously (same EXTI line 0)</li>
                </ul>
            </div>
        `
    },

    // Lesson 3: EXTI Register Structure
    {
        title: "EXTI Registers & Configuration",
        content: `
            <h2>EXTI Register Structure</h2>
            <p>The EXTI peripheral has several key registers that control interrupt behavior:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f407xx.h - EXTI Register Definition</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>typedef struct
{
    __vo uint32_t IMR;     // Interrupt Mask Register         - Offset: 0x00
    __vo uint32_t EMR;     // Event Mask Register             - Offset: 0x04
    __vo uint32_t RTSR;    // Rising Trigger Selection Reg    - Offset: 0x08
    __vo uint32_t FTSR;    // Falling Trigger Selection Reg   - Offset: 0x0C
    __vo uint32_t SWIER;   // Software Interrupt Event Reg    - Offset: 0x10
    __vo uint32_t PR;      // Pending Register                - Offset: 0x14
} EXTI_RegDef_t;

#define EXTI_BASEADDR  (APB2PERIPH_BASEADDR + 0x3C00)  // 0x40013C00
#define EXTI           ((EXTI_RegDef_t*)EXTI_BASEADDR)</code></pre>
                </div>
            </div>

            <h2>Critical EXTI Registers Explained</h2>

            <table class="lesson-table">
                <tr>
                    <th>Register</th>
                    <th>Purpose</th>
                    <th>Configuration</th>
                </tr>
                <tr>
                    <td><strong>IMR</strong><br>(Interrupt Mask)</td>
                    <td>Enables/disables interrupt delivery</td>
                    <td>
                        <code>1</code> = Interrupt enabled<br>
                        <code>0</code> = Interrupt masked
                    </td>
                </tr>
                <tr>
                    <td><strong>RTSR</strong><br>(Rising Trigger)</td>
                    <td>Enables rising edge detection</td>
                    <td>
                        <code>1</code> = Rising edge enabled<br>
                        <code>0</code> = Disabled
                    </td>
                </tr>
                <tr>
                    <td><strong>FTSR</strong><br>(Falling Trigger)</td>
                    <td>Enables falling edge detection</td>
                    <td>
                        <code>1</code> = Falling edge enabled<br>
                        <code>0</code> = Disabled
                    </td>
                </tr>
                <tr>
                    <td><strong>PR</strong><br>(Pending)</td>
                    <td>Indicates pending interrupt<br><span style="color: #e74c3c; font-weight: bold;">MUST BE CLEARED IN ISR!</span></td>
                    <td>
                        Read: <code>1</code> = Pending<br>
                        Write: <code>1</code> = Clear (RC_W1)
                    </td>
                </tr>
            </table>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ CRITICAL: PR Register Must Be Cleared!</div>
                <p>The Pending Register (PR) uses RC_W1 (Read/Clear by Writing 1) mechanism. If you don't clear it in your ISR, the interrupt will keep firing infinitely!</p>
            </div>

            <h2>Example: Configure EXTI5 for Falling Edge</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">EXTI Configuration Example</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// 1. Configure falling edge trigger
EXTI->FTSR |= (1 << 5);   // Enable falling edge on EXTI5
EXTI->RTSR &= ~(1 << 5);  // Clear rising edge (ensure it's not set)

// 2. Enable interrupt delivery
EXTI->IMR |= (1 << 5);    // Unmask EXTI5 interrupt

// Later, in ISR - MUST CLEAR PENDING BIT!
void EXTI9_5_IRQHandler(void) {
    if(EXTI->PR & (1 << 5)) {
        EXTI->PR |= (1 << 5);  // Clear pending bit by writing 1
        // Your interrupt handling code here
    }
}</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Pro Tip: Both Edges</div>
                <p>You can detect both rising and falling edges by setting both RTSR and FTSR bits for the same EXTI line!</p>
                <pre style="margin-top: 10px;"><code>EXTI->RTSR |= (1 << 5);  // Rising edge
EXTI->FTSR |= (1 << 5);  // Falling edge
// Now triggers on BOTH edges!</code></pre>
            </div>
        `
    },

    // Lesson 4: SYSCFG Configuration
    {
        title: "SYSCFG: GPIO to EXTI Mapping",
        content: `
            <h2>Why SYSCFG?</h2>
            <p>Since multiple GPIO pins share the same EXTI line, we need a way to select which port (A, B, C, etc.) should be connected. That's where SYSCFG comes in!</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Pin to EXTI Line Mapping</span>
                </div>
                <div class="code-content">
                    <pre><code>Pin Number (0-15) → EXTI Line (0-15)
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│ PA0     │ PB0     │ PC0     │ PD0     │ ...PI0  │ → EXTI0
│ PA1     │ PB1     │ PC1     │ PD1     │ ...PI1  │ → EXTI1
│ PA2     │ PB2     │ PC2     │ PD2     │ ...PI2  │ → EXTI2
│   ...   │   ...   │   ...   │   ...   │   ...   │
│ PA15    │ PB15    │ PC15    │ PD15    │ ...PI15 │ → EXTI15
└─────────┴─────────┴─────────┴─────────┴─────────┘</code></pre>
                </div>
            </div>

            <h2>SYSCFG Register Structure</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f407xx.h - SYSCFG Definition</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>typedef struct
{
    __vo uint32_t MEMRMP;           // Memory Remap Register       - Offset: 0x00
    __vo uint32_t PMC;              // Peripheral Mode Config      - Offset: 0x04
    __vo uint32_t EXTICR[4];        // External Interrupt Config   - Offset: 0x08-0x14
    uint32_t      RESERVED1[2];     // Reserved                    - Offset: 0x18-0x1C
    __vo uint32_t CMPCR;            // Compensation Cell Control   - Offset: 0x20
} SYSCFG_RegDef_t;

#define SYSCFG_BASEADDR (APB2PERIPH_BASEADDR + 0x3800)  // 0x40013800
#define SYSCFG          ((SYSCFG_RegDef_t*)SYSCFG_BASEADDR)</code></pre>
                </div>
            </div>

            <h2>SYSCFG_EXTICR Register Mapping</h2>
            <p>Each EXTICR register controls 4 EXTI lines (4 bits per line):</p>

            <table class="lesson-table">
                <tr>
                    <th>Register</th>
                    <th>Controls</th>
                    <th>Bit Fields</th>
                </tr>
                <tr>
                    <td>EXTICR[0]</td>
                    <td>EXTI0, EXTI1, EXTI2, EXTI3</td>
                    <td>Bits [15:12][11:8][7:4][3:0]</td>
                </tr>
                <tr>
                    <td>EXTICR[1]</td>
                    <td>EXTI4, EXTI5, EXTI6, EXTI7</td>
                    <td>Bits [15:12][11:8][7:4][3:0]</td>
                </tr>
                <tr>
                    <td>EXTICR[2]</td>
                    <td>EXTI8, EXTI9, EXTI10, EXTI11</td>
                    <td>Bits [15:12][11:8][7:4][3:0]</td>
                </tr>
                <tr>
                    <td>EXTICR[3]</td>
                    <td>EXTI12, EXTI13, EXTI14, EXTI15</td>
                    <td>Bits [15:12][11:8][7:4][3:0]</td>
                </tr>
            </table>

            <h2>Port Code Values</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">GPIO Port Codes for SYSCFG</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>0000 (0): PA[x] pin
0001 (1): PB[x] pin
0010 (2): PC[x] pin
0011 (3): PD[x] pin
0100 (4): PE[x] pin
0101 (5): PF[x] pin
0110 (6): PG[x] pin
0111 (7): PH[x] pin
1000 (8): PI[x] pin</code></pre>
                </div>
            </div>

            <h2>Configuration Example: PD5 for EXTI5</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Step-by-Step Calculation</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// Goal: Configure PD5 to trigger EXTI5
Pin Number = 5
Port = D (GPIOD)

// Step 1: Calculate which EXTICR register to use
uint8_t temp1 = 5 / 4 = 1;        // Use EXTICR[1]

// Step 2: Calculate bit position within that register
uint8_t temp2 = 5 % 4 = 1;        // Second group (bits 7:4)

// Step 3: Get port code (0-8)
Port code for GPIOD = 3           // From table above

// Step 4: Enable SYSCFG clock (MANDATORY!)
SYSCFG_PCLK_EN();                 // Enable clock first!

// Step 5: Configure SYSCFG
SYSCFG->EXTICR[1] = (3 << (1 * 4));  // 3 << 4 = 0x00000030
// This sets bits [7:4] = 0011 (Port D)

// Result: PD5 is now connected to EXTI5!</code></pre>
                </div>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Don't Forget SYSCFG Clock!</div>
                <p>SYSCFG is on the APB2 bus. You MUST enable its clock before accessing SYSCFG registers, otherwise your configuration won't work!</p>
                <pre style="margin-top: 10px;"><code>// In RCC register
RCC->APB2ENR |= (1 << 14);  // Enable SYSCFG clock (bit 14)</code></pre>
            </div>
        `
    },

    // Lesson 5: NVIC Configuration
    {
        title: "NVIC: Interrupt Controller",
        content: `
            <h2>Understanding the NVIC</h2>
            <p>The NVIC (Nested Vectored Interrupt Controller) is part of the ARM Cortex-M4 core. It manages all system interrupts and determines which interrupt to service based on priority.</p>

            <div class="info-box note">
                <div class="info-box-title">📘 NVIC Key Features</div>
                <ul>
                    <li>Manages up to 240 interrupts in STM32F407xx</li>
                    <li>16 priority levels (0-15, where 0 is highest)</li>
                    <li>Only 4 priority bits are implemented (upper 4 bits of byte)</li>
                    <li>Registers are memory-mapped (not in peripheral bus)</li>
                </ul>
            </div>

            <h2>EXTI to NVIC IRQ Mapping</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">IRQ Number Definitions</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>#define IRQ_NO_EXTI0        6      // EXTI Line 0
#define IRQ_NO_EXTI1        7      // EXTI Line 1
#define IRQ_NO_EXTI2        8      // EXTI Line 2
#define IRQ_NO_EXTI3        9      // EXTI Line 3
#define IRQ_NO_EXTI4        10     // EXTI Line 4
#define IRQ_NO_EXTI9_5      23     // EXTI Lines 5-9 (shared)
#define IRQ_NO_EXTI15_10    40     // EXTI Lines 10-15 (shared)</code></pre>
                </div>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Shared IRQ Handlers</div>
                <ul>
                    <li><strong>EXTI0-4:</strong> Each has dedicated IRQ handler</li>
                    <li><strong>EXTI5-9:</strong> Share common IRQ 23 (EXTI9_5_IRQHandler)</li>
                    <li><strong>EXTI10-15:</strong> Share common IRQ 40 (EXTI15_10_IRQHandler)</li>
                </ul>
                <p style="margin-top: 10px;">For shared IRQs, you must check the EXTI->PR register in your ISR to determine which line triggered!</p>
            </div>

            <h2>NVIC Register Addresses</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">NVIC Register Definitions</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// Interrupt Set Enable Registers (Enable interrupts)
#define NVIC_ISER0    ((__vo uint32_t*)0xE000E100)  // IRQ 0-31
#define NVIC_ISER1    ((__vo uint32_t*)0xE000E104)  // IRQ 32-63
#define NVIC_ISER2    ((__vo uint32_t*)0xE000E108)  // IRQ 64-95

// Interrupt Clear Enable Registers (Disable interrupts)
#define NVIC_ICER0    ((__vo uint32_t*)0xE000E180)  // IRQ 0-31
#define NVIC_ICER1    ((__vo uint32_t*)0xE000E184)  // IRQ 32-63
#define NVIC_ICER2    ((__vo uint32_t*)0xE000E188)  // IRQ 64-95

// Interrupt Priority Registers
#define NVIC_PR_BASE_ADDR  ((__vo uint32_t*)0xE000E400)</code></pre>
                </div>
            </div>

            <h2>Enabling NVIC Interrupt</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">GPIO_IRQInterruptConfig() Implementation</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>void GPIO_IRQInterruptConfig(uint8_t IRQNumber, uint8_t EnorDi)
{
    if(EnorDi == ENABLE)
    {
        // Enable interrupt in NVIC
        if(IRQNumber <= 31)
        {
            // Use ISER0 for IRQ 0-31
            *NVIC_ISER0 |= (1 << IRQNumber);
        }
        else if(IRQNumber > 31 && IRQNumber < 64)
        {
            // Use ISER1 for IRQ 32-63
            *NVIC_ISER1 |= (1 << (IRQNumber % 32));
        }
        else if(IRQNumber >= 64 && IRQNumber < 96)
        {
            // Use ISER2 for IRQ 64-95
            *NVIC_ISER2 |= (1 << (IRQNumber % 64));
        }
    }
    else
    {
        // Disable interrupt in NVIC
        if(IRQNumber <= 31)
        {
            *NVIC_ICER0 |= (1 << IRQNumber);
        }
        else if(IRQNumber > 31 && IRQNumber < 64)
        {
            *NVIC_ICER1 |= (1 << (IRQNumber % 32));
        }
        else if(IRQNumber >= 64 && IRQNumber < 96)
        {
            *NVIC_ICER2 |= (1 << (IRQNumber % 64));
        }
    }
}</code></pre>
                </div>
            </div>

            <h2>Example: Enable IRQ 23 (EXTI9_5)</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Enabling EXTI5-9 Interrupt</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// IRQ Number = 23
// 23 <= 31, so use ISER0
*NVIC_ISER0 |= (1 << 23);  // Set bit 23 in ISER0

// Or use the driver function:
GPIO_IRQInterruptConfig(IRQ_NO_EXTI9_5, ENABLE);</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Understanding the Modulo Operation</div>
                <p>Since each ISERx register is 32-bit, we use modulo to find the bit position:</p>
                <ul>
                    <li>IRQ 0-31 → ISER0, bit (IRQ % 32)</li>
                    <li>IRQ 32-63 → ISER1, bit (IRQ % 32)</li>
                    <li>IRQ 64-95 → ISER2, bit (IRQ % 64)</li>
                </ul>
            </div>
        `
    },

    // Lesson 6: Priority Configuration
    {
        title: "Interrupt Priority Configuration",
        content: `
            <h2>Understanding Priority Levels</h2>
            <p>The NVIC supports interrupt priorities to determine which interrupt should be serviced first when multiple interrupts occur simultaneously.</p>

            <div class="info-box note">
                <div class="info-box-title">📘 Priority Rules</div>
                <ul>
                    <li><strong>0</strong> = Highest priority (most urgent)</li>
                    <li><strong>15</strong> = Lowest priority (least urgent)</li>
                    <li>Lower number = Higher urgency</li>
                    <li>If same priority, lower IRQ number wins</li>
                    <li>Default priority is 0 if not configured</li>
                </ul>
            </div>

            <h2>Priority Register Layout</h2>
            <p>Each IRQ priority occupies 8 bits, but only the upper 4 bits are implemented in STM32F407xx:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">IPR Register Structure</span>
                </div>
                <div class="code-content">
                    <pre><code>Each 32-bit IPR register holds 4 IRQ priorities:

IPR[0]: [IRQ3][IRQ2][IRQ1][IRQ0]
        31..24 23..16 15..8  7..0

Each IRQ priority byte:
Bits 7:4 = Priority value (0-15) ← Only these are implemented!
Bits 3:0 = Always read as 0 (not implemented)</code></pre>
                </div>
            </div>

            <h2>Setting Interrupt Priority</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">GPIO_IRQPriorityConfig() Implementation</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>void GPIO_IRQPriorityConfig(uint8_t IRQNumber, uint32_t IRQPriority)
{
    // Calculate which IPR register (each handles 4 IRQs)
    uint8_t iprx = IRQNumber / 4;
    
    // Calculate which byte within IPR register (0-3)
    uint8_t iprx_section = IRQNumber % 4;
    
    // Calculate bit shift amount
    // Each IRQ uses 8 bits, but only upper 4 bits are implemented
    uint8_t shift_amount = (8 * iprx_section) + (8 - NO_PR_BITS_IMPLEMENTED);
    
    // Set priority value (clear old value first for safety)
    *(NVIC_PR_BASE_ADDR + iprx) |= (IRQPriority << shift_amount);
}

// Where NO_PR_BITS_IMPLEMENTED = 4 for STM32F407xx</code></pre>
                </div>
            </div>

            <h2>Step-by-Step Example: Set Priority for IRQ 23</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Priority Calculation Example</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// Goal: Set IRQ 23 (EXTI9_5) to priority 15 (lowest)
IRQNumber = 23
IRQPriority = 15

// Step 1: Calculate which IPR register
iprx = 23 / 4 = 5              // Use IPR[5]

// Step 2: Calculate byte position
iprx_section = 23 % 4 = 3      // 4th byte (bits 31:24)

// Step 3: Calculate shift amount
shift_amount = (8 * 3) + 4     // 8 bits per section, upper 4 used
             = 24 + 4 = 28

// Step 4: Set priority
*(NVIC_PR_BASE_ADDR + 5) |= (15 << 28);

// Result in IPR[5]:
// Bits 31:28 = 1111 (priority 15)
// Bits 27:24 = 0000 (not implemented)</code></pre>
                </div>
            </div>

            <h2>Practical Priority Assignment</h2>
            <table class="lesson-table">
                <tr>
                    <th>Priority Level</th>
                    <th>Use Case</th>
                    <th>Example</th>
                </tr>
                <tr>
                    <td><strong>0-3</strong> (Highest)</td>
                    <td>Critical safety functions</td>
                    <td>Emergency stop button</td>
                </tr>
                <tr>
                    <td><strong>4-7</strong> (High)</td>
                    <td>Time-critical operations</td>
                    <td>Motor control, sensor sampling</td>
                </tr>
                <tr>
                    <td><strong>8-11</strong> (Medium)</td>
                    <td>Normal peripherals</td>
                    <td>UART data reception</td>
                </tr>
                <tr>
                    <td><strong>12-15</strong> (Low)</td>
                    <td>Non-critical inputs</td>
                    <td>User button, LED toggle</td>
                </tr>
            </table>

            <h2>Usage Example</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Setting Multiple Priorities</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// Emergency stop - Highest priority
GPIO_IRQPriorityConfig(IRQ_NO_EXTI0, 0);

// Sensor input - High priority
GPIO_IRQPriorityConfig(IRQ_NO_EXTI1, 5);

// User button - Low priority
GPIO_IRQPriorityConfig(IRQ_NO_EXTI9_5, 15);

// Enable all interrupts
GPIO_IRQInterruptConfig(IRQ_NO_EXTI0, ENABLE);
GPIO_IRQInterruptConfig(IRQ_NO_EXTI1, ENABLE);
GPIO_IRQInterruptConfig(IRQ_NO_EXTI9_5, ENABLE);</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Priority Preemption</div>
                <p>A higher priority interrupt can preempt (interrupt) a lower priority ISR that's currently executing. This allows critical events to be handled immediately!</p>
            </div>
        `
    },

    // Lesson 7: Complete Configuration Flow
    {
        title: "Complete Configuration Process",
        content: `
            <h2>The 5-Step Configuration Flow</h2>
            <p>Now let's put everything together! Configuring a GPIO interrupt requires 5 sequential steps:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Configuration Flow Diagram</span>
                </div>
                <div class="code-content">
                    <pre><code>┌──────────────────────────────────────────────────┐
│ Step 1: Enable GPIO Clock                       │
│ GPIO_PeriClockControl(GPIOD, ENABLE);          │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│ Step 2: Configure GPIO Pin                      │
│ - Set mode to interrupt (IT_FT/IT_RT/IT_RFT)   │
│ - Configure EXTI trigger (FTSR/RTSR)           │
│ - Configure SYSCFG (GPIO to EXTI mapping)      │
│ - Enable EXTI interrupt (IMR)                  │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│ Step 3: Configure IRQ Priority (NVIC)          │
│ GPIO_IRQPriorityConfig(IRQ_NO, priority);      │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│ Step 4: Enable IRQ in NVIC                     │
│ GPIO_IRQInterruptConfig(IRQ_NO, ENABLE);       │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│ Step 5: Implement ISR Handler                   │
│ void EXTIx_IRQHandler(void) { ... }            │
└──────────────────────────────────────────────────┘</code></pre>
                </div>
            </div>

            <h2>Step 1: Enable GPIO Clock</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Clock Enable</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// Enable clock for GPIOD
GPIO_PeriClockControl(GPIOD, ENABLE);

// Or directly:
RCC->AHB1ENR |= (1 << 3);  // GPIOD is bit 3</code></pre>
                </div>
            </div>

            <h2>Step 2: Configure GPIO Pin</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">GPIO Configuration</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>GPIO_Handle_t GPIOBtn;

// Configure button pin (PD5) for interrupt
GPIOBtn.pGPIOx = GPIOD;
GPIOBtn.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_5;
GPIOBtn.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_FT;  // Falling edge
GPIOBtn.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
GPIOBtn.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PU;  // Pull-up

// This single call does LOTS internally:
// - Configures EXTI trigger (FTSR/RTSR)
// - Configures SYSCFG_EXTICR (GPIO to EXTI mapping)
// - Enables EXTI interrupt (IMR)
// - Configures pull-up/pull-down
GPIO_Init(&GPIOBtn);</code></pre>
                </div>
            </div>

            <h2>Step 3: Configure Priority</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Priority Configuration</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// Set priority to 15 (lowest) - optional but recommended
GPIO_IRQPriorityConfig(IRQ_NO_EXTI9_5, NVIC_IRQ_PRI15);</code></pre>
                </div>
            </div>

            <h2>Step 4: Enable NVIC Interrupt</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">NVIC Enable</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// Enable IRQ 23 (EXTI5-9) in NVIC
GPIO_IRQInterruptConfig(IRQ_NO_EXTI9_5, ENABLE);</code></pre>
                </div>
            </div>

            <h2>Step 5: Implement ISR</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Interrupt Service Routine</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// ISR name MUST match vector table!
void EXTI9_5_IRQHandler(void)
{
    // Optional: Software debouncing
    delay();
    
    // MANDATORY: Clear pending bit
    GPIO_IRQHandling(GPIO_PIN_NO_5);
    
    // Your interrupt handling code
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);
}</code></pre>
                </div>
            </div>

            <div class="info-box note">
                <div class="info-box-title">📘 What GPIO_Init() Does Internally</div>
                <p>When you call <code>GPIO_Init()</code> with an interrupt mode (IT_FT/IT_RT/IT_RFT), it automatically:</p>
                <ol>
                    <li>Configures EXTI trigger (FTSR/RTSR registers)</li>
                    <li>Enables SYSCFG clock</li>
                    <li>Configures SYSCFG_EXTICR for GPIO-to-EXTI mapping</li>
                    <li>Enables EXTI interrupt in IMR register</li>
                    <li>Configures pin speed and pull-up/pull-down</li>
                </ol>
                <p>This saves you from manually configuring EXTI and SYSCFG registers!</p>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Common Configuration Mistakes</div>
                <ul>
                    <li>Forgetting to enable GPIO clock → Configuration fails silently</li>
                    <li>Wrong trigger edge → Interrupt never fires</li>
                    <li>Wrong IRQ number → Wrong ISR called (or none at all)</li>
                    <li>Not clearing PR bit in ISR → Infinite interrupt loop</li>
                    <li>Typo in ISR name → Interrupt goes to default handler</li>
                </ul>
            </div>
        `
    },

    // Lesson 8: Complete Working Example
    {
        title: "Complete Example: Button to LED",
        content: `
            <h2>Complete Working Application</h2>
            <p>Let's build a complete application: Press a button to toggle an LED using interrupts!</p>

            <h2>Hardware Setup</h2>
            <ul>
                <li><strong>Button:</strong> Connected to PD5 (active-low with pull-up)</li>
                <li><strong>LED:</strong> Connected to PD12</li>
                <li><strong>Board:</strong> STM32F407 Discovery or similar</li>
            </ul>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">main.c - Complete Button Interrupt Example</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>#include "stm32f407xx.h"

// Software delay for debouncing (~200ms @ 16MHz)
void delay(void)
{
    for(uint32_t i = 0; i < 500000/2; i++);
}

int main(void)
{
    GPIO_Handle_t GpioLed, GPIOBtn;
    
    // Clear structures
    memset(&GpioLed, 0, sizeof(GpioLed));
    memset(&GPIOBtn, 0, sizeof(GPIOBtn));
    
    // ========== Configure LED Pin (PD12) - Output ==========
    GpioLed.pGPIOx = GPIOD;
    GpioLed.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_12;
    GpioLed.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_OUT;
    GpioLed.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_LOW;
    GpioLed.GPIO_PinConfig.GPIO_PinOPType = GPIO_OP_TYPE_PP;
    GpioLed.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;
    
    GPIO_PeriClockControl(GPIOD, ENABLE);
    GPIO_Init(&GpioLed);
    
    // ========== Configure Button Pin (PD5) - Interrupt ==========
    GPIOBtn.pGPIOx = GPIOD;
    GPIOBtn.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_5;
    GPIOBtn.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_FT;  // Falling edge
    GPIOBtn.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GPIOBtn.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PU;  // Pull-up
    
    // Clock already enabled above
    GPIO_Init(&GPIOBtn);  // Configures EXTI, SYSCFG, and IMR
    
    // Initialize LED to OFF
    GPIO_WriteToOutputPin(GPIOD, GPIO_PIN_NO_12, GPIO_PIN_RESET);
    
    // ========== Configure Interrupt ==========
    GPIO_IRQPriorityConfig(IRQ_NO_EXTI9_5, NVIC_IRQ_PRI15);
    GPIO_IRQInterruptConfig(IRQ_NO_EXTI9_5, ENABLE);
    
    // Main loop - wait for interrupts
    while(1)
    {
        // CPU can do other work here or sleep to save power
    }
}

// ========== Interrupt Service Routine ==========
void EXTI9_5_IRQHandler(void)
{
    delay();  // Software debouncing
    
    GPIO_IRQHandling(GPIO_PIN_NO_5);  // Clear pending interrupt
    
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);  // Toggle LED
}</code></pre>
                </div>
            </div>

            <h2>How It Works</h2>
            <div class="info-box note">
                <div class="info-box-title">📘 Execution Flow</div>
                <ol>
                    <li>System initializes with LED off</li>
                    <li>Main loop runs (can do other work or sleep)</li>
                    <li><strong>Button pressed:</strong> Pin goes LOW (falling edge)</li>
                    <li>EXTI5 detects falling edge → Sets PR bit → Signals NVIC</li>
                    <li>NVIC interrupts CPU → Jumps to EXTI9_5_IRQHandler</li>
                    <li>ISR waits for debouncing</li>
                    <li>ISR clears PR bit (mandatory!)</li>
                    <li>ISR toggles LED</li>
                    <li>ISR returns → CPU continues main loop</li>
                </ol>
            </div>

            <h2>GPIO_IRQHandling() Implementation</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f407xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>void GPIO_IRQHandling(uint8_t PinNumber)
{
    // Check if interrupt is pending for this pin
    if(EXTI->PR & (1 << PinNumber))
    {
        // Clear the pending bit by writing 1 to it (RC_W1 type)
        EXTI->PR |= (1 << PinNumber);
    }
}</code></pre>
                </div>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Why Clearing PR is Critical</div>
                <p>The PR (Pending Register) uses RC_W1 mechanism:</p>
                <ul>
                    <li><strong>Without clearing:</strong> EXTI keeps PR bit set → NVIC calls ISR again → Infinite loop!</li>
                    <li><strong>With clearing:</strong> ISR clears PR → EXTI ready for next interrupt → System works correctly</li>
                </ul>
                <p style="margin-top: 10px;">Always, ALWAYS clear the pending bit! This is the #1 cause of interrupt issues.</p>
            </div>

            <h2>Testing Your Code</h2>
            <div class="info-box tip">
                <div class="info-box-title">💡 Debugging Tips</div>
                <ul>
                    <li><strong>LED doesn't toggle?</strong>
                        <ul>
                            <li>Check if ISR name matches vector table exactly</li>
                            <li>Verify NVIC interrupt is enabled</li>
                            <li>Check GPIO clock is enabled</li>
                        </ul>
                    </li>
                    <li><strong>Multiple toggles per press?</strong>
                        <ul>
                            <li>Increase debounce delay</li>
                            <li>Add hardware RC filter</li>
                        </ul>
                    </li>
                    <li><strong>System hangs?</strong>
                        <ul>
                            <li>You probably forgot to clear PR bit!</li>
                            <li>Check EXTI->PR register in debugger</li>
                        </ul>
                    </li>
                </ul>
            </div>
        `
    },

    // Lesson 9: Advanced Examples
    {
        title: "Advanced Examples",
        content: `
            <h2>Example 1: Multiple Buttons with Different Priorities</h2>
            <p>Let's create a system with two buttons at different priority levels:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Multiple Button Example</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>#include "stm32f407xx.h"

volatile uint8_t button1_pressed = 0;
volatile uint8_t button2_pressed = 0;

int main(void)
{
    GPIO_Handle_t GPIOBtn1, GPIOBtn2, GpioLed;
    
    // ========== Button 1 (PA0) - EXTI0 - Rising Edge ==========
    GPIOBtn1.pGPIOx = GPIOA;
    GPIOBtn1.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_0;
    GPIOBtn1.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_RT;  // Rising
    GPIOBtn1.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GPIOBtn1.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PD;  // Pull-down
    
    GPIO_PeriClockControl(GPIOA, ENABLE);
    GPIO_Init(&GPIOBtn1);
    
    // ========== Button 2 (PC13) - EXTI13 - Falling Edge ==========
    GPIOBtn2.pGPIOx = GPIOC;
    GPIOBtn2.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_13;
    GPIOBtn2.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_FT;  // Falling
    GPIOBtn2.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GPIOBtn2.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PU;  // Pull-up
    
    GPIO_PeriClockControl(GPIOC, ENABLE);
    GPIO_Init(&GPIOBtn2);
    
    // ========== LED (PD15) ==========
    GpioLed.pGPIOx = GPIOD;
    GpioLed.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_15;
    GpioLed.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_OUT;
    GpioLed.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GpioLed.GPIO_PinConfig.GPIO_PinOPType = GPIO_OP_TYPE_PP;
    GpioLed.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;
    
    GPIO_PeriClockControl(GPIOD, ENABLE);
    GPIO_Init(&GpioLed);
    
    // ========== Configure Interrupts ==========
    // Button 1 - Higher priority (responds faster)
    GPIO_IRQPriorityConfig(IRQ_NO_EXTI0, NVIC_IRQ_PRI5);
    GPIO_IRQInterruptConfig(IRQ_NO_EXTI0, ENABLE);
    
    // Button 2 - Lower priority
    GPIO_IRQPriorityConfig(IRQ_NO_EXTI15_10, NVIC_IRQ_PRI10);
    GPIO_IRQInterruptConfig(IRQ_NO_EXTI15_10, ENABLE);
    
    while(1)
    {
        // Main loop processes button presses
        if(button1_pressed)
        {
            button1_pressed = 0;
            GPIO_WriteToOutputPin(GPIOD, GPIO_PIN_NO_15, GPIO_PIN_SET);
        }
        
        if(button2_pressed)
        {
            button2_pressed = 0;
            GPIO_WriteToOutputPin(GPIOD, GPIO_PIN_NO_15, GPIO_PIN_RESET);
        }
    }
}

// ISR for Button 1 (EXTI0)
void EXTI0_IRQHandler(void)
{
    GPIO_IRQHandling(GPIO_PIN_NO_0);
    button1_pressed = 1;
}

// ISR for Button 2 (EXTI13)
void EXTI15_10_IRQHandler(void)
{
    // Check which line triggered (important for shared IRQ!)
    if(EXTI->PR & (1 << GPIO_PIN_NO_13))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_13);
        button2_pressed = 1;
    }
}</code></pre>
                </div>
            </div>

            <h2>Example 2: Both Edge Detection</h2>
            <p>Detect both rising and falling edges to track pin state changes:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Both Edges Detection</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>#include "stm32f407xx.h"

int main(void)
{
    GPIO_Handle_t GPIOSensor, GpioLed;
    
    // ========== Sensor Input (PB8) - Both Edges ==========
    GPIOSensor.pGPIOx = GPIOB;
    GPIOSensor.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_8;
    GPIOSensor.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_RFT;  // Both!
    GPIOSensor.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GPIOSensor.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;
    
    GPIO_PeriClockControl(GPIOB, ENABLE);
    GPIO_Init(&GPIOSensor);
    
    // ========== LED (PA5) ==========
    GpioLed.pGPIOx = GPIOA;
    GpioLed.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_5;
    GpioLed.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_OUT;
    GpioLed.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GpioLed.GPIO_PinConfig.GPIO_PinOPType = GPIO_OP_TYPE_PP;
    GpioLed.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;
    
    GPIO_PeriClockControl(GPIOA, ENABLE);
    GPIO_Init(&GpioLed);
    
    // ========== Configure Interrupt ==========
    GPIO_IRQPriorityConfig(IRQ_NO_EXTI9_5, NVIC_IRQ_PRI0);
    GPIO_IRQInterruptConfig(IRQ_NO_EXTI9_5, ENABLE);
    
    while(1)
    {
        // Main loop can do other work
    }
}

// ISR - Triggered on both rising and falling edges
void EXTI9_5_IRQHandler(void)
{
    if(EXTI->PR & (1 << GPIO_PIN_NO_8))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_8);
        
        // Check current state to determine edge type
        if(GPIO_ReadFromInputPin(GPIOB, GPIO_PIN_NO_8) == GPIO_PIN_SET)
        {
            // Rising edge detected - Turn LED ON
            GPIO_WriteToOutputPin(GPIOA, GPIO_PIN_NO_5, GPIO_PIN_SET);
        }
        else
        {
            // Falling edge detected - Turn LED OFF
            GPIO_WriteToOutputPin(GPIOA, GPIO_PIN_NO_5, GPIO_PIN_RESET);
        }
    }
}</code></pre>
                </div>
            </div>

            <h2>Example 3: Handling Shared IRQ Lines</h2>
            <p>When multiple EXTI lines share an IRQ, you must check which one triggered:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Shared IRQ Handler Pattern</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>// EXTI9_5 handler for pins 5, 6, 7, 8, and 9
void EXTI9_5_IRQHandler(void)
{
    // Check each possible pin that could have triggered
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_5))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_5);
        // Handle pin 5 interrupt
        handle_button_press();
    }
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_6))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_6);
        // Handle pin 6 interrupt
        handle_sensor_input();
    }
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_7))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_7);
        // Handle pin 7 interrupt
        handle_emergency_stop();
    }
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_8))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_8);
        // Handle pin 8 interrupt
        handle_encoder_signal();
    }
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_9))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_9);
        // Handle pin 9 interrupt
        handle_limit_switch();
    }
}</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Best Practice: Volatile Variables</div>
                <p>Always use <code>volatile</code> for variables shared between ISR and main code:</p>
                <pre style="margin-top: 10px;"><code>// ✅ CORRECT - Compiler won't optimize away
volatile uint8_t interrupt_flag = 0;

// ❌ WRONG - Compiler might optimize in while loop
uint8_t interrupt_flag = 0;</code></pre>
                <p style="margin-top: 10px;">Without <code>volatile</code>, the compiler may assume the variable never changes and optimize reads away!</p>
            </div>
        `
    },

    // Lesson 10: Common Pitfalls and Best Practices
    {
        title: "Common Pitfalls & Best Practices",
        content: `
            <h2>Common Pitfalls to Avoid</h2>

            <div class="info-box warning">
                <div class="info-box-title">❌ Pitfall #1: Forgetting to Clear Pending Bit</div>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">Wrong vs Right</span>
                        <button class="copy-btn">Copy</button>
                    </div>
                    <div class="code-content">
                        <pre><code>// ❌ WRONG - Will cause infinite ISR calls
void EXTI0_IRQHandler(void)
{
    // Forgot to clear PR bit!
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);
}

// ✅ CORRECT
void EXTI0_IRQHandler(void)
{
    GPIO_IRQHandling(GPIO_PIN_NO_0);  // Clears PR bit
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);
}</code></pre>
                    </div>
                </div>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">❌ Pitfall #2: Not Enabling Required Clocks</div>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">Clock Dependencies</span>
                        <button class="copy-btn">Copy</button>
                    </div>
                    <div class="code-content">
                        <pre><code>// ❌ WRONG - Missing SYSCFG clock enable
SYSCFG->EXTICR[0] = 0x1;  // Will not work!

// ✅ CORRECT - Enable SYSCFG clock first
SYSCFG_PCLK_EN();  // Or: RCC->APB2ENR |= (1 << 14);
SYSCFG->EXTICR[0] = 0x1;</code></pre>
                    </div>
                </div>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">❌ Pitfall #3: Wrong ISR Handler Name</div>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">ISR Naming</span>
                        <button class="copy-btn">Copy</button>
                    </div>
                    <div class="code-content">
                        <pre><code>// ❌ WRONG - Name doesn't match vector table
void EXTI5_IRQHandler(void)  // No such handler!
{
    // This will NEVER be called!
}

// ✅ CORRECT - Use exact name from startup file
void EXTI9_5_IRQHandler(void)  // Handles EXTI5-9
{
    // This will be called correctly
}</code></pre>
                    </div>
                </div>
                <p style="margin-top: 10px;"><strong>Correct ISR names:</strong></p>
                <ul>
                    <li>EXTI0_IRQHandler</li>
                    <li>EXTI1_IRQHandler</li>
                    <li>EXTI2_IRQHandler</li>
                    <li>EXTI3_IRQHandler</li>
                    <li>EXTI4_IRQHandler</li>
                    <li>EXTI9_5_IRQHandler (for EXTI5-9)</li>
                    <li>EXTI15_10_IRQHandler (for EXTI10-15)</li>
                </ul>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">❌ Pitfall #4: Not Checking PR Bit in Shared IRQ</div>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">Shared IRQ Handling</span>
                        <button class="copy-btn">Copy</button>
                    </div>
                    <div class="code-content">
                        <pre><code>// ❌ WRONG - Assumes pin 5 without checking
void EXTI9_5_IRQHandler(void)
{
    GPIO_IRQHandling(GPIO_PIN_NO_5);  // Might clear wrong interrupt!
    handle_pin5();
}

// ✅ CORRECT - Check before handling
void EXTI9_5_IRQHandler(void)
{
    if(EXTI->PR & (1 << GPIO_PIN_NO_5))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_5);
        handle_pin5();
    }
    if(EXTI->PR & (1 << GPIO_PIN_NO_6))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_6);
        handle_pin6();
    }
}</code></pre>
                    </div>
                </div>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">❌ Pitfall #5: Wrong Trigger Edge Selection</div>
                <p>Active-low button with pull-up:</p>
                <ul>
                    <li>Unpressed: Pin reads HIGH (pulled up)</li>
                    <li>Pressed: Pin goes LOW (connected to GND)</li>
                    <li>Use <code>GPIO_MODE_IT_FT</code> (falling edge)</li>
                </ul>
                <p style="margin-top: 10px;">Active-high button with pull-down:</p>
                <ul>
                    <li>Unpressed: Pin reads LOW (pulled down)</li>
                    <li>Pressed: Pin goes HIGH (connected to VCC)</li>
                    <li>Use <code>GPIO_MODE_IT_RT</code> (rising edge)</li>
                </ul>
            </div>

            <h2>Best Practices</h2>

            <div class="info-box tip">
                <div class="info-box-title">✅ Practice #1: Keep ISR Short and Fast</div>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">Good ISR Design</span>
                        <button class="copy-btn">Copy</button>
                    </div>
                    <div class="code-content">
                        <pre><code>// ✅ GOOD - Set flag and return quickly
volatile uint8_t button_event = 0;

void EXTI0_IRQHandler(void)
{
    GPIO_IRQHandling(GPIO_PIN_NO_0);
    button_event = 1;  // Set flag
}

int main(void)
{
    while(1)
    {
        if(button_event)
        {
            button_event = 0;
            // Do time-consuming processing here
            process_button_press();
        }
    }
}</code></pre>
                    </div>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">✅ Practice #2: Use Volatile for Shared Variables</div>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">Volatile Keyword</span>
                        <button class="copy-btn">Copy</button>
                    </div>
                    <div class="code-content">
                        <pre><code>// ✅ CORRECT - Prevents compiler optimization
volatile uint8_t interrupt_count = 0;

void EXTI0_IRQHandler(void)
{
    GPIO_IRQHandling(GPIO_PIN_NO_0);
    interrupt_count++;  // Compiler won't optimize away
}</code></pre>
                    </div>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">✅ Practice #3: Implement Button Debouncing</div>
                <p><strong>Software Debouncing:</strong></p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">Software Debounce</span>
                        <button class="copy-btn">Copy</button>
                    </div>
                    <div class="code-content">
                        <pre><code>void delay(void)
{
    for(uint32_t i = 0; i < 500000/2; i++);
}

void EXTI0_IRQHandler(void)
{
    delay();  // Wait for bouncing to settle
    GPIO_IRQHandling(GPIO_PIN_NO_0);
    handle_button_press();
}</code></pre>
                    </div>
                </div>
                <p style="margin-top: 15px;"><strong>Hardware Debouncing (Better!):</strong></p>
                <pre style="margin-top: 10px;"><code>Button ─── [RC Filter] ─── GPIO Pin

Components:
C = 100nF
R = 10kΩ
Time constant τ = RC = 1ms</code></pre>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">✅ Practice #4: Document Your Configuration</div>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">Good Documentation</span>
                        <button class="copy-btn">Copy</button>
                    </div>
                    <div class="code-content">
                        <pre><code>// Interrupt configuration
#define BUTTON1_IRQ         IRQ_NO_EXTI0        // PA0 - User button
#define BUTTON1_PRIORITY    NVIC_IRQ_PRI5       // Medium priority

#define EMERGENCY_IRQ       IRQ_NO_EXTI1        // PA1 - Emergency stop
#define EMERGENCY_PRIORITY  NVIC_IRQ_PRI0       // Highest priority

#define SENSOR_IRQ          IRQ_NO_EXTI9_5      // PB8 - Motion sensor
#define SENSOR_PRIORITY     NVIC_IRQ_PRI10      // Low priority</code></pre>
                    </div>
                </div>
            </div>

            <h2>Debugging Checklist</h2>
            <div class="info-box note">
                <div class="info-box-title">🐛 Interrupt Not Working?</div>
                <p>Check these in order:</p>
                <ol>
                    <li>✓ GPIO clock enabled?</li>
                    <li>✓ SYSCFG clock enabled?</li>
                    <li>✓ GPIO_Init() called with interrupt mode?</li>
                    <li>✓ Correct trigger edge (rising/falling)?</li>
                    <li>✓ Pull-up/pull-down configured correctly?</li>
                    <li>✓ NVIC interrupt enabled?</li>
                    <li>✓ ISR name matches vector table exactly?</li>
                    <li>✓ PR bit cleared in ISR?</li>
                    <li>✓ For shared IRQ, checking PR bit first?</li>
                    <li>✓ No typos in pin numbers or IRQ numbers?</li>
                </ol>
            </div>

            <h2>Quick Reference Summary</h2>
            <table class="lesson-table">
                <tr>
                    <th>Component</th>
                    <th>Key Points</th>
                </tr>
                <tr>
                    <td><strong>EXTI Lines</strong></td>
                    <td>Pin 0→EXTI0, Pin 1→EXTI1, ..., Pin 15→EXTI15</td>
                </tr>
                <tr>
                    <td><strong>IRQ Numbers</strong></td>
                    <td>EXTI0-4: Dedicated, EXTI5-9: IRQ23, EXTI10-15: IRQ40</td>
                </tr>
                <tr>
                    <td><strong>Priority</strong></td>
                    <td>0=Highest, 15=Lowest, Default=0</td>
                </tr>
                <tr>
                    <td><strong>Trigger</strong></td>
                    <td>IT_FT=Falling, IT_RT=Rising, IT_RFT=Both</td>
                </tr>
                <tr>
                    <td><strong>Critical Step</strong></td>
                    <td>ALWAYS clear PR bit in ISR!</td>
                </tr>
            </table>

            <div class="info-box note">
                <div class="info-box-title">🎉 Congratulations!</div>
                <p>You've completed the GPIO Interrupt Configuration tutorial! You now understand:</p>
                <ul>
                    <li>The complete interrupt chain (GPIO → SYSCFG → EXTI → NVIC)</li>
                    <li>How to configure all hardware components</li>
                    <li>How to implement robust ISR handlers</li>
                    <li>Common pitfalls and best practices</li>
                </ul>
                <p style="margin-top: 15px;">Go forth and build responsive, efficient embedded systems! 🚀</p>
            </div>
        `
    }
];
