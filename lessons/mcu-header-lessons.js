/**
 * MCU Header File Lessons - stm32f446xx.h
 * This is the FOUNDATION of all driver development
 */

window.mcuHeaderLessons = [
    {
        title: "Introduction: What is the MCU Header File?",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">📋</div>
                <p>The MCU header file (<code>stm32f446xx.h</code>) is the <strong>foundation</strong> of all driver development. Before writing any driver, you must first create this file!</p>
            </div>

            <h2>🎯 What Will You Learn?</h2>
            <p>In this tutorial, you'll learn how to create the MCU-specific header file from scratch:</p>
            <ul>
                <li>Memory base addresses (Flash, SRAM, ROM)</li>
                <li>Peripheral base addresses (GPIO, SPI, I2C, USART, etc.)</li>
                <li>Register definition structures for each peripheral</li>
                <li>Peripheral pointer definitions</li>
                <li>Clock enable/disable macros</li>
                <li>Peripheral reset macros</li>
                <li>Bit position definitions</li>
            </ul>

            <div class="info-box">
                <h4>📌 Why is this file so important?</h4>
                <p>Without this header file, you cannot:</p>
                <ul>
                    <li>Access any peripheral registers</li>
                    <li>Enable/disable peripheral clocks</li>
                    <li>Configure GPIO, SPI, I2C, or USART</li>
                    <li>Handle interrupts</li>
                </ul>
                <p><strong>Every single driver depends on this file!</strong></p>
            </div>

            <h2>📚 What You'll Need</h2>
            <ul>
                <li><strong>Reference Manual (RM0390)</strong> - Contains all register addresses and bit definitions</li>
                <li><strong>Datasheet</strong> - Contains memory map and pin configurations</li>
                <li><strong>Understanding of C programming</strong> - Structs, macros, pointers</li>
            </ul>

            <div class="warning-box">
                <h4>⚠️ Important</h4>
                <p>All addresses and values in this tutorial are specific to <strong>STM32F446RE</strong>. If you're using a different MCU, consult your reference manual!</p>
            </div>
        `
    },
    {
        title: "File Structure & Header Guards",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">📁</div>
                <p>Let's start by creating the basic file structure with proper header guards and includes.</p>
            </div>

            <h2>Step 1: Create the File</h2>
            <p>Create a new file called <code>stm32f446xx.h</code> in your <code>drivers/inc</code> folder.</p>

            <h2>Step 2: Add Header Guards</h2>
            <p>Header guards prevent multiple inclusions of the same file:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * stm32f446xx.h
 *
 * Device header file for STM32F446xx MCU
 * Reference Manual: RM0390
 */</span>

<span class="preprocessor">#ifndef</span> INC_STM32F446XX_H_
<span class="preprocessor">#define</span> INC_STM32F446XX_H_

<span class="preprocessor">#include</span> &lt;stddef.h&gt;
<span class="preprocessor">#include</span> &lt;stdint.h&gt;

<span class="comment">// All your definitions will go here...</span>

<span class="preprocessor">#endif</span> <span class="comment">/* INC_STM32F446XX_H_ */</span></code></pre>
                </div>
            </div>

            <h2>Step 3: Add Useful Shorthand Macros</h2>
            <p>These macros make the code cleaner and more readable:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#define</span> __vo <span class="keyword">volatile</span>
<span class="preprocessor">#define</span> __weak __attribute__((weak))</code></pre>
                </div>
            </div>

            <div class="info-box">
                <h4>💡 Why <code>volatile</code>?</h4>
                <p>The <code>volatile</code> keyword tells the compiler that a variable's value may change at any time without any action being taken by the code. This is crucial for:</p>
                <ul>
                    <li>Hardware registers that can be modified by hardware</li>
                    <li>Memory-mapped I/O</li>
                    <li>Preventing compiler optimizations that might skip reading the register</li>
                </ul>
            </div>
        `
    },
    {
        title: "Processor-Specific Details (NVIC)",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🧠</div>
                <p>The ARM Cortex-M4 processor has built-in NVIC (Nested Vectored Interrupt Controller) registers. Let's define their addresses.</p>
            </div>

            <h2>NVIC Register Addresses</h2>
            <p>These addresses are the same for all ARM Cortex-M4 processors (not MCU-specific):</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * Processor Specific Details
 **********************************/</span>

<span class="comment">/*
 * ARM Cortex Mx Processor NVIC ISERx register Addresses
 * ISER = Interrupt Set-Enable Registers
 */</span>
<span class="preprocessor">#define</span> NVIC_ISER0          ( (__vo uint32_t*)0xE000E100 )
<span class="preprocessor">#define</span> NVIC_ISER1          ( (__vo uint32_t*)0xE000E104 )
<span class="preprocessor">#define</span> NVIC_ISER2          ( (__vo uint32_t*)0xE000E108 )
<span class="preprocessor">#define</span> NVIC_ISER3          ( (__vo uint32_t*)0xE000E10C )

<span class="comment">/*
 * ARM Cortex Mx Processor NVIC ICERx register Addresses
 * ICER = Interrupt Clear-Enable Registers
 */</span>
<span class="preprocessor">#define</span> NVIC_ICER0          ((__vo uint32_t*)0xE000E180)
<span class="preprocessor">#define</span> NVIC_ICER1          ((__vo uint32_t*)0xE000E184)
<span class="preprocessor">#define</span> NVIC_ICER2          ((__vo uint32_t*)0xE000E188)
<span class="preprocessor">#define</span> NVIC_ICER3          ((__vo uint32_t*)0xE000E18C)

<span class="comment">/*
 * ARM Cortex Mx Processor Priority Register Address
 */</span>
<span class="preprocessor">#define</span> NVIC_PR_BASE_ADDR   ((__vo uint32_t*)0xE000E400)

<span class="comment">/*
 * Number of priority bits implemented in Priority Register
 * STM32F446xx implements 4 bits (16 priority levels)
 */</span>
<span class="preprocessor">#define</span> NO_PR_BITS_IMPLEMENTED  4</code></pre>
                </div>
            </div>

            <table class="lesson-table">
                <tr>
                    <th>Register</th>
                    <th>Address</th>
                    <th>Purpose</th>
                </tr>
                <tr>
                    <td><code>ISER0-3</code></td>
                    <td>0xE000E100-0xE000E10C</td>
                    <td>Enable interrupts (write 1 to enable)</td>
                </tr>
                <tr>
                    <td><code>ICER0-3</code></td>
                    <td>0xE000E180-0xE000E18C</td>
                    <td>Disable interrupts (write 1 to disable)</td>
                </tr>
                <tr>
                    <td><code>IPR</code></td>
                    <td>0xE000E400+</td>
                    <td>Set interrupt priority</td>
                </tr>
            </table>
        `
    },
    {
        title: "Memory Base Addresses",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">💾</div>
                <p>Every MCU has different memory regions. Let's define the base addresses for Flash, SRAM, and System ROM.</p>
            </div>

            <h2>Finding Memory Addresses</h2>
            <p>Open your <strong>Reference Manual (RM0390)</strong> and look for the <strong>Memory Map</strong> section.</p>

            <h2>STM32F446RE Memory Layout</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * Memory Base Addresses
 **********************************/</span>

<span class="comment">/*
 * Base addresses of Flash and SRAM memories
 * STM32F446RE Specifications:
 * - Flash: Up to 512KB
 * - SRAM1: 112KB (0x1C000 bytes)
 * - SRAM2: 16KB (0x4000 bytes)
 */</span>

<span class="preprocessor">#define</span> FLASH_BASEADDR      0x08000000U  <span class="comment">/*!&lt; Flash memory base */</span>
<span class="preprocessor">#define</span> SRAM1_BASEADDR      0x20000000U  <span class="comment">/*!&lt; SRAM1 base (112KB) */</span>
<span class="preprocessor">#define</span> SRAM2_BASEADDR      0x2001C000U  <span class="comment">/*!&lt; SRAM2 base (16KB) */</span>
<span class="preprocessor">#define</span> ROM_BASEADDR        0x1FFF0000U  <span class="comment">/*!&lt; System memory (ROM) */</span>
<span class="preprocessor">#define</span> SRAM                SRAM1_BASEADDR</code></pre>
                </div>
            </div>

            <table class="lesson-table">
                <tr>
                    <th>Memory Region</th>
                    <th>Start Address</th>
                    <th>Size</th>
                    <th>Purpose</th>
                </tr>
                <tr>
                    <td>Flash</td>
                    <td>0x08000000</td>
                    <td>512 KB</td>
                    <td>Program code storage</td>
                </tr>
                <tr>
                    <td>SRAM1</td>
                    <td>0x20000000</td>
                    <td>112 KB</td>
                    <td>Main RAM</td>
                </tr>
                <tr>
                    <td>SRAM2</td>
                    <td>0x2001C000</td>
                    <td>16 KB</td>
                    <td>Additional RAM</td>
                </tr>
                <tr>
                    <td>System ROM</td>
                    <td>0x1FFF0000</td>
                    <td>30 KB</td>
                    <td>Bootloader</td>
                </tr>
            </table>

            <div class="info-box">
                <h4>💡 The 'U' Suffix</h4>
                <p>The <code>U</code> suffix makes the constant an <strong>unsigned integer</strong>. This prevents potential issues with signed/unsigned comparisons and arithmetic.</p>
            </div>
        `
    },
    {
        title: "Bus Domain Base Addresses",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🚌</div>
                <p>STM32 peripherals are connected to different buses: AHB1, AHB2, AHB3, APB1, and APB2. Each bus has its own base address.</p>
            </div>

            <h2>Understanding the Bus Architecture</h2>
            <div class="diagram">
                <pre>
┌─────────────────────────────────────────────────┐
│                 ARM Cortex-M4                   │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │       AHB Bus Matrix    │
        └─┬─────┬─────┬─────┬─────┘
          │     │     │     │
       ┌──┴──┐ ┌┴──┐ ┌┴──┐ ┌┴──┐
       │AHB1 │ │AHB2│ │AHB3│ │APB│
       │GPIO │ │USB │ │FMC │ │   │
       │RCC  │ │DCMI│ │QSPI│ │   │
       │DMA  │ └───┘ └───┘ ├───┴───┐
       └─────┘            ┌┴──┐ ┌──┴─┐
                          │APB1│ │APB2│
                          │SPI2│ │SPI1│
                          │I2C │ │USART1│
                          │TIM │ │ADC │
                          └───┘ └────┘
                </pre>
            </div>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * Bus Domain Base Addresses
 **********************************/</span>

<span class="preprocessor">#define</span> PERIPH_BASEADDR         0x40000000U
<span class="preprocessor">#define</span> APB1PERIPH_BASEADDR     PERIPH_BASEADDR
<span class="preprocessor">#define</span> APB2PERIPH_BASEADDR     0x40010000U
<span class="preprocessor">#define</span> AHB1PERIPH_BASEADDR     0x40020000U
<span class="preprocessor">#define</span> AHB2PERIPH_BASEADDR     0x50000000U
<span class="preprocessor">#define</span> AHB3PERIPH_BASEADDR     0xA0000000U</code></pre>
                </div>
            </div>

            <table class="lesson-table">
                <tr>
                    <th>Bus</th>
                    <th>Base Address</th>
                    <th>Key Peripherals</th>
                    <th>Speed</th>
                </tr>
                <tr>
                    <td>APB1</td>
                    <td>0x40000000</td>
                    <td>TIM2-7, SPI2/3, I2C1-3, USART2-5</td>
                    <td>Up to 45 MHz</td>
                </tr>
                <tr>
                    <td>APB2</td>
                    <td>0x40010000</td>
                    <td>TIM1/8, SPI1/4, USART1/6, ADC, SYSCFG</td>
                    <td>Up to 90 MHz</td>
                </tr>
                <tr>
                    <td>AHB1</td>
                    <td>0x40020000</td>
                    <td>GPIO, RCC, DMA, CRC</td>
                    <td>Up to 180 MHz</td>
                </tr>
                <tr>
                    <td>AHB2</td>
                    <td>0x50000000</td>
                    <td>USB OTG FS, DCMI</td>
                    <td>Up to 180 MHz</td>
                </tr>
            </table>
        `
    },
    {
        title: "Peripheral Base Addresses (Part 1: AHB1)",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">📍</div>
                <p>Now let's define the exact base address for each peripheral. We start with AHB1 peripherals.</p>
            </div>

            <h2>Calculating Peripheral Addresses</h2>
            <p>Each peripheral's address = <strong>Bus Base Address + Offset</strong></p>
            <p>Find the offsets in the Reference Manual's "Register boundary addresses" section.</p>

            <h2>AHB1 Peripherals (GPIO, RCC, DMA)</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * AHB1 Peripheral Base Addresses
 **********************************/</span>

<span class="comment">/*
 * GPIO Ports A to H
 * Note: STM32F446xx has GPIO A-H only (no GPIOI)
 */</span>
<span class="preprocessor">#define</span> GPIOA_BASEADDR      (AHB1PERIPH_BASEADDR + 0x0000)
<span class="preprocessor">#define</span> GPIOB_BASEADDR      (AHB1PERIPH_BASEADDR + 0x0400)
<span class="preprocessor">#define</span> GPIOC_BASEADDR      (AHB1PERIPH_BASEADDR + 0x0800)
<span class="preprocessor">#define</span> GPIOD_BASEADDR      (AHB1PERIPH_BASEADDR + 0x0C00)
<span class="preprocessor">#define</span> GPIOE_BASEADDR      (AHB1PERIPH_BASEADDR + 0x1000)
<span class="preprocessor">#define</span> GPIOF_BASEADDR      (AHB1PERIPH_BASEADDR + 0x1400)
<span class="preprocessor">#define</span> GPIOG_BASEADDR      (AHB1PERIPH_BASEADDR + 0x1800)
<span class="preprocessor">#define</span> GPIOH_BASEADDR      (AHB1PERIPH_BASEADDR + 0x1C00)

<span class="comment">/* Other AHB1 Peripherals */</span>
<span class="preprocessor">#define</span> CRC_BASEADDR        (AHB1PERIPH_BASEADDR + 0x3000)
<span class="preprocessor">#define</span> RCC_BASEADDR        (AHB1PERIPH_BASEADDR + 0x3800)
<span class="preprocessor">#define</span> FLASH_IF_BASEADDR   (AHB1PERIPH_BASEADDR + 0x3C00)
<span class="preprocessor">#define</span> DMA1_BASEADDR       (AHB1PERIPH_BASEADDR + 0x6000)
<span class="preprocessor">#define</span> DMA2_BASEADDR       (AHB1PERIPH_BASEADDR + 0x6400)</code></pre>
                </div>
            </div>

            <div class="info-box">
                <h4>💡 Understanding the Offsets</h4>
                <p>Notice how GPIO ports are spaced 0x400 (1024 bytes) apart:</p>
                <ul>
                    <li>GPIOA: 0x0000</li>
                    <li>GPIOB: 0x0400 = GPIOA + 0x400</li>
                    <li>GPIOC: 0x0800 = GPIOA + 0x800</li>
                </ul>
                <p>This consistent spacing helps you easily calculate any GPIO port address!</p>
            </div>
        `
    },
    {
        title: "Peripheral Base Addresses (Part 2: APB1 & APB2)",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">📍</div>
                <p>Let's continue with APB1 and APB2 peripherals - these include SPI, I2C, USART, and more.</p>
            </div>

            <h2>APB1 Peripherals</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * APB1 Peripheral Base Addresses
 **********************************/</span>

<span class="comment">/* Timers */</span>
<span class="preprocessor">#define</span> TIM2_BASEADDR       (APB1PERIPH_BASEADDR + 0x0000)
<span class="preprocessor">#define</span> TIM3_BASEADDR       (APB1PERIPH_BASEADDR + 0x0400)
<span class="preprocessor">#define</span> TIM4_BASEADDR       (APB1PERIPH_BASEADDR + 0x0800)
<span class="preprocessor">#define</span> TIM5_BASEADDR       (APB1PERIPH_BASEADDR + 0x0C00)

<span class="comment">/* SPI */</span>
<span class="preprocessor">#define</span> SPI2_BASEADDR       (APB1PERIPH_BASEADDR + 0x3800)
<span class="preprocessor">#define</span> SPI3_BASEADDR       (APB1PERIPH_BASEADDR + 0x3C00)

<span class="comment">/* USART */</span>
<span class="preprocessor">#define</span> USART2_BASEADDR     (APB1PERIPH_BASEADDR + 0x4400)
<span class="preprocessor">#define</span> USART3_BASEADDR     (APB1PERIPH_BASEADDR + 0x4800)
<span class="preprocessor">#define</span> UART4_BASEADDR      (APB1PERIPH_BASEADDR + 0x4C00)
<span class="preprocessor">#define</span> UART5_BASEADDR      (APB1PERIPH_BASEADDR + 0x5000)

<span class="comment">/* I2C */</span>
<span class="preprocessor">#define</span> I2C1_BASEADDR       (APB1PERIPH_BASEADDR + 0x5400)
<span class="preprocessor">#define</span> I2C2_BASEADDR       (APB1PERIPH_BASEADDR + 0x5800)
<span class="preprocessor">#define</span> I2C3_BASEADDR       (APB1PERIPH_BASEADDR + 0x5C00)</code></pre>
                </div>
            </div>

            <h2>APB2 Peripherals</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * APB2 Peripheral Base Addresses
 **********************************/</span>

<span class="comment">/* Timers */</span>
<span class="preprocessor">#define</span> TIM1_BASEADDR       (APB2PERIPH_BASEADDR + 0x0000)
<span class="preprocessor">#define</span> TIM8_BASEADDR       (APB2PERIPH_BASEADDR + 0x0400)

<span class="comment">/* USART */</span>
<span class="preprocessor">#define</span> USART1_BASEADDR     (APB2PERIPH_BASEADDR + 0x1000)
<span class="preprocessor">#define</span> USART6_BASEADDR     (APB2PERIPH_BASEADDR + 0x1400)

<span class="comment">/* SPI */</span>
<span class="preprocessor">#define</span> SPI1_BASEADDR       (APB2PERIPH_BASEADDR + 0x3000)
<span class="preprocessor">#define</span> SPI4_BASEADDR       (APB2PERIPH_BASEADDR + 0x3400)

<span class="comment">/* System Configuration */</span>
<span class="preprocessor">#define</span> SYSCFG_BASEADDR     (APB2PERIPH_BASEADDR + 0x3800)
<span class="preprocessor">#define</span> EXTI_BASEADDR       (APB2PERIPH_BASEADDR + 0x3C00)</code></pre>
                </div>
            </div>
        `
    },
    {
        title: "Register Definition Structures (GPIO)",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🏗️</div>
                <p>Now comes the most important part - creating <strong>C structures</strong> that map to the peripheral registers!</p>
            </div>

            <h2>Why Use Structures?</h2>
            <p>Instead of accessing each register by its individual address, we create a structure where each member represents a register. This makes the code:</p>
            <ul>
                <li>More readable: <code>GPIOA->ODR</code> vs <code>*(0x40020014)</code></li>
                <li>Type-safe: Compiler catches errors</li>
                <li>Easier to maintain</li>
            </ul>

            <h2>GPIO Register Structure</h2>
            <p>Look at the GPIO registers in the reference manual (Section 8.4):</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * Peripheral register definition structure for GPIO
 */</span>
<span class="keyword">typedef struct</span>
{
    __vo uint32_t MODER;    <span class="comment">/*!&lt; Mode register,              Offset: 0x00 */</span>
    __vo uint32_t OTYPER;   <span class="comment">/*!&lt; Output type register,       Offset: 0x04 */</span>
    __vo uint32_t OSPEEDR;  <span class="comment">/*!&lt; Output speed register,      Offset: 0x08 */</span>
    __vo uint32_t PUPDR;    <span class="comment">/*!&lt; Pull-up/pull-down register, Offset: 0x0C */</span>
    __vo uint32_t IDR;      <span class="comment">/*!&lt; Input data register,        Offset: 0x10 */</span>
    __vo uint32_t ODR;      <span class="comment">/*!&lt; Output data register,       Offset: 0x14 */</span>
    __vo uint32_t BSRR;     <span class="comment">/*!&lt; Bit set/reset register,     Offset: 0x18 */</span>
    __vo uint32_t LCKR;     <span class="comment">/*!&lt; Configuration lock register,Offset: 0x1C */</span>
    __vo uint32_t AFR[2];   <span class="comment">/*!&lt; Alternate function registers,
                                 AFR[0] = AFRL (Offset: 0x20)
                                 AFR[1] = AFRH (Offset: 0x24) */</span>
} <span class="type">GPIO_RegDef_t</span>;</code></pre>
                </div>
            </div>

            <div class="warning-box">
                <h4>⚠️ Critical Rules for Register Structures</h4>
                <ul>
                    <li><strong>Order matters!</strong> Members must be in the same order as registers in memory</li>
                    <li><strong>All members must be <code>volatile</code></strong> (we use <code>__vo</code>)</li>
                    <li><strong>Size must match!</strong> Use <code>uint32_t</code> for 32-bit registers</li>
                    <li><strong>Reserved bytes</strong> must be accounted for (we'll see this in RCC)</li>
                </ul>
            </div>

            <table class="lesson-table">
                <tr>
                    <th>Register</th>
                    <th>Offset</th>
                    <th>Purpose</th>
                </tr>
                <tr><td>MODER</td><td>0x00</td><td>Input/Output/Alternate/Analog mode</td></tr>
                <tr><td>OTYPER</td><td>0x04</td><td>Push-pull or Open-drain</td></tr>
                <tr><td>OSPEEDR</td><td>0x08</td><td>Low/Medium/High/Very High speed</td></tr>
                <tr><td>PUPDR</td><td>0x0C</td><td>No pull/Pull-up/Pull-down</td></tr>
                <tr><td>IDR</td><td>0x10</td><td>Read input pins (read-only)</td></tr>
                <tr><td>ODR</td><td>0x14</td><td>Set output pins</td></tr>
                <tr><td>BSRR</td><td>0x18</td><td>Atomic set/reset (write-only)</td></tr>
            </table>
        `
    },
    {
        title: "Register Definition Structures (RCC)",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">⏰</div>
                <p>The RCC (Reset and Clock Control) structure is more complex because it has <strong>reserved gaps</strong> between some registers.</p>
            </div>

            <h2>Handling Reserved Registers</h2>
            <p>When there's a gap in the register map, we add <code>RESERVED</code> members to maintain correct offsets:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * Peripheral register definition structure for RCC
 */</span>
<span class="keyword">typedef struct</span>
{
    __vo uint32_t CR;           <span class="comment">/*!&lt; Clock control register,           Offset: 0x00 */</span>
    __vo uint32_t PLLCFGR;      <span class="comment">/*!&lt; PLL configuration register,       Offset: 0x04 */</span>
    __vo uint32_t CFGR;         <span class="comment">/*!&lt; Clock configuration register,     Offset: 0x08 */</span>
    __vo uint32_t CIR;          <span class="comment">/*!&lt; Clock interrupt register,         Offset: 0x0C */</span>
    __vo uint32_t AHB1RSTR;     <span class="comment">/*!&lt; AHB1 peripheral reset register,   Offset: 0x10 */</span>
    __vo uint32_t AHB2RSTR;     <span class="comment">/*!&lt; AHB2 peripheral reset register,   Offset: 0x14 */</span>
    __vo uint32_t AHB3RSTR;     <span class="comment">/*!&lt; AHB3 peripheral reset register,   Offset: 0x18 */</span>
    uint32_t      RESERVED0;    <span class="comment">/*!&lt; Reserved,                         Offset: 0x1C */</span>
    __vo uint32_t APB1RSTR;     <span class="comment">/*!&lt; APB1 peripheral reset register,   Offset: 0x20 */</span>
    __vo uint32_t APB2RSTR;     <span class="comment">/*!&lt; APB2 peripheral reset register,   Offset: 0x24 */</span>
    uint32_t      RESERVED1[2]; <span class="comment">/*!&lt; Reserved,                         Offset: 0x28-0x2C */</span>
    __vo uint32_t AHB1ENR;      <span class="comment">/*!&lt; AHB1 clock enable register,       Offset: 0x30 */</span>
    __vo uint32_t AHB2ENR;      <span class="comment">/*!&lt; AHB2 clock enable register,       Offset: 0x34 */</span>
    __vo uint32_t AHB3ENR;      <span class="comment">/*!&lt; AHB3 clock enable register,       Offset: 0x38 */</span>
    uint32_t      RESERVED2;    <span class="comment">/*!&lt; Reserved,                         Offset: 0x3C */</span>
    __vo uint32_t APB1ENR;      <span class="comment">/*!&lt; APB1 clock enable register,       Offset: 0x40 */</span>
    __vo uint32_t APB2ENR;      <span class="comment">/*!&lt; APB2 clock enable register,       Offset: 0x44 */</span>
    <span class="comment">/* ... more registers ... */</span>
} <span class="type">RCC_RegDef_t</span>;</code></pre>
                </div>
            </div>

            <div class="info-box">
                <h4>💡 Reserved Arrays</h4>
                <p>When multiple consecutive registers are reserved:</p>
                <ul>
                    <li><code>RESERVED1[2]</code> = 2 × 4 bytes = 8 bytes gap</li>
                    <li>This covers offsets 0x28 and 0x2C</li>
                </ul>
            </div>

            <h2>Key RCC Registers for Drivers</h2>
            <table class="lesson-table">
                <tr>
                    <th>Register</th>
                    <th>Offset</th>
                    <th>Purpose</th>
                </tr>
                <tr>
                    <td>AHB1ENR</td>
                    <td>0x30</td>
                    <td>Enable clocks for GPIO, DMA, CRC</td>
                </tr>
                <tr>
                    <td>APB1ENR</td>
                    <td>0x40</td>
                    <td>Enable clocks for I2C, SPI2/3, USART2-5</td>
                </tr>
                <tr>
                    <td>APB2ENR</td>
                    <td>0x44</td>
                    <td>Enable clocks for SPI1/4, USART1/6, SYSCFG</td>
                </tr>
            </table>
        `
    },
    {
        title: "Register Definition Structures (SPI, I2C, USART)",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">📊</div>
                <p>Let's create the register structures for the communication peripherals: SPI, I2C, and USART.</p>
            </div>

            <h2>SPI Register Structure</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="keyword">typedef struct</span>
{
    __vo uint32_t CR1;      <span class="comment">/*!&lt; Control register 1,      Offset: 0x00 */</span>
    __vo uint32_t CR2;      <span class="comment">/*!&lt; Control register 2,      Offset: 0x04 */</span>
    __vo uint32_t SR;       <span class="comment">/*!&lt; Status register,         Offset: 0x08 */</span>
    __vo uint32_t DR;       <span class="comment">/*!&lt; Data register,           Offset: 0x0C */</span>
    __vo uint32_t CRCPR;    <span class="comment">/*!&lt; CRC polynomial register, Offset: 0x10 */</span>
    __vo uint32_t RXCRCR;   <span class="comment">/*!&lt; RX CRC register,         Offset: 0x14 */</span>
    __vo uint32_t TXCRCR;   <span class="comment">/*!&lt; TX CRC register,         Offset: 0x18 */</span>
    __vo uint32_t I2SCFGR;  <span class="comment">/*!&lt; I2S configuration,       Offset: 0x1C */</span>
    __vo uint32_t I2SPR;    <span class="comment">/*!&lt; I2S prescaler,           Offset: 0x20 */</span>
} <span class="type">SPI_RegDef_t</span>;</code></pre>
                </div>
            </div>

            <h2>I2C Register Structure</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="keyword">typedef struct</span>
{
    __vo uint32_t CR1;      <span class="comment">/*!&lt; Control register 1,      Offset: 0x00 */</span>
    __vo uint32_t CR2;      <span class="comment">/*!&lt; Control register 2,      Offset: 0x04 */</span>
    __vo uint32_t OAR1;     <span class="comment">/*!&lt; Own address register 1,  Offset: 0x08 */</span>
    __vo uint32_t OAR2;     <span class="comment">/*!&lt; Own address register 2,  Offset: 0x0C */</span>
    __vo uint32_t DR;       <span class="comment">/*!&lt; Data register,           Offset: 0x10 */</span>
    __vo uint32_t SR1;      <span class="comment">/*!&lt; Status register 1,       Offset: 0x14 */</span>
    __vo uint32_t SR2;      <span class="comment">/*!&lt; Status register 2,       Offset: 0x18 */</span>
    __vo uint32_t CCR;      <span class="comment">/*!&lt; Clock control register,  Offset: 0x1C */</span>
    __vo uint32_t TRISE;    <span class="comment">/*!&lt; TRISE register,          Offset: 0x20 */</span>
    __vo uint32_t FLTR;     <span class="comment">/*!&lt; FLTR register,           Offset: 0x24 */</span>
} <span class="type">I2C_RegDef_t</span>;</code></pre>
                </div>
            </div>

            <h2>USART Register Structure</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="keyword">typedef struct</span>
{
    __vo uint32_t SR;       <span class="comment">/*!&lt; Status register,             Offset: 0x00 */</span>
    __vo uint32_t DR;       <span class="comment">/*!&lt; Data register,               Offset: 0x04 */</span>
    __vo uint32_t BRR;      <span class="comment">/*!&lt; Baud rate register,          Offset: 0x08 */</span>
    __vo uint32_t CR1;      <span class="comment">/*!&lt; Control register 1,          Offset: 0x0C */</span>
    __vo uint32_t CR2;      <span class="comment">/*!&lt; Control register 2,          Offset: 0x10 */</span>
    __vo uint32_t CR3;      <span class="comment">/*!&lt; Control register 3,          Offset: 0x14 */</span>
    __vo uint32_t GTPR;     <span class="comment">/*!&lt; Guard time & prescaler reg,  Offset: 0x18 */</span>
} <span class="type">USART_RegDef_t</span>;</code></pre>
                </div>
            </div>
        `
    },
    {
        title: "Peripheral Pointer Definitions",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">👆</div>
                <p>Now we create pointers to each peripheral by casting the base addresses to the structure type.</p>
            </div>

            <h2>The Magic of Peripheral Pointers</h2>
            <p>By typecasting the base address to our structure pointer, we can access registers like structure members:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * Peripheral Definitions
 * (Peripheral base addresses typecasted to xxx_RegDef_t)
 **********************************/</span>

<span class="comment">/* GPIO */</span>
<span class="preprocessor">#define</span> GPIOA   ((<span class="type">GPIO_RegDef_t</span>*)GPIOA_BASEADDR)
<span class="preprocessor">#define</span> GPIOB   ((<span class="type">GPIO_RegDef_t</span>*)GPIOB_BASEADDR)
<span class="preprocessor">#define</span> GPIOC   ((<span class="type">GPIO_RegDef_t</span>*)GPIOC_BASEADDR)
<span class="preprocessor">#define</span> GPIOD   ((<span class="type">GPIO_RegDef_t</span>*)GPIOD_BASEADDR)
<span class="preprocessor">#define</span> GPIOE   ((<span class="type">GPIO_RegDef_t</span>*)GPIOE_BASEADDR)
<span class="preprocessor">#define</span> GPIOF   ((<span class="type">GPIO_RegDef_t</span>*)GPIOF_BASEADDR)
<span class="preprocessor">#define</span> GPIOG   ((<span class="type">GPIO_RegDef_t</span>*)GPIOG_BASEADDR)
<span class="preprocessor">#define</span> GPIOH   ((<span class="type">GPIO_RegDef_t</span>*)GPIOH_BASEADDR)

<span class="comment">/* RCC */</span>
<span class="preprocessor">#define</span> RCC     ((<span class="type">RCC_RegDef_t</span>*)RCC_BASEADDR)

<span class="comment">/* SPI */</span>
<span class="preprocessor">#define</span> SPI1    ((<span class="type">SPI_RegDef_t</span>*)SPI1_BASEADDR)
<span class="preprocessor">#define</span> SPI2    ((<span class="type">SPI_RegDef_t</span>*)SPI2_BASEADDR)
<span class="preprocessor">#define</span> SPI3    ((<span class="type">SPI_RegDef_t</span>*)SPI3_BASEADDR)
<span class="preprocessor">#define</span> SPI4    ((<span class="type">SPI_RegDef_t</span>*)SPI4_BASEADDR)

<span class="comment">/* I2C */</span>
<span class="preprocessor">#define</span> I2C1    ((<span class="type">I2C_RegDef_t</span>*)I2C1_BASEADDR)
<span class="preprocessor">#define</span> I2C2    ((<span class="type">I2C_RegDef_t</span>*)I2C2_BASEADDR)
<span class="preprocessor">#define</span> I2C3    ((<span class="type">I2C_RegDef_t</span>*)I2C3_BASEADDR)

<span class="comment">/* USART */</span>
<span class="preprocessor">#define</span> USART1  ((<span class="type">USART_RegDef_t</span>*)USART1_BASEADDR)
<span class="preprocessor">#define</span> USART2  ((<span class="type">USART_RegDef_t</span>*)USART2_BASEADDR)
<span class="preprocessor">#define</span> USART3  ((<span class="type">USART_RegDef_t</span>*)USART3_BASEADDR)
<span class="preprocessor">#define</span> USART6  ((<span class="type">USART_RegDef_t</span>*)USART6_BASEADDR)</code></pre>
                </div>
            </div>

            <h2>How It Works</h2>
            <p>When you write <code>GPIOA->ODR = 0x20</code>:</p>
            <ol>
                <li><code>GPIOA</code> is a pointer to address 0x40020000</li>
                <li><code>->ODR</code> accesses the ODR member (offset 0x14)</li>
                <li>Actual address accessed: 0x40020000 + 0x14 = 0x40020014</li>
            </ol>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Example Usage</span>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Set pin 5 of GPIOA as output</span>
GPIOA->MODER |= (1 << 10);  <span class="comment">// Access 0x40020000</span>

<span class="comment">// Toggle pin 5</span>
GPIOA->ODR ^= (1 << 5);     <span class="comment">// Access 0x40020014</span>

<span class="comment">// Enable SPI1</span>
SPI1->CR1 |= (1 << 6);      <span class="comment">// Access 0x40013000</span></code></pre>
                </div>
            </div>
        `
    },
    {
        title: "Clock Enable Macros",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">⚡</div>
                <p>Before using any peripheral, you must enable its clock! Let's create convenient macros for this.</p>
            </div>

            <h2>Why Do We Need Clock Enable?</h2>
            <p>To save power, all peripheral clocks are disabled by default. You must enable the clock before:</p>
            <ul>
                <li>Reading or writing any register</li>
                <li>Using the peripheral</li>
            </ul>

            <h2>GPIO Clock Enable Macros</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * Clock Enable Macros for GPIOx
 * GPIOx clocks are on AHB1 bus
 **********************************/</span>

<span class="preprocessor">#define</span> GPIOA_PCLK_EN()    (RCC->AHB1ENR |= (1 << 0))
<span class="preprocessor">#define</span> GPIOB_PCLK_EN()    (RCC->AHB1ENR |= (1 << 1))
<span class="preprocessor">#define</span> GPIOC_PCLK_EN()    (RCC->AHB1ENR |= (1 << 2))
<span class="preprocessor">#define</span> GPIOD_PCLK_EN()    (RCC->AHB1ENR |= (1 << 3))
<span class="preprocessor">#define</span> GPIOE_PCLK_EN()    (RCC->AHB1ENR |= (1 << 4))
<span class="preprocessor">#define</span> GPIOF_PCLK_EN()    (RCC->AHB1ENR |= (1 << 5))
<span class="preprocessor">#define</span> GPIOG_PCLK_EN()    (RCC->AHB1ENR |= (1 << 6))
<span class="preprocessor">#define</span> GPIOH_PCLK_EN()    (RCC->AHB1ENR |= (1 << 7))</code></pre>
                </div>
            </div>

            <h2>SPI, I2C, USART Clock Enable Macros</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/* SPI Clock Enable */</span>
<span class="preprocessor">#define</span> SPI1_PCLK_EN()     (RCC->APB2ENR |= (1 << 12))
<span class="preprocessor">#define</span> SPI2_PCLK_EN()     (RCC->APB1ENR |= (1 << 14))
<span class="preprocessor">#define</span> SPI3_PCLK_EN()     (RCC->APB1ENR |= (1 << 15))
<span class="preprocessor">#define</span> SPI4_PCLK_EN()     (RCC->APB2ENR |= (1 << 13))

<span class="comment">/* I2C Clock Enable */</span>
<span class="preprocessor">#define</span> I2C1_PCLK_EN()     (RCC->APB1ENR |= (1 << 21))
<span class="preprocessor">#define</span> I2C2_PCLK_EN()     (RCC->APB1ENR |= (1 << 22))
<span class="preprocessor">#define</span> I2C3_PCLK_EN()     (RCC->APB1ENR |= (1 << 23))

<span class="comment">/* USART Clock Enable */</span>
<span class="preprocessor">#define</span> USART1_PCLK_EN()   (RCC->APB2ENR |= (1 << 4))
<span class="preprocessor">#define</span> USART2_PCLK_EN()   (RCC->APB1ENR |= (1 << 17))
<span class="preprocessor">#define</span> USART3_PCLK_EN()   (RCC->APB1ENR |= (1 << 18))
<span class="preprocessor">#define</span> USART6_PCLK_EN()   (RCC->APB2ENR |= (1 << 5))</code></pre>
                </div>
            </div>

            <div class="info-box">
                <h4>💡 Finding the Bit Positions</h4>
                <p>Look in the Reference Manual at the RCC register descriptions:</p>
                <ul>
                    <li>RCC_AHB1ENR for GPIO, DMA, CRC</li>
                    <li>RCC_APB1ENR for I2C, SPI2/3, USART2-5</li>
                    <li>RCC_APB2ENR for SPI1/4, USART1/6, SYSCFG</li>
                </ul>
            </div>
        `
    },
    {
        title: "Clock Disable & Reset Macros",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🔌</div>
                <p>Let's complete the clock control with disable macros and peripheral reset macros.</p>
            </div>

            <h2>Clock Disable Macros</h2>
            <p>To disable a clock, we clear the corresponding bit using AND with NOT:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * Clock Disable Macros
 **********************************/</span>

<span class="comment">/* GPIO Clock Disable */</span>
<span class="preprocessor">#define</span> GPIOA_PCLK_DI()    (RCC->AHB1ENR &= ~(1 << 0))
<span class="preprocessor">#define</span> GPIOB_PCLK_DI()    (RCC->AHB1ENR &= ~(1 << 1))
<span class="preprocessor">#define</span> GPIOC_PCLK_DI()    (RCC->AHB1ENR &= ~(1 << 2))
<span class="comment">/* ... etc ... */</span>

<span class="comment">/* SPI Clock Disable */</span>
<span class="preprocessor">#define</span> SPI1_PCLK_DI()     (RCC->APB2ENR &= ~(1 << 12))
<span class="preprocessor">#define</span> SPI2_PCLK_DI()     (RCC->APB1ENR &= ~(1 << 14))</code></pre>
                </div>
            </div>

            <h2>Peripheral Reset Macros</h2>
            <p>Sometimes you need to reset a peripheral to its default state. The pattern is: Set the reset bit, then clear it.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * Peripheral Reset Macros
 **********************************/</span>

<span class="comment">/* GPIO Reset - using do-while(0) for safe macro usage */</span>
<span class="preprocessor">#define</span> GPIOA_REG_RESET()  <span class="keyword">do</span>{ \\
    (RCC->AHB1RSTR |= (1 << 0)); \\
    (RCC->AHB1RSTR &= ~(1 << 0)); \\
}<span class="keyword">while</span>(0)

<span class="preprocessor">#define</span> GPIOB_REG_RESET()  <span class="keyword">do</span>{ \\
    (RCC->AHB1RSTR |= (1 << 1)); \\
    (RCC->AHB1RSTR &= ~(1 << 1)); \\
}<span class="keyword">while</span>(0)

