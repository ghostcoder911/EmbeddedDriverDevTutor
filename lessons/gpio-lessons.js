/**
 * GPIO Driver Lessons
 * Step-by-step guide to writing a GPIO driver from scratch
 */

window.gpioLessons = [
    // Step 1: Introduction
    {
        title: "Understanding GPIO Basics",
        content: `
            <h2>What is GPIO?</h2>
            <p><strong>GPIO</strong> stands for <em>General Purpose Input/Output</em>. These are the most fundamental peripherals on any microcontroller. GPIO pins allow you to:</p>
            <ul>
                <li><strong>Read digital inputs</strong> - Detect button presses, sensor states, etc.</li>
                <li><strong>Write digital outputs</strong> - Control LEDs, relays, motors, etc.</li>
                <li><strong>Configure alternate functions</strong> - Use pins for SPI, I2C, UART, etc.</li>
            </ul>

            <div class="info-box note">
                <div class="info-box-title">📘 Key Concept</div>
                <p>Every pin on an STM32 microcontroller belongs to a GPIO port (GPIOA, GPIOB, GPIOC, etc.). Each port has 16 pins (0-15).</p>
            </div>

            <h2>Why Write Your Own Driver?</h2>
            <p>Writing your own GPIO driver helps you:</p>
            <ol>
                <li>Understand how hardware registers work at the lowest level</li>
                <li>Create portable code that can be adapted to different MCUs</li>
                <li>Learn the foundation for all other peripheral drivers</li>
                <li>Gain complete control over your hardware</li>
            </ol>

            <h2>What You'll Learn</h2>
            <p>By the end of this tutorial, you will be able to:</p>
            <ul>
                <li>Define GPIO register structures</li>
                <li>Create configuration and handle structures</li>
                <li>Write initialization functions</li>
                <li>Implement read/write operations</li>
                <li>Handle GPIO interrupts</li>
            </ul>

            <div class="info-box tip">
                <div class="info-box-title">💡 Pro Tip</div>
                <p>Keep your reference manual open! For STM32F446RE, that's the RM0390 document. You'll be referring to it constantly.</p>
            </div>
        `
    },

    // Step 2: Understanding the Hardware
    {
        title: "GPIO Hardware Architecture",
        content: `
            <h2>STM32F446RE GPIO Features</h2>
            <p>The STM32F446RE has 8 GPIO ports (GPIOA through GPIOH), with each port having up to 16 pins. Each pin can be configured independently with:</p>
            
            <table class="lesson-table">
                <tr>
                    <th>Feature</th>
                    <th>Options</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><strong>Mode</strong></td>
                    <td>Input, Output, Alternate, Analog</td>
                    <td>Defines the basic function of the pin</td>
                </tr>
                <tr>
                    <td><strong>Output Type</strong></td>
                    <td>Push-Pull, Open-Drain</td>
                    <td>How the output driver behaves</td>
                </tr>
                <tr>
                    <td><strong>Speed</strong></td>
                    <td>Low, Medium, High, Very High</td>
                    <td>Slew rate of the output</td>
                </tr>
                <tr>
                    <td><strong>Pull-up/Pull-down</strong></td>
                    <td>None, Pull-up, Pull-down</td>
                    <td>Internal resistor configuration</td>
                </tr>
            </table>

            <h2>GPIO Block Diagram</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">GPIO Pin Architecture</span>
                </div>
                <div class="code-content">
                    <pre><code>                    VDD
                     │
                ┌────┴────┐
                │ Pull-up │ (Configurable)
                └────┬────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    │  ┌─────────────┴─────────────┐  │
    │  │      Input Buffer         │◄─┼── To IDR (Input Data Register)
    │  │   (Schmitt Trigger)       │  │
    │  └───────────────────────────┘  │
    │                                 │
PAD ●────────────────────────────────●── External Pin
    │                                 │
    │  ┌───────────────────────────┐  │
    │  │     Output Buffer         │◄─┼── From ODR (Output Data Register)
    │  │  (Push-Pull/Open-Drain)   │  │
    │  └───────────────────────────┘  │
    │                │                │
    └────────────────┼────────────────┘
                     │
                ┌────┴────┐
                │Pull-down│ (Configurable)
                └────┬────┘
                     │
                    GND</code></pre>
                </div>
            </div>

            <h2>Memory-Mapped I/O</h2>
            <p>In STM32, peripherals are accessed through <strong>memory-mapped registers</strong>. Each GPIO port has a base address:</p>
            
            <table class="lesson-table">
                <tr><th>Port</th><th>Base Address</th></tr>
                <tr><td>GPIOA</td><td><code>0x4002 0000</code></td></tr>
                <tr><td>GPIOB</td><td><code>0x4002 0400</code></td></tr>
                <tr><td>GPIOC</td><td><code>0x4002 0800</code></td></tr>
                <tr><td>GPIOD</td><td><code>0x4002 0C00</code></td></tr>
                <tr><td>GPIOE</td><td><code>0x4002 1000</code></td></tr>
                <tr><td>GPIOF</td><td><code>0x4002 1400</code></td></tr>
                <tr><td>GPIOG</td><td><code>0x4002 1800</code></td></tr>
                <tr><td>GPIOH</td><td><code>0x4002 1C00</code></td></tr>
            </table>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Important</div>
                <p>Always verify addresses from your specific MCU's reference manual. Different STM32 families may have different memory maps!</p>
            </div>
        `
    },

    // Step 3: GPIO Registers
    {
        title: "GPIO Register Map",
        content: `
            <h2>Understanding GPIO Registers</h2>
            <p>Each GPIO port has the following registers at fixed offsets from the base address:</p>

            <table class="lesson-table">
                <tr>
                    <th>Register</th>
                    <th>Offset</th>
                    <th>Reset Value</th>
                    <th>Purpose</th>
                </tr>
                <tr>
                    <td><code>MODER</code></td>
                    <td>0x00</td>
                    <td>Variable</td>
                    <td>Mode register (2 bits per pin)</td>
                </tr>
                <tr>
                    <td><code>OTYPER</code></td>
                    <td>0x04</td>
                    <td>0x0000 0000</td>
                    <td>Output type (1 bit per pin)</td>
                </tr>
                <tr>
                    <td><code>OSPEEDR</code></td>
                    <td>0x08</td>
                    <td>0x0000 0000</td>
                    <td>Output speed (2 bits per pin)</td>
                </tr>
                <tr>
                    <td><code>PUPDR</code></td>
                    <td>0x0C</td>
                    <td>Variable</td>
                    <td>Pull-up/Pull-down (2 bits per pin)</td>
                </tr>
                <tr>
                    <td><code>IDR</code></td>
                    <td>0x10</td>
                    <td>Variable</td>
                    <td>Input data register (read-only)</td>
                </tr>
                <tr>
                    <td><code>ODR</code></td>
                    <td>0x14</td>
                    <td>0x0000 0000</td>
                    <td>Output data register</td>
                </tr>
                <tr>
                    <td><code>BSRR</code></td>
                    <td>0x18</td>
                    <td>0x0000 0000</td>
                    <td>Bit set/reset register</td>
                </tr>
                <tr>
                    <td><code>LCKR</code></td>
                    <td>0x1C</td>
                    <td>0x0000 0000</td>
                    <td>Configuration lock register</td>
                </tr>
                <tr>
                    <td><code>AFRL</code></td>
                    <td>0x20</td>
                    <td>0x0000 0000</td>
                    <td>Alternate function low (pins 0-7)</td>
                </tr>
                <tr>
                    <td><code>AFRH</code></td>
                    <td>0x24</td>
                    <td>0x0000 0000</td>
                    <td>Alternate function high (pins 8-15)</td>
                </tr>
            </table>

            <h2>MODER Register Deep Dive</h2>
            <p>The Mode Register controls what mode each pin operates in. It uses <strong>2 bits per pin</strong>:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">MODER Bit Configuration</span>
                </div>
                <div class="code-content">
                    <pre><code>Bit Pattern | Mode
------------|------------------
    00      | Input (reset state)
    01      | General purpose output
    10      | Alternate function
    11      | Analog

Example: GPIOA->MODER for Pin 5 as Output:
┌────┬────┬────┬────┬────┬────┬────┬────┐
│ 31 │ 30 │... │ 11 │ 10 │  9 │  8 │... │
└────┴────┴────┴────┴────┴────┴────┴────┘
                    │    │
                    └──┬─┘
                  Pin 5: 01 = Output mode</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Calculation Tip</div>
                <p>For a 2-bit-per-pin register, the bit position for pin N is: <code>N * 2</code><br>
                For example, Pin 5 starts at bit position 10 (5 × 2 = 10).</p>
            </div>
        `
    },

    // Step 4: Creating the Header File
    {
        title: "Creating the Driver Header File",
        content: `
            <h2>Driver Header File Structure</h2>
            <p>The header file is the "interface" of your driver. It contains:</p>
            <ul>
                <li>Register definitions (structures)</li>
                <li>Configuration structures</li>
                <li>Macros for configuration options</li>
                <li>Function prototypes (API declarations)</li>
            </ul>

            <h2>Step 4.1: Header Guards</h2>
            <p>Always start with header guards to prevent multiple inclusion:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#ifndef</span> INC_STM32F446XX_GPIO_DRIVER_H_
<span class="preprocessor">#define</span> INC_STM32F446XX_GPIO_DRIVER_H_

<span class="preprocessor">#include</span> <span class="string">"stm32f446xx.h"</span>  <span class="comment">// MCU-specific header</span>

<span class="comment">// ... driver code goes here ...</span>

<span class="preprocessor">#endif</span> <span class="comment">/* INC_STM32F446XX_GPIO_DRIVER_H_ */</span></code></pre>
                </div>
            </div>

            <h2>Step 4.2: Configuration Structure</h2>
            <p>Create a structure to hold all configuration options for a GPIO pin:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * Configuration structure for a GPIO pin
 */</span>
<span class="keyword">typedef struct</span>
{
    <span class="type">uint8_t</span> GPIO_PinNumber;        <span class="comment">// Pin number (0-15)</span>
    <span class="type">uint8_t</span> GPIO_PinMode;          <span class="comment">// Mode: Input/Output/AltFn/Analog</span>
    <span class="type">uint8_t</span> GPIO_PinSpeed;         <span class="comment">// Speed: Low/Medium/High/Very High</span>
    <span class="type">uint8_t</span> GPIO_PinPuPdControl;   <span class="comment">// Pull-up/Pull-down configuration</span>
    <span class="type">uint8_t</span> GPIO_PinOPType;        <span class="comment">// Output type: Push-Pull/Open-Drain</span>
    <span class="type">uint8_t</span> GPIO_PinAltFunMode;    <span class="comment">// Alternate function (0-15)</span>
} <span class="type">GPIO_PinConfig_t</span>;</code></pre>
                </div>
            </div>

            <h2>Step 4.3: Handle Structure</h2>
            <p>The handle structure combines the peripheral pointer with its configuration:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * Handle structure for a GPIO pin
 */</span>
<span class="keyword">typedef struct</span>
{
    <span class="type">GPIO_RegDef_t</span> *pGPIOx;        <span class="comment">// Pointer to GPIO port base address</span>
    <span class="type">GPIO_PinConfig_t</span> GPIO_PinConfig;  <span class="comment">// Pin configuration settings</span>
} <span class="type">GPIO_Handle_t</span>;</code></pre>
                </div>
            </div>

            <div class="info-box note">
                <div class="info-box-title">📘 Why Use a Handle?</div>
                <p>The handle pattern is common in embedded drivers. It encapsulates everything needed to work with a peripheral instance - both the hardware pointer and its configuration.</p>
            </div>
        `
    },

    // Step 5: Configuration Macros
    {
        title: "Defining Configuration Macros",
        content: `
            <h2>Why Use Macros?</h2>
            <p>Macros make your code more readable and less error-prone. Instead of magic numbers, you use meaningful names.</p>

            <h2>Pin Number Macros</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * @GPIO_PIN_NUMBERS
 * GPIO pin numbers
 */</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_0      <span class="number">0</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_1      <span class="number">1</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_2      <span class="number">2</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_3      <span class="number">3</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_4      <span class="number">4</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_5      <span class="number">5</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_6      <span class="number">6</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_7      <span class="number">7</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_8      <span class="number">8</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_9      <span class="number">9</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_10     <span class="number">10</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_11     <span class="number">11</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_12     <span class="number">12</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_13     <span class="number">13</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_14     <span class="number">14</span>
<span class="preprocessor">#define</span> GPIO_PIN_NO_15     <span class="number">15</span></code></pre>
                </div>
            </div>

            <h2>Pin Mode Macros</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * @GPIO_PIN_MODES
 * GPIO pin possible modes
 */</span>
<span class="preprocessor">#define</span> GPIO_MODE_IN       <span class="number">0</span>   <span class="comment">// Input mode</span>
<span class="preprocessor">#define</span> GPIO_MODE_OUT      <span class="number">1</span>   <span class="comment">// General purpose output mode</span>
<span class="preprocessor">#define</span> GPIO_MODE_ALTFN    <span class="number">2</span>   <span class="comment">// Alternate function mode</span>
<span class="preprocessor">#define</span> GPIO_MODE_ANALOG   <span class="number">3</span>   <span class="comment">// Analog mode</span>

<span class="comment">// Interrupt modes (custom values > 3)</span>
<span class="preprocessor">#define</span> GPIO_MODE_IT_FT    <span class="number">4</span>   <span class="comment">// Input with falling edge trigger</span>
<span class="preprocessor">#define</span> GPIO_MODE_IT_RT    <span class="number">5</span>   <span class="comment">// Input with rising edge trigger</span>
<span class="preprocessor">#define</span> GPIO_MODE_IT_RFT   <span class="number">6</span>   <span class="comment">// Input with rising/falling edge trigger</span></code></pre>
                </div>
            </div>

            <h2>Output Type, Speed, and Pull-up/Pull-down Macros</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * @GPIO_PIN_OUTPUT_TYPES
 * GPIO pin output types
 */</span>
<span class="preprocessor">#define</span> GPIO_OP_TYPE_PP    <span class="number">0</span>   <span class="comment">// Push-pull</span>
<span class="preprocessor">#define</span> GPIO_OP_TYPE_OD    <span class="number">1</span>   <span class="comment">// Open-drain</span>

<span class="comment">/*
 * @GPIO_PIN_SPEED
 * GPIO pin output speeds
 */</span>
<span class="preprocessor">#define</span> GPIO_SPEED_LOW     <span class="number">0</span>   <span class="comment">// Low speed</span>
<span class="preprocessor">#define</span> GPIO_SPEED_MEDIUM  <span class="number">1</span>   <span class="comment">// Medium speed</span>
<span class="preprocessor">#define</span> GPIO_SPEED_FAST    <span class="number">2</span>   <span class="comment">// High speed</span>
<span class="preprocessor">#define</span> GPIO_SPEED_HIGH    <span class="number">3</span>   <span class="comment">// Very high speed</span>

<span class="comment">/*
 * @GPIO_PIN_PUPD
 * GPIO pin pull-up/pull-down configuration
 */</span>
<span class="preprocessor">#define</span> GPIO_NO_PUPD       <span class="number">0</span>   <span class="comment">// No pull-up, pull-down</span>
<span class="preprocessor">#define</span> GPIO_PIN_PU        <span class="number">1</span>   <span class="comment">// Pull-up</span>
<span class="preprocessor">#define</span> GPIO_PIN_PD        <span class="number">2</span>   <span class="comment">// Pull-down</span></code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Naming Convention</div>
                <p>Notice how macro names follow a pattern: <code>PERIPHERAL_FEATURE_VALUE</code>. This makes them easy to find and understand.</p>
            </div>
        `
    },

    // Step 6: API Function Prototypes
    {
        title: "Defining API Function Prototypes",
        content: `
            <h2>Driver API Design</h2>
            <p>A well-designed driver API follows a standard pattern. Here are the essential functions every GPIO driver should have:</p>

            <h3>1. Peripheral Clock Control</h3>
            <p>Enable or disable the clock to the GPIO port:</p>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * Peripheral Clock Setup
 */</span>
<span class="type">void</span> <span class="function">GPIO_PeriClockControl</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint8_t</span> EnorDi);</code></pre>
                </div>
            </div>

            <h3>2. Init and De-init</h3>
            <p>Initialize and reset the GPIO peripheral:</p>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * Init and De-init
 */</span>
<span class="type">void</span> <span class="function">GPIO_Init</span>(<span class="type">GPIO_Handle_t</span> *pGPIOHandle);
<span class="type">void</span> <span class="function">GPIO_DeInit</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx);</code></pre>
                </div>
            </div>

            <h3>3. Data Read and Write</h3>
            <p>Functions to read inputs and write outputs:</p>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * Data Read and Write
 */</span>
<span class="type">uint8_t</span> <span class="function">GPIO_ReadFromInputPin</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint8_t</span> PinNumber);
<span class="type">uint16_t</span> <span class="function">GPIO_ReadFromInputPort</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx);
<span class="type">void</span> <span class="function">GPIO_WriteToOutputPin</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint8_t</span> PinNumber, <span class="type">uint8_t</span> Value);
<span class="type">void</span> <span class="function">GPIO_WriteToOutputPort</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint16_t</span> Value);
<span class="type">void</span> <span class="function">GPIO_ToggleOutputPin</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint8_t</span> PinNumber);</code></pre>
                </div>
            </div>

            <h3>4. IRQ Configuration and Handling</h3>
            <p>Functions for interrupt setup:</p>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * IRQ Configuration and ISR Handling
 */</span>
<span class="type">void</span> <span class="function">GPIO_IRQInterruptConfig</span>(<span class="type">uint8_t</span> IRQNumber, <span class="type">uint8_t</span> EnorDi);
<span class="type">void</span> <span class="function">GPIO_IRQPriorityConfig</span>(<span class="type">uint8_t</span> IRQNumber, <span class="type">uint32_t</span> IRQPriority);
<span class="type">void</span> <span class="function">GPIO_IRQHandling</span>(<span class="type">uint8_t</span> PinNumber);</code></pre>
                </div>
            </div>

            <div class="info-box note">
                <div class="info-box-title">📘 API Design Principle</div>
                <p>Notice how functions that work with a specific pin take both the port pointer AND the pin number, while functions that configure the whole port just take the port pointer.</p>
            </div>
        `
    },

    // Step 7: Implementing Clock Control
    {
        title: "Implementing Clock Control",
        content: `
            <h2>Why Clock Control Matters</h2>
            <p>Before using any peripheral, you <strong>must enable its clock</strong>. Without the clock, the peripheral won't respond to any commands!</p>

            <div class="info-box important">
                <div class="info-box-title">🚨 Critical Rule</div>
                <p>ALWAYS enable the peripheral clock before accessing any registers. This is the #1 cause of "it doesn't work" bugs!</p>
            </div>

            <h2>Understanding the RCC Registers</h2>
            <p>GPIO ports get their clocks from the AHB1 bus. The <code>RCC_AHB1ENR</code> register controls these clocks:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">RCC_AHB1ENR Register</span>
                </div>
                <div class="code-content">
                    <pre><code>Bit 0: GPIOAEN - GPIOA clock enable
Bit 1: GPIOBEN - GPIOB clock enable
Bit 2: GPIOCEN - GPIOC clock enable
Bit 3: GPIODEN - GPIOD clock enable
Bit 4: GPIOEEN - GPIOE clock enable
Bit 5: GPIOFEN - GPIOF clock enable
Bit 6: GPIOGEN - GPIOG clock enable
Bit 7: GPIOHEN - GPIOH clock enable</code></pre>
                </div>
            </div>

            <h2>Implementation</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*********************************************************************
 * @fn          - GPIO_PeriClockControl
 *
 * @brief       - Enables or disables peripheral clock for GPIO port
 *
 * @param[in]   - pGPIOx: GPIO port base address
 * @param[in]   - EnorDi: ENABLE or DISABLE macros
 *
 * @return      - none
 *
 * @Note        - none
 *********************************************************************/</span>
<span class="type">void</span> <span class="function">GPIO_PeriClockControl</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint8_t</span> EnorDi)
{
    <span class="keyword">if</span> (EnorDi == ENABLE)
    {
        <span class="keyword">if</span> (pGPIOx == GPIOA)
        {
            GPIOA_PCLK_EN();
        }
        <span class="keyword">else if</span> (pGPIOx == GPIOB)
        {
            GPIOB_PCLK_EN();
        }
        <span class="keyword">else if</span> (pGPIOx == GPIOC)
        {
            GPIOC_PCLK_EN();
        }
        <span class="keyword">else if</span> (pGPIOx == GPIOD)
        {
            GPIOD_PCLK_EN();
        }
        <span class="keyword">else if</span> (pGPIOx == GPIOE)
        {
            GPIOE_PCLK_EN();
        }
        <span class="keyword">else if</span> (pGPIOx == GPIOF)
        {
            GPIOF_PCLK_EN();
        }
        <span class="keyword">else if</span> (pGPIOx == GPIOG)
        {
            GPIOG_PCLK_EN();
        }
        <span class="keyword">else if</span> (pGPIOx == GPIOH)
        {
            GPIOH_PCLK_EN();
        }
    }
    <span class="keyword">else</span>
    {
        <span class="comment">// Similar structure for DISABLE</span>
        <span class="keyword">if</span> (pGPIOx == GPIOA)
        {
            GPIOA_PCLK_DI();
        }
        <span class="comment">// ... repeat for other ports</span>
    }
}</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Macro Definitions</div>
                <p>The <code>GPIOx_PCLK_EN()</code> macros should be defined in your MCU header file:</p>
                <code>#define GPIOA_PCLK_EN() (RCC->AHB1ENR |= (1 << 0))</code>
            </div>
        `
    },

    // Step 8: Implementing GPIO_Init
    {
        title: "Implementing GPIO Initialization",
        content: `
            <h2>The Init Function</h2>
            <p>The <code>GPIO_Init()</code> function configures a GPIO pin based on the settings in the handle structure. This is where the magic happens!</p>

            <h2>Step-by-Step Implementation</h2>

            <h3>Step 1: Configure the Mode</h3>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="type">void</span> <span class="function">GPIO_Init</span>(<span class="type">GPIO_Handle_t</span> *pGPIOHandle)
{
    <span class="type">uint32_t</span> temp = <span class="number">0</span>;

    <span class="comment">// 1. Configure the mode of GPIO pin</span>
    <span class="keyword">if</span> (pGPIOHandle->GPIO_PinConfig.GPIO_PinMode <= GPIO_MODE_ANALOG)
    {
        <span class="comment">// Non-interrupt mode</span>
        temp = (pGPIOHandle->GPIO_PinConfig.GPIO_PinMode 
                << (<span class="number">2</span> * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
        
        <span class="comment">// Clear the 2 bits first</span>
        pGPIOHandle->pGPIOx->MODER &= ~(<span class="number">0x3</span> 
                << (<span class="number">2</span> * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
        
        <span class="comment">// Set the new value</span>
        pGPIOHandle->pGPIOx->MODER |= temp;
    }
    <span class="keyword">else</span>
    {
        <span class="comment">// Interrupt mode - we'll cover this later</span>
    }
    temp = <span class="number">0</span>;</code></pre>
                </div>
            </div>

            <h3>Step 2: Configure Speed</h3>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>    <span class="comment">// 2. Configure the speed</span>
    temp = (pGPIOHandle->GPIO_PinConfig.GPIO_PinSpeed 
            << (<span class="number">2</span> * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
    
    pGPIOHandle->pGPIOx->OSPEEDR &= ~(<span class="number">0x3</span> 
            << (<span class="number">2</span> * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
    pGPIOHandle->pGPIOx->OSPEEDR |= temp;
    temp = <span class="number">0</span>;</code></pre>
                </div>
            </div>

            <h3>Step 3: Configure Pull-up/Pull-down</h3>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>    <span class="comment">// 3. Configure the pull-up/pull-down settings</span>
    temp = (pGPIOHandle->GPIO_PinConfig.GPIO_PinPuPdControl 
            << (<span class="number">2</span> * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
    
    pGPIOHandle->pGPIOx->PUPDR &= ~(<span class="number">0x3</span> 
            << (<span class="number">2</span> * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
    pGPIOHandle->pGPIOx->PUPDR |= temp;
    temp = <span class="number">0</span>;</code></pre>
                </div>
            </div>

            <h3>Step 4: Configure Output Type</h3>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>    <span class="comment">// 4. Configure the output type (only 1 bit per pin)</span>
    temp = (pGPIOHandle->GPIO_PinConfig.GPIO_PinOPType 
            << pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber);
    
    pGPIOHandle->pGPIOx->OTYPER &= ~(<span class="number">0x1</span> 
            << pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber);
    pGPIOHandle->pGPIOx->OTYPER |= temp;
    temp = <span class="number">0</span>;</code></pre>
                </div>
            </div>

            <h3>Step 5: Configure Alternate Function (if applicable)</h3>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>    <span class="comment">// 5. Configure alternate function</span>
    <span class="keyword">if</span> (pGPIOHandle->GPIO_PinConfig.GPIO_PinMode == GPIO_MODE_ALTFN)
    {
        <span class="type">uint8_t</span> temp1, temp2;
        
        temp1 = pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber / <span class="number">8</span>;  <span class="comment">// AFR index (0 or 1)</span>
        temp2 = pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber % <span class="number">8</span>;  <span class="comment">// Bit position</span>
        
        pGPIOHandle->pGPIOx->AFR[temp1] &= ~(<span class="number">0xF</span> << (<span class="number">4</span> * temp2));
        pGPIOHandle->pGPIOx->AFR[temp1] |= 
            (pGPIOHandle->GPIO_PinConfig.GPIO_PinAltFunMode << (<span class="number">4</span> * temp2));
    }
}</code></pre>
                </div>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Common Mistake</div>
                <p>Always clear the bits before setting them! If you don't clear first, the OR operation might leave unwanted bits set from previous configurations.</p>
            </div>
        `
    },

    // Step 9: Read/Write Operations
    {
        title: "Implementing Read/Write Operations",
        content: `
            <h2>Reading from Input Pins</h2>
            <p>To read the state of an input pin, we read the Input Data Register (IDR):</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*********************************************************************
 * @fn          - GPIO_ReadFromInputPin
 *
 * @brief       - Reads the value of an input pin
 *
 * @param[in]   - pGPIOx: GPIO port base address
 * @param[in]   - PinNumber: Pin number to read
 *
 * @return      - 0 or 1
 *********************************************************************/</span>
<span class="type">uint8_t</span> <span class="function">GPIO_ReadFromInputPin</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint8_t</span> PinNumber)
{
    <span class="type">uint8_t</span> value;
    
    <span class="comment">// Read IDR, shift right by pin number, mask with 1</span>
    value = (<span class="type">uint8_t</span>)((pGPIOx->IDR >> PinNumber) & <span class="number">0x00000001</span>);
    
    <span class="keyword">return</span> value;
}

<span class="comment">/*********************************************************************
 * @fn          - GPIO_ReadFromInputPort
 *
 * @brief       - Reads the entire input port
 *
 * @return      - 16-bit value of the port
 *********************************************************************/</span>
<span class="type">uint16_t</span> <span class="function">GPIO_ReadFromInputPort</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx)
{
    <span class="type">uint16_t</span> value;
    
    value = (<span class="type">uint16_t</span>)pGPIOx->IDR;
    
    <span class="keyword">return</span> value;
}</code></pre>
                </div>
            </div>

            <h2>Writing to Output Pins</h2>
            <p>To write to an output pin, we modify the Output Data Register (ODR):</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*********************************************************************
 * @fn          - GPIO_WriteToOutputPin
 *
 * @brief       - Writes to an output pin
 *
 * @param[in]   - pGPIOx: GPIO port base address
 * @param[in]   - PinNumber: Pin number to write
 * @param[in]   - Value: GPIO_PIN_SET or GPIO_PIN_RESET
 *********************************************************************/</span>
<span class="type">void</span> <span class="function">GPIO_WriteToOutputPin</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint8_t</span> PinNumber, <span class="type">uint8_t</span> Value)
{
    <span class="keyword">if</span> (Value == GPIO_PIN_SET)
    {
        <span class="comment">// Set the bit</span>
        pGPIOx->ODR |= (<span class="number">1</span> << PinNumber);
    }
    <span class="keyword">else</span>
    {
        <span class="comment">// Clear the bit</span>
        pGPIOx->ODR &= ~(<span class="number">1</span> << PinNumber);
    }
}

<span class="comment">/*********************************************************************
 * @fn          - GPIO_WriteToOutputPort
 *
 * @brief       - Writes to entire output port
 *********************************************************************/</span>
<span class="type">void</span> <span class="function">GPIO_WriteToOutputPort</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint16_t</span> Value)
{
    pGPIOx->ODR = Value;
}</code></pre>
                </div>
            </div>

            <h2>Toggle Operation</h2>
            <p>Toggling is very useful for blinking LEDs:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_gpio_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*********************************************************************
 * @fn          - GPIO_ToggleOutputPin
 *
 * @brief       - Toggles the state of an output pin
 *********************************************************************/</span>
<span class="type">void</span> <span class="function">GPIO_ToggleOutputPin</span>(<span class="type">GPIO_RegDef_t</span> *pGPIOx, <span class="type">uint8_t</span> PinNumber)
{
    pGPIOx->ODR ^= (<span class="number">1</span> << PinNumber);  <span class="comment">// XOR to toggle</span>
}</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 XOR for Toggle</div>
                <p>The XOR operator (^) is perfect for toggling: <code>0 XOR 1 = 1</code> and <code>1 XOR 1 = 0</code>. This flips the bit regardless of its current state.</p>
            </div>
        `
    },

    // Step 10: Testing Your Driver
    {
        title: "Testing Your GPIO Driver",
        content: `
            <h2>Writing a Test Application</h2>
            <p>Let's write a simple application to test our GPIO driver - a classic LED blink program:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">main.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#include</span> <span class="string">"stm32f446xx_gpio_driver.h"</span>

<span class="comment">// Simple delay function</span>
<span class="type">void</span> <span class="function">delay</span>(<span class="type">void</span>)
{
    <span class="keyword">for</span> (<span class="type">uint32_t</span> i = <span class="number">0</span>; i < <span class="number">500000</span>; i++);
}

<span class="type">int</span> <span class="function">main</span>(<span class="type">void</span>)
{
    <span class="type">GPIO_Handle_t</span> GpioLed;

    <span class="comment">// Configure LED pin (PA5 on Nucleo board)</span>
    GpioLed.pGPIOx = GPIOA;
    GpioLed.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_5;
    GpioLed.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_OUT;
    GpioLed.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GpioLed.GPIO_PinConfig.GPIO_PinOPType = GPIO_OP_TYPE_PP;
    GpioLed.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;

    <span class="comment">// Enable clock for GPIOA</span>
    GPIO_PeriClockControl(GPIOA, ENABLE);

    <span class="comment">// Initialize the GPIO pin</span>
    GPIO_Init(&GpioLed);

    <span class="comment">// Blink forever</span>
    <span class="keyword">while</span> (<span class="number">1</span>)
    {
        GPIO_ToggleOutputPin(GPIOA, GPIO_PIN_NO_5);
        delay();
    }

    <span class="keyword">return</span> <span class="number">0</span>;
}</code></pre>
                </div>
            </div>

            <h2>Adding Button Input</h2>
            <p>Let's extend the test to include a button:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">main.c - With Button</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#include</span> <span class="string">"stm32f446xx_gpio_driver.h"</span>

<span class="preprocessor">#define</span> BTN_PRESSED  <span class="number">0</span>  <span class="comment">// Button is active low on Nucleo</span>

<span class="type">void</span> <span class="function">delay</span>(<span class="type">void</span>)
{
    <span class="keyword">for</span> (<span class="type">uint32_t</span> i = <span class="number">0</span>; i < <span class="number">250000</span>; i++);  <span class="comment">// Debounce delay</span>
}

<span class="type">int</span> <span class="function">main</span>(<span class="type">void</span>)
{
    <span class="type">GPIO_Handle_t</span> GpioLed, GpioBtn;

    <span class="comment">// Configure LED (PA5)</span>
    GpioLed.pGPIOx = GPIOA;
    GpioLed.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_5;
    GpioLed.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_OUT;
    GpioLed.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GpioLed.GPIO_PinConfig.GPIO_PinOPType = GPIO_OP_TYPE_PP;
    GpioLed.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;

    <span class="comment">// Configure Button (PC13 on Nucleo)</span>
    GpioBtn.pGPIOx = GPIOC;
    GpioBtn.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_13;
    GpioBtn.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IN;
    GpioBtn.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GpioBtn.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;

    <span class="comment">// Enable clocks</span>
    GPIO_PeriClockControl(GPIOA, ENABLE);
    GPIO_PeriClockControl(GPIOC, ENABLE);

    <span class="comment">// Initialize pins</span>
    GPIO_Init(&GpioLed);
    GPIO_Init(&GpioBtn);

    <span class="keyword">while</span> (<span class="number">1</span>)
    {
        <span class="keyword">if</span> (GPIO_ReadFromInputPin(GPIOC, GPIO_PIN_NO_13) == BTN_PRESSED)
        {
            delay();  <span class="comment">// Debounce</span>
            GPIO_ToggleOutputPin(GPIOA, GPIO_PIN_NO_5);
        }
    }

    <span class="keyword">return</span> <span class="number">0</span>;
}</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Debugging Tips</div>
                <ul>
                    <li>If LED doesn't blink, check if clock is enabled</li>
                    <li>Verify pin numbers match your hardware</li>
                    <li>Check if pin mode is correctly set to output</li>
                    <li>Use a debugger to step through GPIO_Init()</li>
                </ul>
            </div>

            <h2>🎉 Congratulations!</h2>
            <p>You've successfully created a GPIO driver from scratch! You now understand:</p>
            <ul>
                <li>How GPIO registers work</li>
                <li>How to structure a driver with header and source files</li>
                <li>How to implement initialization and I/O functions</li>
                <li>How to test your driver with real hardware</li>
            </ul>

            <div class="info-box note">
                <div class="info-box-title">📘 Next Steps</div>
                <p>Try extending your driver with interrupt support, or move on to the SPI or I2C drivers to learn about communication protocols!</p>
            </div>
        `
    }
];

