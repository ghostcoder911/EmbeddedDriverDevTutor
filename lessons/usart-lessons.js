/**
 * USART Driver Lessons
 * Step-by-step guide to writing a USART driver from scratch
 */

window.usartLessons = [
    // Step 1: Introduction
    {
        title: "Understanding USART Protocol",
        content: `
            <h2>What is USART?</h2>
            <p><strong>USART</strong> (Universal Synchronous/Asynchronous Receiver-Transmitter) is one of the most common serial communication interfaces. You've probably used it for debugging via a serial terminal!</p>

            <h2>UART vs USART</h2>
            <table class="lesson-table">
                <tr>
                    <th>UART</th>
                    <th>USART</th>
                </tr>
                <tr>
                    <td>Asynchronous only</td>
                    <td>Both sync and async modes</td>
                </tr>
                <tr>
                    <td>No clock line</td>
                    <td>Optional clock line (sync mode)</td>
                </tr>
                <tr>
                    <td>TX, RX only</td>
                    <td>TX, RX, CK (optional)</td>
                </tr>
            </table>

            <h2>USART Characteristics</h2>
            <ul>
                <li><strong>Asynchronous</strong> - No shared clock, uses baud rate</li>
                <li><strong>Full Duplex</strong> - Simultaneous send and receive</li>
                <li><strong>Point-to-point</strong> - Direct connection between two devices</li>
                <li><strong>Frame-based</strong> - Data sent in frames with start/stop bits</li>
            </ul>

            <h2>USART Frame Format</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">USART Data Frame</span>
                </div>
                <div class="code-content">
                    <pre><code>    Idle │ Start │    Data Bits      │Parity│ Stop │ Idle
         │       │                   │      │      │
    ─────┐   ┌───┬───┬───┬───┬───┬───┬───┬───┬───┐   ┌─────
         │   │   │   │   │   │   │   │   │   │   │   │
         └───┤ D0│ D1│ D2│ D3│ D4│ D5│ D6│ D7│ P │───┘
             │   │   │   │   │   │   │   │   │   │
             │   │   │   │   │   │   │   │   │   │
            LSB                             MSB
            
    • Start bit: Always LOW (logic 0)
    • Data bits: 8 or 9 bits (LSB first)
    • Parity: Optional (Even/Odd)
    • Stop bits: 1, 1.5, or 2 bits (always HIGH)</code></pre>
                </div>
            </div>

            <div class="info-box note">
                <div class="info-box-title">📘 Baud Rate</div>
                <p>Baud rate is the number of signal changes per second. Common rates: 9600, 115200, 921600. Both devices MUST use the same baud rate!</p>
            </div>
        `
    },

    // Step 2: USART Parameters
    {
        title: "USART Configuration Parameters",
        content: `
            <h2>Key Configuration Parameters</h2>

            <h3>1. Baud Rate</h3>
            <p>Speed of communication in bits per second:</p>
            <table class="lesson-table">
                <tr>
                    <th>Baud Rate</th>
                    <th>Bit Time</th>
                    <th>Use Case</th>
                </tr>
                <tr>
                    <td>9600</td>
                    <td>104 µs</td>
                    <td>Low-speed, reliable</td>
                </tr>
                <tr>
                    <td>115200</td>
                    <td>8.7 µs</td>
                    <td>Most common for debugging</td>
                </tr>
                <tr>
                    <td>921600</td>
                    <td>1.1 µs</td>
                    <td>High-speed data transfer</td>
                </tr>
            </table>

            <h3>2. Word Length</h3>
            <ul>
                <li><strong>8 bits</strong> - Standard, most common</li>
                <li><strong>9 bits</strong> - Used for addressing in multi-processor mode, or 8 data + parity</li>
            </ul>

            <h3>3. Parity</h3>
            <table class="lesson-table">
                <tr>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>None</td>
                    <td>No parity bit</td>
                </tr>
                <tr>
                    <td>Even</td>
                    <td>Parity bit makes total 1s even</td>
                </tr>
                <tr>
                    <td>Odd</td>
                    <td>Parity bit makes total 1s odd</td>
                </tr>
            </table>

            <h3>4. Stop Bits</h3>
            <ul>
                <li><strong>1 stop bit</strong> - Most common</li>
                <li><strong>2 stop bits</strong> - More robust, slower</li>
                <li><strong>0.5 or 1.5</strong> - Special applications</li>
            </ul>

            <h3>5. Hardware Flow Control</h3>
            <p>Optional signals for flow management:</p>
            <table class="lesson-table">
                <tr>
                    <th>Signal</th>
                    <th>Direction</th>
                    <th>Purpose</th>
                </tr>
                <tr>
                    <td>RTS</td>
                    <td>Output</td>
                    <td>Request To Send - "I'm ready to receive"</td>
                </tr>
                <tr>
                    <td>CTS</td>
                    <td>Input</td>
                    <td>Clear To Send - "You can send now"</td>
                </tr>
            </table>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Configuration Must Match!</div>
                <p>Both communicating devices MUST have identical settings: baud rate, word length, parity, and stop bits. Mismatched settings cause garbled data!</p>
            </div>
        `
    },

    // Step 3: STM32 USART Peripheral
    {
        title: "STM32F446RE USART Peripheral",
        content: `
            <h2>USART Instances</h2>
            <table class="lesson-table">
                <tr>
                    <th>USART</th>
                    <th>Base Address</th>
                    <th>Bus</th>
                    <th>Notes</th>
                </tr>
                <tr>
                    <td>USART1</td>
                    <td><code>0x4001 1000</code></td>
                    <td>APB2</td>
                    <td>High speed</td>
                </tr>
                <tr>
                    <td>USART2</td>
                    <td><code>0x4000 4400</code></td>
                    <td>APB1</td>
                    <td>Connected to ST-Link on Nucleo</td>
                </tr>
                <tr>
                    <td>USART3</td>
                    <td><code>0x4000 4800</code></td>
                    <td>APB1</td>
                    <td></td>
                </tr>
                <tr>
                    <td>UART4</td>
                    <td><code>0x4000 4C00</code></td>
                    <td>APB1</td>
                    <td>No sync mode</td>
                </tr>
                <tr>
                    <td>UART5</td>
                    <td><code>0x4000 5000</code></td>
                    <td>APB1</td>
                    <td>No sync mode</td>
                </tr>
                <tr>
                    <td>USART6</td>
                    <td><code>0x4001 1400</code></td>
                    <td>APB2</td>
                    <td>High speed</td>
                </tr>
            </table>

            <h2>USART Register Map</h2>
            <table class="lesson-table">
                <tr>
                    <th>Register</th>
                    <th>Offset</th>
                    <th>Purpose</th>
                </tr>
                <tr>
                    <td><code>SR</code></td>
                    <td>0x00</td>
                    <td>Status Register - Flags</td>
                </tr>
                <tr>
                    <td><code>DR</code></td>
                    <td>0x04</td>
                    <td>Data Register</td>
                </tr>
                <tr>
                    <td><code>BRR</code></td>
                    <td>0x08</td>
                    <td>Baud Rate Register</td>
                </tr>
                <tr>
                    <td><code>CR1</code></td>
                    <td>0x0C</td>
                    <td>Control Register 1</td>
                </tr>
                <tr>
                    <td><code>CR2</code></td>
                    <td>0x10</td>
                    <td>Control Register 2</td>
                </tr>
                <tr>
                    <td><code>CR3</code></td>
                    <td>0x14</td>
                    <td>Control Register 3</td>
                </tr>
                <tr>
                    <td><code>GTPR</code></td>
                    <td>0x18</td>
                    <td>Guard Time/Prescaler</td>
                </tr>
            </table>

            <div class="info-box tip">
                <div class="info-box-title">💡 Virtual COM Port</div>
                <p>On Nucleo boards, USART2 (PA2/PA3) is connected to the ST-Link, providing a virtual COM port over USB. This is the easiest way to test your USART driver!</p>
            </div>
        `
    },

    // Step 4: Creating USART Header
    {
        title: "Creating the USART Driver Header",
        content: `
            <h2>Configuration Structure</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_usart_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#ifndef</span> INC_STM32F446XX_USART_DRIVER_H_
<span class="preprocessor">#define</span> INC_STM32F446XX_USART_DRIVER_H_

<span class="preprocessor">#include</span> <span class="string">"stm32f446xx.h"</span>

<span class="comment">/*
 * Configuration structure for USARTx peripheral
 */</span>
<span class="keyword">typedef struct</span>
{
    <span class="type">uint8_t</span>  USART_Mode;           <span class="comment">// TX only, RX only, or both</span>
    <span class="type">uint32_t</span> USART_Baud;           <span class="comment">// Baud rate</span>
    <span class="type">uint8_t</span>  USART_NoOfStopBits;   <span class="comment">// Stop bits: 1, 0.5, 2, 1.5</span>
    <span class="type">uint8_t</span>  USART_WordLength;     <span class="comment">// 8 or 9 bits</span>
    <span class="type">uint8_t</span>  USART_ParityControl;  <span class="comment">// None, Even, Odd</span>
    <span class="type">uint8_t</span>  USART_HWFlowControl;  <span class="comment">// None, CTS, RTS, CTS+RTS</span>
} <span class="type">USART_Config_t</span>;</code></pre>
                </div>
            </div>

            <h2>Handle Structure</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_usart_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * Handle structure for USARTx peripheral
 */</span>
<span class="keyword">typedef struct</span>
{
    <span class="type">USART_RegDef_t</span> *pUSARTx;      <span class="comment">// Pointer to USART peripheral</span>
    <span class="type">USART_Config_t</span> USART_Config; <span class="comment">// Configuration settings</span>
    
    <span class="comment">// For interrupt-based communication</span>
    <span class="type">uint8_t</span>        *pTxBuffer;    <span class="comment">// TX buffer pointer</span>
    <span class="type">uint8_t</span>        *pRxBuffer;    <span class="comment">// RX buffer pointer</span>
    <span class="type">uint32_t</span>       TxLen;         <span class="comment">// TX length</span>
    <span class="type">uint32_t</span>       RxLen;         <span class="comment">// RX length</span>
    <span class="type">uint8_t</span>        TxBusyState;   <span class="comment">// TX state</span>
    <span class="type">uint8_t</span>        RxBusyState;   <span class="comment">// RX state</span>
} <span class="type">USART_Handle_t</span>;</code></pre>
                </div>
            </div>

            <h2>Configuration Macros</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_usart_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * @USART_Mode
 */</span>
<span class="preprocessor">#define</span> USART_MODE_ONLY_TX    <span class="number">0</span>
<span class="preprocessor">#define</span> USART_MODE_ONLY_RX    <span class="number">1</span>
<span class="preprocessor">#define</span> USART_MODE_TXRX       <span class="number">2</span>

<span class="comment">/*
 * @USART_Baud - Standard baud rates
 */</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_1200     <span class="number">1200</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_2400     <span class="number">2400</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_9600     <span class="number">9600</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_19200    <span class="number">19200</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_38400    <span class="number">38400</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_57600    <span class="number">57600</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_115200   <span class="number">115200</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_230400   <span class="number">230400</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_460800   <span class="number">460800</span>
<span class="preprocessor">#define</span> USART_STD_BAUD_921600   <span class="number">921600</span>

<span class="comment">/*
 * @USART_ParityControl
 */</span>
<span class="preprocessor">#define</span> USART_PARITY_DISABLE   <span class="number">0</span>
<span class="preprocessor">#define</span> USART_PARITY_EN_EVEN   <span class="number">1</span>
<span class="preprocessor">#define</span> USART_PARITY_EN_ODD    <span class="number">2</span>

<span class="comment">/*
 * @USART_WordLength
 */</span>
<span class="preprocessor">#define</span> USART_WORDLEN_8BITS    <span class="number">0</span>
<span class="preprocessor">#define</span> USART_WORDLEN_9BITS    <span class="number">1</span>

<span class="comment">/*
 * @USART_NoOfStopBits
 */</span>
<span class="preprocessor">#define</span> USART_STOPBITS_1       <span class="number">0</span>
<span class="preprocessor">#define</span> USART_STOPBITS_0_5     <span class="number">1</span>
<span class="preprocessor">#define</span> USART_STOPBITS_2       <span class="number">2</span>
<span class="preprocessor">#define</span> USART_STOPBITS_1_5     <span class="number">3</span>

<span class="comment">/*
 * @USART_HWFlowControl
 */</span>
<span class="preprocessor">#define</span> USART_HW_FLOW_CTRL_NONE     <span class="number">0</span>
<span class="preprocessor">#define</span> USART_HW_FLOW_CTRL_CTS      <span class="number">1</span>
<span class="preprocessor">#define</span> USART_HW_FLOW_CTRL_RTS      <span class="number">2</span>
<span class="preprocessor">#define</span> USART_HW_FLOW_CTRL_CTS_RTS  <span class="number">3</span></code></pre>
                </div>
            </div>
        `
    },

    // Step 5: USART Baud Rate Calculation
    {
        title: "Baud Rate Calculation",
        content: `
            <h2>Understanding Baud Rate Register (BRR)</h2>
            <p>The baud rate is set via the BRR register which contains:</p>
            <ul>
                <li><strong>DIV_Mantissa[11:0]</strong> - Integer part of divider</li>
                <li><strong>DIV_Fraction[3:0]</strong> - Fractional part of divider</li>
            </ul>

            <h2>Baud Rate Formula</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Baud Rate Calculation</span>
                </div>
                <div class="code-content">
                    <pre><code>              F_CK
Baud = ─────────────────────
       8 × (2 - OVER8) × USARTDIV

Where:
  F_CK = Peripheral clock (APB1 or APB2)
  OVER8 = Oversampling mode (0 = 16x, 1 = 8x)
  USARTDIV = DIV_Mantissa + (DIV_Fraction / 16)

Example: F_CK = 16 MHz, Baud = 115200, OVER8 = 0
  USARTDIV = 16,000,000 / (16 × 115200) = 8.6805
  
  Mantissa = 8
  Fraction = 0.6805 × 16 = 10.89 ≈ 11 (0xB)
  
  BRR = (8 << 4) | 11 = 0x8B</code></pre>
                </div>
            </div>

            <h2>Implementation</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_usart_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="type">void</span> <span class="function">USART_SetBaudRate</span>(<span class="type">USART_RegDef_t</span> *pUSARTx, <span class="type">uint32_t</span> BaudRate)
{
    <span class="type">uint32_t</span> PCLKx;
    <span class="type">uint32_t</span> usartdiv;
    <span class="type">uint32_t</span> M_part, F_part;
    <span class="type">uint32_t</span> tempreg = <span class="number">0</span>;

    <span class="comment">// Get the APB clock value</span>
    <span class="keyword">if</span> (pUSARTx == USART1 || pUSARTx == USART6)
    {
        <span class="comment">// USART1 and USART6 are on APB2</span>
        PCLKx = RCC_GetPCLK2Value();
    }
    <span class="keyword">else</span>
    {
        <span class="comment">// USART2, USART3, UART4, UART5 are on APB1</span>
        PCLKx = RCC_GetPCLK1Value();
    }

    <span class="comment">// Check OVER8 bit</span>
    <span class="keyword">if</span> (pUSARTx->CR1 & (<span class="number">1</span> << <span class="number">15</span>))
    {
        <span class="comment">// OVER8 = 1, oversampling by 8</span>
        usartdiv = ((<span class="number">25</span> * PCLKx) / (<span class="number">2</span> * BaudRate));
    }
    <span class="keyword">else</span>
    {
        <span class="comment">// OVER8 = 0, oversampling by 16</span>
        usartdiv = ((<span class="number">25</span> * PCLKx) / (<span class="number">4</span> * BaudRate));
    }

    <span class="comment">// Calculate mantissa</span>
    M_part = usartdiv / <span class="number">100</span>;

    <span class="comment">// Place mantissa in appropriate position</span>
    tempreg |= M_part << <span class="number">4</span>;

    <span class="comment">// Calculate fraction</span>
    F_part = (usartdiv - (M_part * <span class="number">100</span>));

    <span class="comment">// Calculate final fraction value</span>
    <span class="keyword">if</span> (pUSARTx->CR1 & (<span class="number">1</span> << <span class="number">15</span>))
    {
        <span class="comment">// OVER8 = 1</span>
        F_part = ((F_part * <span class="number">8</span>) + <span class="number">50</span>) / <span class="number">100</span>;
        F_part &= <span class="number">0x07</span>;  <span class="comment">// Only 3 bits for OVER8</span>
    }
    <span class="keyword">else</span>
    {
        <span class="comment">// OVER8 = 0</span>
        F_part = ((F_part * <span class="number">16</span>) + <span class="number">50</span>) / <span class="number">100</span>;
        F_part &= <span class="number">0x0F</span>;  <span class="comment">// 4 bits for normal mode</span>
    }

    <span class="comment">// Place fraction in lower 4 bits</span>
    tempreg |= F_part;

    <span class="comment">// Write to BRR</span>
    pUSARTx->BRR = tempreg;
}</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Precision Matters</div>
                <p>The × 25 and / 100 trick avoids floating-point math while maintaining precision. Integer-only calculation is important for embedded systems!</p>
            </div>
        `
    },

    // Step 6: USART Init and Send
    {
        title: "Implementing Init and Send",
        content: `
            <h2>USART_Init Implementation</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_usart_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="type">void</span> <span class="function">USART_Init</span>(<span class="type">USART_Handle_t</span> *pUSARTHandle)
{
    <span class="type">uint32_t</span> tempreg = <span class="number">0</span>;

    <span class="comment">// Enable peripheral clock</span>
    USART_PeriClockControl(pUSARTHandle->pUSARTx, ENABLE);

    <span class="comment">/*** CR1 Configuration ***/</span>

    <span class="comment">// Enable USART TX and/or RX based on mode</span>
    <span class="keyword">if</span> (pUSARTHandle->USART_Config.USART_Mode == USART_MODE_ONLY_RX)
    {
        tempreg |= (<span class="number">1</span> << <span class="number">2</span>);  <span class="comment">// RE bit</span>
    }
    <span class="keyword">else if</span> (pUSARTHandle->USART_Config.USART_Mode == USART_MODE_ONLY_TX)
    {
        tempreg |= (<span class="number">1</span> << <span class="number">3</span>);  <span class="comment">// TE bit</span>
    }
    <span class="keyword">else if</span> (pUSARTHandle->USART_Config.USART_Mode == USART_MODE_TXRX)
    {
        tempreg |= ((<span class="number">1</span> << <span class="number">2</span>) | (<span class="number">1</span> << <span class="number">3</span>));  <span class="comment">// RE and TE bits</span>
    }

    <span class="comment">// Configure word length</span>
    tempreg |= (pUSARTHandle->USART_Config.USART_WordLength << <span class="number">12</span>);

    <span class="comment">// Configure parity</span>
    <span class="keyword">if</span> (pUSARTHandle->USART_Config.USART_ParityControl == USART_PARITY_EN_EVEN)
    {
        tempreg |= (<span class="number">1</span> << <span class="number">10</span>);  <span class="comment">// PCE bit - enable parity</span>
        <span class="comment">// PS bit = 0 for even parity (default)</span>
    }
    <span class="keyword">else if</span> (pUSARTHandle->USART_Config.USART_ParityControl == USART_PARITY_EN_ODD)
    {
        tempreg |= (<span class="number">1</span> << <span class="number">10</span>);  <span class="comment">// PCE bit</span>
        tempreg |= (<span class="number">1</span> << <span class="number">9</span>);   <span class="comment">// PS bit = 1 for odd parity</span>
    }

    pUSARTHandle->pUSARTx->CR1 = tempreg;

    <span class="comment">/*** CR2 Configuration ***/</span>
    tempreg = <span class="number">0</span>;
    tempreg |= (pUSARTHandle->USART_Config.USART_NoOfStopBits << <span class="number">12</span>);
    pUSARTHandle->pUSARTx->CR2 = tempreg;

    <span class="comment">/*** CR3 Configuration ***/</span>
    tempreg = <span class="number">0</span>;
    <span class="keyword">if</span> (pUSARTHandle->USART_Config.USART_HWFlowControl == USART_HW_FLOW_CTRL_CTS)
    {
        tempreg |= (<span class="number">1</span> << <span class="number">9</span>);  <span class="comment">// CTSE bit</span>
    }
    <span class="keyword">else if</span> (pUSARTHandle->USART_Config.USART_HWFlowControl == USART_HW_FLOW_CTRL_RTS)
    {
        tempreg |= (<span class="number">1</span> << <span class="number">8</span>);  <span class="comment">// RTSE bit</span>
    }
    <span class="keyword">else if</span> (pUSARTHandle->USART_Config.USART_HWFlowControl == USART_HW_FLOW_CTRL_CTS_RTS)
    {
        tempreg |= ((<span class="number">1</span> << <span class="number">8</span>) | (<span class="number">1</span> << <span class="number">9</span>));
    }
    pUSARTHandle->pUSARTx->CR3 = tempreg;

    <span class="comment">/*** Configure Baud Rate ***/</span>
    USART_SetBaudRate(pUSARTHandle->pUSARTx, pUSARTHandle->USART_Config.USART_Baud);
}</code></pre>
                </div>
            </div>

            <h2>USART_SendData Implementation</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_usart_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="type">void</span> <span class="function">USART_SendData</span>(<span class="type">USART_Handle_t</span> *pUSARTHandle, <span class="type">uint8_t</span> *pTxBuffer, <span class="type">uint32_t</span> Len)
{
    <span class="type">uint16_t</span> *pdata;

    <span class="keyword">for</span> (<span class="type">uint32_t</span> i = <span class="number">0</span>; i < Len; i++)
    {
        <span class="comment">// Wait until TXE flag is set</span>
        <span class="keyword">while</span> (!USART_GetFlagStatus(pUSARTHandle->pUSARTx, USART_FLAG_TXE));

        <span class="comment">// Check word length</span>
        <span class="keyword">if</span> (pUSARTHandle->USART_Config.USART_WordLength == USART_WORDLEN_9BITS)
        {
            <span class="comment">// 9-bit data</span>
            pdata = (<span class="type">uint16_t</span>*)pTxBuffer;
            pUSARTHandle->pUSARTx->DR = (*pdata & (<span class="type">uint16_t</span>)<span class="number">0x01FF</span>);

            <span class="comment">// Check if parity is used</span>
            <span class="keyword">if</span> (pUSARTHandle->USART_Config.USART_ParityControl == USART_PARITY_DISABLE)
            {
                <span class="comment">// No parity: 9 data bits, increment by 2</span>
                pTxBuffer += <span class="number">2</span>;
            }
            <span class="keyword">else</span>
            {
                <span class="comment">// Parity used: 8 data bits + 1 parity</span>
                pTxBuffer++;
            }
        }
        <span class="keyword">else</span>
        {
            <span class="comment">// 8-bit data</span>
            pUSARTHandle->pUSARTx->DR = (*pTxBuffer & (<span class="type">uint8_t</span>)<span class="number">0xFF</span>);
            pTxBuffer++;
        }
    }

    <span class="comment">// Wait until TC flag is set (transmission complete)</span>
    <span class="keyword">while</span> (!USART_GetFlagStatus(pUSARTHandle->pUSARTx, USART_FLAG_TC));
}</code></pre>
                </div>
            </div>
        `
    },

    // Step 7: Testing USART
    {
        title: "Testing Your USART Driver",
        content: `
            <h2>Test: Hello World over Serial</h2>
            <p>Let's test using the virtual COM port on Nucleo board (USART2):</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">usart_test.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#include</span> <span class="string">"stm32f446xx_gpio_driver.h"</span>
<span class="preprocessor">#include</span> <span class="string">"stm32f446xx_usart_driver.h"</span>
<span class="preprocessor">#include</span> <span class="string">&lt;string.h&gt;</span>

<span class="type">USART_Handle_t</span> USART2Handle;

<span class="comment">/*
 * USART2 GPIO Pins (connected to ST-Link):
 * PA2 -> TX (AF7)
 * PA3 -> RX (AF7)
 */</span>
<span class="type">void</span> <span class="function">USART2_GPIOInit</span>(<span class="type">void</span>)
{
    <span class="type">GPIO_Handle_t</span> USARTPins;

    USARTPins.pGPIOx = GPIOA;
    USARTPins.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_ALTFN;
    USARTPins.GPIO_PinConfig.GPIO_PinOPType = GPIO_OP_TYPE_PP;
    USARTPins.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PU;
    USARTPins.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    USARTPins.GPIO_PinConfig.GPIO_PinAltFunMode = <span class="number">7</span>;  <span class="comment">// AF7 for USART2</span>

    GPIO_PeriClockControl(GPIOA, ENABLE);

    <span class="comment">// TX</span>
    USARTPins.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_2;
    GPIO_Init(&USARTPins);

    <span class="comment">// RX</span>
    USARTPins.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_3;
    GPIO_Init(&USARTPins);
}

<span class="type">void</span> <span class="function">USART2_Init</span>(<span class="type">void</span>)
{
    USART2Handle.pUSARTx = USART2;
    USART2Handle.USART_Config.USART_Baud = USART_STD_BAUD_115200;
    USART2Handle.USART_Config.USART_HWFlowControl = USART_HW_FLOW_CTRL_NONE;
    USART2Handle.USART_Config.USART_Mode = USART_MODE_TXRX;
    USART2Handle.USART_Config.USART_NoOfStopBits = USART_STOPBITS_1;
    USART2Handle.USART_Config.USART_WordLength = USART_WORDLEN_8BITS;
    USART2Handle.USART_Config.USART_ParityControl = USART_PARITY_DISABLE;

    USART_Init(&USART2Handle);
}

<span class="type">int</span> <span class="function">main</span>(<span class="type">void</span>)
{
    <span class="type">char</span> msg[] = <span class="string">"Hello from STM32!\\r\\n"</span>;

    <span class="comment">// Initialize GPIO pins for USART2</span>
    USART2_GPIOInit();

    <span class="comment">// Initialize USART2</span>
    USART2_Init();

    <span class="comment">// Enable USART2 peripheral</span>
    USART_PeripheralControl(USART2, ENABLE);

    <span class="keyword">while</span> (<span class="number">1</span>)
    {
        <span class="comment">// Send message</span>
        USART_SendData(&USART2Handle, (<span class="type">uint8_t</span>*)msg, strlen(msg));

        <span class="comment">// Delay</span>
        <span class="keyword">for</span> (<span class="type">uint32_t</span> i = <span class="number">0</span>; i < <span class="number">500000</span>; i++);
    }

    <span class="keyword">return</span> <span class="number">0</span>;
}</code></pre>
                </div>
            </div>

            <h2>Testing with Serial Terminal</h2>
            <ol>
                <li>Connect Nucleo board via USB</li>
                <li>Open a serial terminal (PuTTY, Tera Term, or Arduino Serial Monitor)</li>
                <li>Select the correct COM port</li>
                <li>Set baud rate to 115200, 8N1</li>
                <li>Flash the program and see "Hello from STM32!" appearing!</li>
            </ol>

            <h2>🎉 Congratulations!</h2>
            <p>You've completed all four driver tutorials! You now understand:</p>
            <ul>
                <li><strong>GPIO</strong> - Digital I/O, the foundation of everything</li>
                <li><strong>SPI</strong> - High-speed synchronous communication</li>
                <li><strong>I2C</strong> - Multi-device two-wire communication</li>
                <li><strong>USART</strong> - Classic serial communication</li>
            </ul>

            <div class="info-box tip">
                <div class="info-box-title">💡 You're Ready!</div>
                <p>With these four drivers, you can interface with almost any sensor, display, or communication module. The skills you've learned apply to any microcontroller - the concepts are universal!</p>
            </div>
        `
    }
];