<span class="comment">/* SPI Reset */</span>
<span class="preprocessor">#define</span> SPI1_REG_RESET()   <span class="keyword">do</span>{ \\
    (RCC->APB2RSTR |= (1 << 12)); \\
    (RCC->APB2RSTR &= ~(1 << 12)); \\
}<span class="keyword">while</span>(0)</code></pre>
                </div>
            </div>

            <div class="info-box">
                <h4>💡 Why <code>do-while(0)</code>?</h4>
                <p>This is a C idiom for creating multi-statement macros that work safely in all contexts:</p>
                <pre><code>if(condition)
    GPIOA_REG_RESET();  // Works correctly!
else
    // something else</code></pre>
                <p>Without <code>do-while(0)</code>, the second statement would be outside the <code>if</code>.</p>
            </div>
        `
    },
    {
        title: "Bit Position Definitions",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🔢</div>
                <p>Instead of using magic numbers like <code>(1 << 6)</code>, we define named constants for each bit position.</p>
            </div>

            <h2>Why Define Bit Positions?</h2>
            <p>Compare these two approaches:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Without bit definitions (BAD)</span>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// What does bit 6 mean? Hard to remember!</span>
SPI1->CR1 |= (1 << 6);
SPI1->CR1 |= (1 << 2);</code></pre>
                </div>
            </div>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">With bit definitions (GOOD)</span>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">// Self-documenting code!</span>
SPI1->CR1 |= (1 << SPI_CR1_SPE);   <span class="comment">// Enable SPI</span>
SPI1->CR1 |= (1 << SPI_CR1_MSTR);  <span class="comment">// Master mode</span></code></pre>
                </div>
            </div>

            <h2>SPI Bit Position Definitions</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * Bit Position Definitions - SPI_CR1
 **********************************/</span>

<span class="preprocessor">#define</span> SPI_CR1_CPHA        0   <span class="comment">// Clock Phase</span>
<span class="preprocessor">#define</span> SPI_CR1_CPOL        1   <span class="comment">// Clock Polarity</span>
<span class="preprocessor">#define</span> SPI_CR1_MSTR        2   <span class="comment">// Master Selection</span>
<span class="preprocessor">#define</span> SPI_CR1_BR          3   <span class="comment">// Baud Rate Control (3 bits)</span>
<span class="preprocessor">#define</span> SPI_CR1_SPE         6   <span class="comment">// SPI Enable</span>
<span class="preprocessor">#define</span> SPI_CR1_LSBFIRST    7   <span class="comment">// LSB First</span>
<span class="preprocessor">#define</span> SPI_CR1_SSI         8   <span class="comment">// Internal Slave Select</span>
<span class="preprocessor">#define</span> SPI_CR1_SSM         9   <span class="comment">// Software Slave Management</span>
<span class="preprocessor">#define</span> SPI_CR1_RXONLY      10  <span class="comment">// Receive Only</span>
<span class="preprocessor">#define</span> SPI_CR1_DFF         11  <span class="comment">// Data Frame Format</span>
<span class="preprocessor">#define</span> SPI_CR1_BIDIOE      14  <span class="comment">// Bidirectional Output Enable</span>
<span class="preprocessor">#define</span> SPI_CR1_BIDIMODE    15  <span class="comment">// Bidirectional Mode</span>

<span class="comment">/**********************************
 * Bit Position Definitions - SPI_SR
 **********************************/</span>

<span class="preprocessor">#define</span> SPI_SR_RXNE         0   <span class="comment">// RX Not Empty</span>
<span class="preprocessor">#define</span> SPI_SR_TXE          1   <span class="comment">// TX Empty</span>
<span class="preprocessor">#define</span> SPI_SR_CHSIDE       2   <span class="comment">// Channel Side</span>
<span class="preprocessor">#define</span> SPI_SR_UDR          3   <span class="comment">// Underrun</span>
<span class="preprocessor">#define</span> SPI_SR_CRCERR       4   <span class="comment">// CRC Error</span>
<span class="preprocessor">#define</span> SPI_SR_MODF         5   <span class="comment">// Mode Fault</span>
<span class="preprocessor">#define</span> SPI_SR_OVR          6   <span class="comment">// Overrun</span>
<span class="preprocessor">#define</span> SPI_SR_BSY          7   <span class="comment">// Busy</span></code></pre>
                </div>
            </div>

            <div class="warning-box">
                <h4>⚠️ Consistency is Key</h4>
                <p>Always use the same naming convention:</p>
                <ul>
                    <li><code>PERIPHERAL_REGISTER_BITNAME</code></li>
                    <li>Example: <code>SPI_CR1_SPE</code>, <code>I2C_CR1_PE</code>, <code>USART_CR1_TE</code></li>
                </ul>
            </div>
        `
    },
    {
        title: "IRQ Numbers & Generic Macros",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🚨</div>
                <p>Let's define IRQ (Interrupt Request) numbers and some generic utility macros.</p>
            </div>

            <h2>IRQ Numbers</h2>
            <p>Each interrupt source has a unique number. Find these in the <strong>Vector Table</strong> section of the Reference Manual:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * IRQ Numbers for STM32F446xx
 **********************************/</span>

<span class="comment">/* External Interrupts */</span>
<span class="preprocessor">#define</span> IRQ_NO_EXTI0        6
<span class="preprocessor">#define</span> IRQ_NO_EXTI1        7
<span class="preprocessor">#define</span> IRQ_NO_EXTI2        8
<span class="preprocessor">#define</span> IRQ_NO_EXTI3        9
<span class="preprocessor">#define</span> IRQ_NO_EXTI4        10
<span class="preprocessor">#define</span> IRQ_NO_EXTI9_5      23
<span class="preprocessor">#define</span> IRQ_NO_EXTI15_10    40

<span class="comment">/* SPI Interrupts */</span>
<span class="preprocessor">#define</span> IRQ_NO_SPI1         35
<span class="preprocessor">#define</span> IRQ_NO_SPI2         36
<span class="preprocessor">#define</span> IRQ_NO_SPI3         51
<span class="preprocessor">#define</span> IRQ_NO_SPI4         84

<span class="comment">/* I2C Interrupts */</span>
<span class="preprocessor">#define</span> IRQ_NO_I2C1_EV      31
<span class="preprocessor">#define</span> IRQ_NO_I2C1_ER      32
<span class="preprocessor">#define</span> IRQ_NO_I2C2_EV      33
<span class="preprocessor">#define</span> IRQ_NO_I2C2_ER      34

<span class="comment">/* USART Interrupts */</span>
<span class="preprocessor">#define</span> IRQ_NO_USART1       37
<span class="preprocessor">#define</span> IRQ_NO_USART2       38
<span class="preprocessor">#define</span> IRQ_NO_USART3       39
<span class="preprocessor">#define</span> IRQ_NO_USART6       71</code></pre>
                </div>
            </div>

            <h2>Generic Utility Macros</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/**********************************
 * Generic Macros
 **********************************/</span>

<span class="preprocessor">#define</span> ENABLE              1
<span class="preprocessor">#define</span> DISABLE             0
<span class="preprocessor">#define</span> SET                 ENABLE
<span class="preprocessor">#define</span> RESET               DISABLE
<span class="preprocessor">#define</span> GPIO_PIN_SET        SET
<span class="preprocessor">#define</span> GPIO_PIN_RESET      RESET
<span class="preprocessor">#define</span> FLAG_SET            SET
<span class="preprocessor">#define</span> FLAG_RESET          RESET

<span class="comment">/**********************************
 * NVIC Priority Macros
 **********************************/</span>

<span class="preprocessor">#define</span> NVIC_IRQ_PRI0       0
<span class="preprocessor">#define</span> NVIC_IRQ_PRI1       1
<span class="preprocessor">#define</span> NVIC_IRQ_PRI2       2
<span class="comment">/* ... up to ... */</span>
<span class="preprocessor">#define</span> NVIC_IRQ_PRI15      15</code></pre>
                </div>
            </div>
        `
    },
    {
        title: "Complete File Structure & Summary",
        content: `
            <div class="lesson-intro">
                <div class="intro-icon">🎯</div>
                <p>Congratulations! You've learned how to create a complete MCU header file. Let's review the structure.</p>
            </div>

            <h2>Complete File Organization</h2>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx.h - Complete Structure</span>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * stm32f446xx.h
 * Device header file for STM32F446xx MCU
 */</span>

<span class="preprocessor">#ifndef</span> INC_STM32F446XX_H_
<span class="preprocessor">#define</span> INC_STM32F446XX_H_

<span class="preprocessor">#include</span> &lt;stdint.h&gt;

<span class="comment">/* 1. Shorthand macros */</span>
<span class="preprocessor">#define</span> __vo volatile

<span class="comment">/* 2. Processor-specific details (NVIC) */</span>
<span class="comment">/* ... NVIC addresses ... */</span>

<span class="comment">/* 3. Memory base addresses */</span>
<span class="comment">/* ... FLASH, SRAM, ROM ... */</span>

<span class="comment">/* 4. Bus domain base addresses */</span>
<span class="comment">/* ... AHB1, AHB2, APB1, APB2 ... */</span>

<span class="comment">/* 5. Peripheral base addresses */</span>
<span class="comment">/* ... GPIO, SPI, I2C, USART ... */</span>

<span class="comment">/* 6. Register definition structures */</span>
<span class="comment">/* ... GPIO_RegDef_t, RCC_RegDef_t, etc. ... */</span>

<span class="comment">/* 7. Peripheral pointer definitions */</span>
<span class="comment">/* ... GPIOA, GPIOB, SPI1, I2C1, etc. ... */</span>

<span class="comment">/* 8. Clock enable/disable macros */</span>
<span class="comment">/* ... GPIOx_PCLK_EN(), SPIx_PCLK_EN(), etc. ... */</span>

<span class="comment">/* 9. Peripheral reset macros */</span>
<span class="comment">/* ... GPIOx_REG_RESET(), SPIx_REG_RESET(), etc. ... */</span>

<span class="comment">/* 10. Bit position definitions */</span>
<span class="comment">/* ... SPI_CR1_SPE, I2C_CR1_PE, etc. ... */</span>

<span class="comment">/* 11. IRQ numbers */</span>
<span class="comment">/* ... IRQ_NO_EXTI0, IRQ_NO_SPI1, etc. ... */</span>

<span class="comment">/* 12. Generic macros */</span>
<span class="comment">/* ... ENABLE, DISABLE, SET, RESET ... */</span>

<span class="preprocessor">#endif</span></code></pre>
                </div>
            </div>

            <h2>🎉 What You've Accomplished</h2>

            <table class="lesson-table">
                <tr>
                    <th>Section</th>
                    <th>Purpose</th>
                    <th>Example</th>
                </tr>
                <tr>
                    <td>Memory Addresses</td>
                    <td>Define where code/data lives</td>
                    <td><code>FLASH_BASEADDR</code></td>
                </tr>
                <tr>
                    <td>Peripheral Addresses</td>
                    <td>Locate each peripheral</td>
                    <td><code>GPIOA_BASEADDR</code></td>
                </tr>
                <tr>
                    <td>Register Structures</td>
                    <td>Map registers to C structs</td>
                    <td><code>GPIO_RegDef_t</code></td>
                </tr>
                <tr>
                    <td>Peripheral Pointers</td>
                    <td>Easy register access</td>
                    <td><code>GPIOA->MODER</code></td>
                </tr>
                <tr>
                    <td>Clock Macros</td>
                    <td>Enable peripheral clocks</td>
                    <td><code>GPIOA_PCLK_EN()</code></td>
                </tr>
                <tr>
                    <td>Bit Positions</td>
                    <td>Readable bit manipulation</td>
                    <td><code>SPI_CR1_SPE</code></td>
                </tr>
            </table>

            <div class="success-box">
                <h4>✅ You're Ready!</h4>
                <p>With this header file complete, you can now:</p>
                <ul>
                    <li>Write GPIO drivers</li>
                    <li>Write SPI drivers</li>
                    <li>Write I2C drivers</li>
                    <li>Write USART drivers</li>
                    <li>Handle interrupts</li>
                </ul>
                <p><strong>This file is the foundation of ALL your driver code!</strong></p>
            </div>
        `
    }
];

