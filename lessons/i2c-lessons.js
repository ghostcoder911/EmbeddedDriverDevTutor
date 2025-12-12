/**
 * I2C Driver Lessons
 * Step-by-step guide to writing an I2C driver from scratch
 */

window.i2cLessons = [
    // Step 1: Introduction
    {
        title: "Understanding I2C Protocol",
        content: `
            <h2>What is I2C?</h2>
            <p><strong>I2C</strong> (Inter-Integrated Circuit, pronounced "I-squared-C") is a two-wire serial communication protocol. It's widely used to connect sensors, EEPROMs, displays, and other low-speed peripherals.</p>

            <h2>I2C Characteristics</h2>
            <ul>
                <li><strong>Two-wire interface</strong> - Only SDA (data) and SCL (clock) needed</li>
                <li><strong>Multi-master, multi-slave</strong> - Multiple devices on same bus</li>
                <li><strong>Addressable</strong> - Each device has a unique 7-bit or 10-bit address</li>
                <li><strong>Half-duplex</strong> - Bidirectional on single data line</li>
                <li><strong>Acknowledgment</strong> - Receiver acknowledges each byte</li>
            </ul>

            <h2>I2C Signal Lines</h2>
            <table class="lesson-table">
                <tr>
                    <th>Signal</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><code>SDA</code></td>
                    <td>Serial Data</td>
                    <td>Bidirectional data line</td>
                </tr>
                <tr>
                    <td><code>SCL</code></td>
                    <td>Serial Clock</td>
                    <td>Clock signal (always from master)</td>
                </tr>
            </table>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">I2C Bus Topology</span>
                </div>
                <div class="code-content">
                    <pre><code>         VDD
          │
    ┌─────┴─────┐     ┌─────┴─────┐
    │   Pull-up │     │   Pull-up │
    └─────┬─────┘     └─────┬─────┘
          │                 │
    ──────┼─────────────────┼────── SDA
          │                 │
    ──────┼─────────────────┼────── SCL
          │                 │
     ┌────┴────┐       ┌────┴────┐       ┌────┴────┐
     │  MASTER │       │ SLAVE 1 │       │ SLAVE 2 │
     │  (STM32)│       │(Sensor) │       │(EEPROM) │
     │ Addr:-- │       │Addr:0x68│       │Addr:0x50│
     └─────────┘       └─────────┘       └─────────┘</code></pre>
                </div>
            </div>

            <div class="info-box note">
                <div class="info-box-title">📘 Open-Drain</div>
                <p>I2C uses open-drain outputs with pull-up resistors. Devices can only pull the line LOW - the pull-up resistors bring it HIGH. This allows multiple devices to share the bus safely.</p>
            </div>
        `
    },

    // Step 2: I2C Communication
    {
        title: "I2C Communication Sequence",
        content: `
            <h2>Basic I2C Transaction</h2>
            <p>Every I2C communication follows this sequence:</p>
            <ol>
                <li><strong>START condition</strong> - Master initiates communication</li>
                <li><strong>Address + R/W bit</strong> - Master sends slave address</li>
                <li><strong>ACK from slave</strong> - Slave acknowledges if present</li>
                <li><strong>Data transfer</strong> - One or more bytes</li>
                <li><strong>STOP condition</strong> - Master ends communication</li>
            </ol>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">I2C Write Transaction</span>
                </div>
                <div class="code-content">
                    <pre><code>    START   ADDRESS + W   ACK    DATA     ACK    DATA     ACK   STOP
      │         │          │       │        │       │        │      │
SDA ──┐    ┌───────────┐   │  ┌────────┐   │  ┌────────┐   │      │
      └────┤  7 bits   │───┴──┤ 8 bits │───┴──┤ 8 bits │───┴──────┘
           │  + R/W=0  │      │        │      │        │
           └───────────┘      └────────┘      └────────┘

SCL ──┐  ┌─┬─┬─┬─┬─┬─┬─┬─┐  ┌─┬─┬─┬─┬─┬─┬─┬─┐  ┌─┐
      └──┴─┴─┴─┴─┴─┴─┴─┴─┴──┴─┴─┴─┴─┴─┴─┴─┴─┴──┴─┘</code></pre>
                </div>
            </div>

            <h2>START and STOP Conditions</h2>
            <table class="lesson-table">
                <tr>
                    <th>Condition</th>
                    <th>SDA</th>
                    <th>SCL</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><strong>START</strong></td>
                    <td>HIGH → LOW</td>
                    <td>HIGH</td>
                    <td>SDA falls while SCL is high</td>
                </tr>
                <tr>
                    <td><strong>STOP</strong></td>
                    <td>LOW → HIGH</td>
                    <td>HIGH</td>
                    <td>SDA rises while SCL is high</td>
                </tr>
                <tr>
                    <td><strong>Repeated START</strong></td>
                    <td>HIGH → LOW</td>
                    <td>HIGH</td>
                    <td>New START without STOP</td>
                </tr>
            </table>

            <h2>Address Frame</h2>
            <p>The first byte after START contains the 7-bit slave address and R/W bit:</p>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Address Frame Format</span>
                </div>
                <div class="code-content">
                    <pre><code>┌────┬────┬────┬────┬────┬────┬────┬────┐
│ A6 │ A5 │ A4 │ A3 │ A2 │ A1 │ A0 │ R/W│
└────┴────┴────┴────┴────┴────┴────┴────┘
│←────── 7-bit Address ──────→│
                               │
                    0 = Write, 1 = Read</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Address Calculation</div>
                <p>If a sensor datasheet says address is 0x68, the write address is <code>0x68 << 1 | 0 = 0xD0</code> and read address is <code>0x68 << 1 | 1 = 0xD1</code>.</p>
            </div>
        `
    },

    // Step 3: STM32 I2C Peripheral
    {
        title: "STM32F446RE I2C Peripheral",
        content: `
            <h2>I2C Instances</h2>
            <table class="lesson-table">
                <tr>
                    <th>I2C</th>
                    <th>Base Address</th>
                    <th>Bus</th>
                </tr>
                <tr>
                    <td>I2C1</td>
                    <td><code>0x4000 5400</code></td>
                    <td>APB1</td>
                </tr>
                <tr>
                    <td>I2C2</td>
                    <td><code>0x4000 5800</code></td>
                    <td>APB1</td>
                </tr>
                <tr>
                    <td>I2C3</td>
                    <td><code>0x4000 5C00</code></td>
                    <td>APB1</td>
                </tr>
            </table>

            <h2>Key I2C Registers</h2>
            <table class="lesson-table">
                <tr>
                    <th>Register</th>
                    <th>Offset</th>
                    <th>Purpose</th>
                </tr>
                <tr>
                    <td><code>CR1</code></td>
                    <td>0x00</td>
                    <td>Control Register 1 - Main control</td>
                </tr>
                <tr>
                    <td><code>CR2</code></td>
                    <td>0x04</td>
                    <td>Control Register 2 - Frequency, interrupts</td>
                </tr>
                <tr>
                    <td><code>OAR1</code></td>
                    <td>0x08</td>
                    <td>Own Address Register 1</td>
                </tr>
                <tr>
                    <td><code>DR</code></td>
                    <td>0x10</td>
                    <td>Data Register</td>
                </tr>
                <tr>
                    <td><code>SR1</code></td>
                    <td>0x14</td>
                    <td>Status Register 1 - Event flags</td>
                </tr>
                <tr>
                    <td><code>SR2</code></td>
                    <td>0x18</td>
                    <td>Status Register 2 - Bus status</td>
                </tr>
                <tr>
                    <td><code>CCR</code></td>
                    <td>0x1C</td>
                    <td>Clock Control Register</td>
                </tr>
                <tr>
                    <td><code>TRISE</code></td>
                    <td>0x20</td>
                    <td>Rise Time Register</td>
                </tr>
            </table>

            <h2>I2C Speed Modes</h2>
            <table class="lesson-table">
                <tr>
                    <th>Mode</th>
                    <th>Speed</th>
                    <th>CCR F/S Bit</th>
                </tr>
                <tr>
                    <td>Standard Mode (SM)</td>
                    <td>100 kHz</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Fast Mode (FM)</td>
                    <td>400 kHz</td>
                    <td>1</td>
                </tr>
            </table>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Clock Configuration</div>
                <p>I2C clock speed depends on APB1 clock. You must configure FREQ bits in CR2 to match APB1 frequency, then calculate CCR value accordingly.</p>
            </div>
        `
    },

    // Step 4: Creating I2C Header
    {
        title: "Creating the I2C Driver Header",
        content: `
            <h2>Configuration Structure</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_i2c_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#ifndef</span> INC_STM32F446XX_I2C_DRIVER_H_
<span class="preprocessor">#define</span> INC_STM32F446XX_I2C_DRIVER_H_

<span class="preprocessor">#include</span> <span class="string">"stm32f446xx.h"</span>

<span class="comment">/*
 * Configuration structure for I2Cx peripheral
 */</span>
<span class="keyword">typedef struct</span>
{
    <span class="type">uint32_t</span> I2C_SCLSpeed;       <span class="comment">// Standard or Fast mode</span>
    <span class="type">uint8_t</span>  I2C_DeviceAddress;  <span class="comment">// Slave mode address (7-bit)</span>
    <span class="type">uint8_t</span>  I2C_ACKControl;     <span class="comment">// ACK enable/disable</span>
    <span class="type">uint8_t</span>  I2C_FMDutyCycle;    <span class="comment">// Fast mode duty cycle</span>
} <span class="type">I2C_Config_t</span>;</code></pre>
                </div>
            </div>

            <h2>Handle Structure</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_i2c_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * Handle structure for I2Cx peripheral
 */</span>
<span class="keyword">typedef struct</span>
{
    <span class="type">I2C_RegDef_t</span>  *pI2Cx;        <span class="comment">// Pointer to I2C peripheral</span>
    <span class="type">I2C_Config_t</span>  I2C_Config;   <span class="comment">// Configuration settings</span>
    
    <span class="comment">// For interrupt-based communication</span>
    <span class="type">uint8_t</span>       *pTxBuffer;    <span class="comment">// TX buffer pointer</span>
    <span class="type">uint8_t</span>       *pRxBuffer;    <span class="comment">// RX buffer pointer</span>
    <span class="type">uint32_t</span>      TxLen;         <span class="comment">// TX length</span>
    <span class="type">uint32_t</span>      RxLen;         <span class="comment">// RX length</span>
    <span class="type">uint8_t</span>       TxRxState;     <span class="comment">// Communication state</span>
    <span class="type">uint8_t</span>       DevAddr;       <span class="comment">// Slave device address</span>
    <span class="type">uint32_t</span>      RxSize;        <span class="comment">// RX size</span>
    <span class="type">uint8_t</span>       Sr;            <span class="comment">// Repeated start value</span>
} <span class="type">I2C_Handle_t</span>;</code></pre>
                </div>
            </div>

            <h2>Configuration Macros</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_i2c_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*
 * @I2C_SCLSpeed
 */</span>
<span class="preprocessor">#define</span> I2C_SCL_SPEED_SM       <span class="number">100000</span>   <span class="comment">// Standard mode 100kHz</span>
<span class="preprocessor">#define</span> I2C_SCL_SPEED_FM4K     <span class="number">400000</span>   <span class="comment">// Fast mode 400kHz</span>
<span class="preprocessor">#define</span> I2C_SCL_SPEED_FM2K     <span class="number">200000</span>   <span class="comment">// Fast mode 200kHz</span>

<span class="comment">/*
 * @I2C_ACKControl
 */</span>
<span class="preprocessor">#define</span> I2C_ACK_ENABLE         <span class="number">1</span>
<span class="preprocessor">#define</span> I2C_ACK_DISABLE        <span class="number">0</span>

<span class="comment">/*
 * @I2C_FMDutyCycle
 */</span>
<span class="preprocessor">#define</span> I2C_FM_DUTY_2          <span class="number">0</span>        <span class="comment">// Tlow/Thigh = 2</span>
<span class="preprocessor">#define</span> I2C_FM_DUTY_16_9       <span class="number">1</span>        <span class="comment">// Tlow/Thigh = 16/9</span>

<span class="comment">/*
 * I2C Status Register 1 flags
 */</span>
<span class="preprocessor">#define</span> I2C_FLAG_SB            (<span class="number">1</span> << <span class="number">0</span>)  <span class="comment">// Start bit (Master)</span>
<span class="preprocessor">#define</span> I2C_FLAG_ADDR          (<span class="number">1</span> << <span class="number">1</span>)  <span class="comment">// Address sent/matched</span>
<span class="preprocessor">#define</span> I2C_FLAG_BTF           (<span class="number">1</span> << <span class="number">2</span>)  <span class="comment">// Byte transfer finished</span>
<span class="preprocessor">#define</span> I2C_FLAG_STOPF         (<span class="number">1</span> << <span class="number">4</span>)  <span class="comment">// Stop detection (Slave)</span>
<span class="preprocessor">#define</span> I2C_FLAG_RXNE          (<span class="number">1</span> << <span class="number">6</span>)  <span class="comment">// RX not empty</span>
<span class="preprocessor">#define</span> I2C_FLAG_TXE           (<span class="number">1</span> << <span class="number">7</span>)  <span class="comment">// TX empty</span>
<span class="preprocessor">#define</span> I2C_FLAG_BERR          (<span class="number">1</span> << <span class="number">8</span>)  <span class="comment">// Bus error</span>
<span class="preprocessor">#define</span> I2C_FLAG_ARLO          (<span class="number">1</span> << <span class="number">9</span>)  <span class="comment">// Arbitration lost</span>
<span class="preprocessor">#define</span> I2C_FLAG_AF            (<span class="number">1</span> << <span class="number">10</span>) <span class="comment">// Acknowledge failure</span>
<span class="preprocessor">#define</span> I2C_FLAG_OVR           (<span class="number">1</span> << <span class="number">11</span>) <span class="comment">// Overrun/Underrun</span></code></pre>
                </div>
            </div>
        `
    },

    // Step 5: I2C API Functions
    {
        title: "I2C API Function Prototypes",
        content: `
            <h2>Complete API Declaration</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_i2c_driver.h</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="comment">/*************************************************************
 *                 APIs supported by this driver
 *************************************************************/</span>

<span class="comment">/*
 * Peripheral Clock Setup
 */</span>
<span class="type">void</span> <span class="function">I2C_PeriClockControl</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx, <span class="type">uint8_t</span> EnorDi);

<span class="comment">/*
 * Init and De-init
 */</span>
<span class="type">void</span> <span class="function">I2C_Init</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle);
<span class="type">void</span> <span class="function">I2C_DeInit</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx);

<span class="comment">/*
 * Data Send and Receive (Master mode - Blocking)
 */</span>
<span class="type">void</span> <span class="function">I2C_MasterSendData</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle, <span class="type">uint8_t</span> *pTxBuffer, 
                        <span class="type">uint32_t</span> Len, <span class="type">uint8_t</span> SlaveAddr, <span class="type">uint8_t</span> Sr);
<span class="type">void</span> <span class="function">I2C_MasterReceiveData</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle, <span class="type">uint8_t</span> *pRxBuffer, 
                          <span class="type">uint32_t</span> Len, <span class="type">uint8_t</span> SlaveAddr, <span class="type">uint8_t</span> Sr);

<span class="comment">/*
 * Data Send and Receive (Master mode - Interrupt)
 */</span>
<span class="type">uint8_t</span> <span class="function">I2C_MasterSendDataIT</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle, <span class="type">uint8_t</span> *pTxBuffer,
                             <span class="type">uint32_t</span> Len, <span class="type">uint8_t</span> SlaveAddr, <span class="type">uint8_t</span> Sr);
<span class="type">uint8_t</span> <span class="function">I2C_MasterReceiveDataIT</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle, <span class="type">uint8_t</span> *pRxBuffer,
                               <span class="type">uint32_t</span> Len, <span class="type">uint8_t</span> SlaveAddr, <span class="type">uint8_t</span> Sr);

<span class="comment">/*
 * Slave mode APIs
 */</span>
<span class="type">void</span> <span class="function">I2C_SlaveSendData</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx, <span class="type">uint8_t</span> data);
<span class="type">uint8_t</span> <span class="function">I2C_SlaveReceiveData</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx);

<span class="comment">/*
 * IRQ Configuration and ISR Handling
 */</span>
<span class="type">void</span> <span class="function">I2C_IRQInterruptConfig</span>(<span class="type">uint8_t</span> IRQNumber, <span class="type">uint8_t</span> EnorDi);
<span class="type">void</span> <span class="function">I2C_IRQPriorityConfig</span>(<span class="type">uint8_t</span> IRQNumber, <span class="type">uint32_t</span> IRQPriority);
<span class="type">void</span> <span class="function">I2C_EV_IRQHandling</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle);  <span class="comment">// Event IRQ</span>
<span class="type">void</span> <span class="function">I2C_ER_IRQHandling</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle);  <span class="comment">// Error IRQ</span>

<span class="comment">/*
 * Other Peripheral Control APIs
 */</span>
<span class="type">void</span> <span class="function">I2C_PeripheralControl</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx, <span class="type">uint8_t</span> EnorDi);
<span class="type">uint8_t</span> <span class="function">I2C_GetFlagStatus</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx, <span class="type">uint32_t</span> FlagName);
<span class="type">void</span> <span class="function">I2C_ManageAcking</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx, <span class="type">uint8_t</span> EnorDi);
<span class="type">void</span> <span class="function">I2C_GenerateStopCondition</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx);
<span class="type">void</span> <span class="function">I2C_SlaveEnableDisableCallbackEvents</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx, <span class="type">uint8_t</span> EnorDi);

<span class="comment">/*
 * Application Callback
 */</span>
<span class="type">void</span> <span class="function">I2C_ApplicationEventCallback</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle, <span class="type">uint8_t</span> AppEvent);</code></pre>
                </div>
            </div>

            <div class="info-box note">
                <div class="info-box-title">📘 Two IRQ Handlers</div>
                <p>STM32 I2C has separate interrupts for events (EV) and errors (ER). Both need to be handled for robust communication.</p>
            </div>
        `
    },

    // Step 6: I2C Init Implementation
    {
        title: "Implementing I2C Initialization",
        content: `
            <h2>Clock Calculation</h2>
            <p>The most complex part of I2C init is calculating the clock values:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">CCR Calculation Formula</span>
                </div>
                <div class="code-content">
                    <pre><code>Standard Mode (100 kHz):
  CCR = F_PCLK1 / (2 × F_SCL)
  
  Example: PCLK1 = 16 MHz, SCL = 100 kHz
  CCR = 16,000,000 / (2 × 100,000) = 80

Fast Mode (400 kHz):
  DUTY = 0: CCR = F_PCLK1 / (3 × F_SCL)
  DUTY = 1: CCR = F_PCLK1 / (25 × F_SCL)
  
TRISE = (Maximum rise time / T_PCLK1) + 1
  SM: Max rise time = 1000 ns
  FM: Max rise time = 300 ns</code></pre>
                </div>
            </div>

            <h2>I2C_Init Implementation</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_i2c_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="type">void</span> <span class="function">I2C_Init</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle)
{
    <span class="type">uint32_t</span> tempreg = <span class="number">0</span>;

    <span class="comment">// Enable clock for I2C peripheral</span>
    I2C_PeriClockControl(pI2CHandle->pI2Cx, ENABLE);

    <span class="comment">// 1. Configure FREQ field in CR2</span>
    tempreg = <span class="number">0</span>;
    tempreg |= RCC_GetPCLK1Value() / <span class="number">1000000U</span>;  <span class="comment">// APB1 clock in MHz</span>
    pI2CHandle->pI2Cx->CR2 = (tempreg & <span class="number">0x3F</span>);

    <span class="comment">// 2. Configure device own address (for slave mode)</span>
    tempreg = <span class="number">0</span>;
    tempreg |= pI2CHandle->I2C_Config.I2C_DeviceAddress << <span class="number">1</span>;
    tempreg |= (<span class="number">1</span> << <span class="number">14</span>);  <span class="comment">// Bit 14 should always be 1</span>
    pI2CHandle->pI2Cx->OAR1 = tempreg;

    <span class="comment">// 3. Calculate and configure CCR</span>
    <span class="type">uint16_t</span> ccr_value = <span class="number">0</span>;
    tempreg = <span class="number">0</span>;
    
    <span class="keyword">if</span> (pI2CHandle->I2C_Config.I2C_SCLSpeed <= I2C_SCL_SPEED_SM)
    {
        <span class="comment">// Standard mode</span>
        ccr_value = RCC_GetPCLK1Value() / (<span class="number">2</span> * pI2CHandle->I2C_Config.I2C_SCLSpeed);
        tempreg |= (ccr_value & <span class="number">0xFFF</span>);
    }
    <span class="keyword">else</span>
    {
        <span class="comment">// Fast mode</span>
        tempreg |= (<span class="number">1</span> << <span class="number">15</span>);  <span class="comment">// Set F/S bit for fast mode</span>
        tempreg |= (pI2CHandle->I2C_Config.I2C_FMDutyCycle << <span class="number">14</span>);
        
        <span class="keyword">if</span> (pI2CHandle->I2C_Config.I2C_FMDutyCycle == I2C_FM_DUTY_2)
        {
            ccr_value = RCC_GetPCLK1Value() / (<span class="number">3</span> * pI2CHandle->I2C_Config.I2C_SCLSpeed);
        }
        <span class="keyword">else</span>
        {
            ccr_value = RCC_GetPCLK1Value() / (<span class="number">25</span> * pI2CHandle->I2C_Config.I2C_SCLSpeed);
        }
        tempreg |= (ccr_value & <span class="number">0xFFF</span>);
    }
    pI2CHandle->pI2Cx->CCR = tempreg;

    <span class="comment">// 4. Configure TRISE</span>
    <span class="keyword">if</span> (pI2CHandle->I2C_Config.I2C_SCLSpeed <= I2C_SCL_SPEED_SM)
    {
        <span class="comment">// Standard mode: max rise time = 1000ns</span>
        tempreg = (RCC_GetPCLK1Value() / <span class="number">1000000U</span>) + <span class="number">1</span>;
    }
    <span class="keyword">else</span>
    {
        <span class="comment">// Fast mode: max rise time = 300ns</span>
        tempreg = ((RCC_GetPCLK1Value() * <span class="number">300</span>) / <span class="number">1000000000U</span>) + <span class="number">1</span>;
    }
    pI2CHandle->pI2Cx->TRISE = (tempreg & <span class="number">0x3F</span>);
}</code></pre>
                </div>
            </div>

            <div class="info-box warning">
                <div class="info-box-title">⚠️ Don't Enable PE Yet!</div>
                <p>The peripheral enable (PE) bit in CR1 should be set AFTER all configuration is complete, typically just before starting communication.</p>
            </div>
        `
    },

    // Step 7: Master Send/Receive
    {
        title: "Implementing Master Send/Receive",
        content: `
            <h2>Master Send Data (Blocking)</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_i2c_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="type">void</span> <span class="function">I2C_MasterSendData</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle, <span class="type">uint8_t</span> *pTxBuffer,
                        <span class="type">uint32_t</span> Len, <span class="type">uint8_t</span> SlaveAddr, <span class="type">uint8_t</span> Sr)
{
    <span class="comment">// 1. Generate START condition</span>
    I2C_GenerateStartCondition(pI2CHandle->pI2Cx);

    <span class="comment">// 2. Wait until SB flag is set (START generated)</span>
    <span class="keyword">while</span> (!I2C_GetFlagStatus(pI2CHandle->pI2Cx, I2C_FLAG_SB));

    <span class="comment">// 3. Send slave address with R/W bit = 0 (Write)</span>
    I2C_ExecuteAddressPhaseWrite(pI2CHandle->pI2Cx, SlaveAddr);

    <span class="comment">// 4. Wait until ADDR flag is set</span>
    <span class="keyword">while</span> (!I2C_GetFlagStatus(pI2CHandle->pI2Cx, I2C_FLAG_ADDR));

    <span class="comment">// 5. Clear ADDR flag by reading SR1 then SR2</span>
    I2C_ClearADDRFlag(pI2CHandle);

    <span class="comment">// 6. Send data until Len = 0</span>
    <span class="keyword">while</span> (Len > <span class="number">0</span>)
    {
        <span class="comment">// Wait for TXE (TX buffer empty)</span>
        <span class="keyword">while</span> (!I2C_GetFlagStatus(pI2CHandle->pI2Cx, I2C_FLAG_TXE));
        
        pI2CHandle->pI2Cx->DR = *pTxBuffer;
        pTxBuffer++;
        Len--;
    }

    <span class="comment">// 7. Wait for TXE and BTF before generating STOP</span>
    <span class="keyword">while</span> (!I2C_GetFlagStatus(pI2CHandle->pI2Cx, I2C_FLAG_TXE));
    <span class="keyword">while</span> (!I2C_GetFlagStatus(pI2CHandle->pI2Cx, I2C_FLAG_BTF));

    <span class="comment">// 8. Generate STOP condition (unless repeated start requested)</span>
    <span class="keyword">if</span> (Sr == I2C_DISABLE_SR)
    {
        I2C_GenerateStopCondition(pI2CHandle->pI2Cx);
    }
}</code></pre>
                </div>
            </div>

            <h2>Helper Functions</h2>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">stm32f446xx_i2c_driver.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="keyword">static</span> <span class="type">void</span> <span class="function">I2C_GenerateStartCondition</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx)
{
    pI2Cx->CR1 |= (<span class="number">1</span> << <span class="number">8</span>);  <span class="comment">// Set START bit</span>
}

<span class="type">void</span> <span class="function">I2C_GenerateStopCondition</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx)
{
    pI2Cx->CR1 |= (<span class="number">1</span> << <span class="number">9</span>);  <span class="comment">// Set STOP bit</span>
}

<span class="keyword">static</span> <span class="type">void</span> <span class="function">I2C_ExecuteAddressPhaseWrite</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx, <span class="type">uint8_t</span> SlaveAddr)
{
    SlaveAddr = SlaveAddr << <span class="number">1</span>;  <span class="comment">// Make room for R/W bit</span>
    SlaveAddr &= ~(<span class="number">1</span>);           <span class="comment">// Clear R/W bit (Write)</span>
    pI2Cx->DR = SlaveAddr;
}

<span class="keyword">static</span> <span class="type">void</span> <span class="function">I2C_ExecuteAddressPhaseRead</span>(<span class="type">I2C_RegDef_t</span> *pI2Cx, <span class="type">uint8_t</span> SlaveAddr)
{
    SlaveAddr = SlaveAddr << <span class="number">1</span>;  <span class="comment">// Make room for R/W bit</span>
    SlaveAddr |= <span class="number">1</span>;              <span class="comment">// Set R/W bit (Read)</span>
    pI2Cx->DR = SlaveAddr;
}

<span class="keyword">static</span> <span class="type">void</span> <span class="function">I2C_ClearADDRFlag</span>(<span class="type">I2C_Handle_t</span> *pI2CHandle)
{
    <span class="type">uint32_t</span> dummy_read;
    
    <span class="comment">// Read SR1 and SR2 to clear ADDR flag</span>
    dummy_read = pI2CHandle->pI2Cx->SR1;
    dummy_read = pI2CHandle->pI2Cx->SR2;
    (<span class="type">void</span>)dummy_read;  <span class="comment">// Avoid unused variable warning</span>
}</code></pre>
                </div>
            </div>

            <div class="info-box tip">
                <div class="info-box-title">💡 Clearing Flags</div>
                <p>Many I2C flags are cleared by specific read sequences (like reading SR1 then SR2 for ADDR). Always check the reference manual for the correct clearing procedure!</p>
            </div>
        `
    },

    // Step 8: Testing I2C
    {
        title: "Testing Your I2C Driver",
        content: `
            <h2>Test: Reading from a Sensor</h2>
            <p>Let's test with a common I2C sensor (e.g., MPU6050 accelerometer):</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">i2c_test.c</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code><span class="preprocessor">#include</span> <span class="string">"stm32f446xx_gpio_driver.h"</span>
<span class="preprocessor">#include</span> <span class="string">"stm32f446xx_i2c_driver.h"</span>

<span class="preprocessor">#define</span> MPU6050_ADDR    <span class="number">0x68</span>
<span class="preprocessor">#define</span> WHO_AM_I_REG   <span class="number">0x75</span>

<span class="type">I2C_Handle_t</span> I2C1Handle;

<span class="type">void</span> <span class="function">I2C1_GPIOInit</span>(<span class="type">void</span>)
{
    <span class="type">GPIO_Handle_t</span> I2CPins;

    I2CPins.pGPIOx = GPIOB;
    I2CPins.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_ALTFN;
    I2CPins.GPIO_PinConfig.GPIO_PinOPType = GPIO_OP_TYPE_OD;  <span class="comment">// Open-drain!</span>
    I2CPins.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PU; <span class="comment">// Pull-up</span>
    I2CPins.GPIO_PinConfig.GPIO_PinAltFunMode = <span class="number">4</span>;            <span class="comment">// AF4 for I2C</span>
    I2CPins.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;

    GPIO_PeriClockControl(GPIOB, ENABLE);

    <span class="comment">// SCL - PB6</span>
    I2CPins.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_6;
    GPIO_Init(&I2CPins);

    <span class="comment">// SDA - PB7</span>
    I2CPins.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_7;
    GPIO_Init(&I2CPins);
}

<span class="type">void</span> <span class="function">I2C1_Init</span>(<span class="type">void</span>)
{
    I2C1Handle.pI2Cx = I2C1;
    I2C1Handle.I2C_Config.I2C_ACKControl = I2C_ACK_ENABLE;
    I2C1Handle.I2C_Config.I2C_DeviceAddress = <span class="number">0x61</span>;  <span class="comment">// Our address (if slave)</span>
    I2C1Handle.I2C_Config.I2C_FMDutyCycle = I2C_FM_DUTY_2;
    I2C1Handle.I2C_Config.I2C_SCLSpeed = I2C_SCL_SPEED_SM;

    I2C_Init(&I2C1Handle);
}

<span class="type">int</span> <span class="function">main</span>(<span class="type">void</span>)
{
    <span class="type">uint8_t</span> reg_addr = WHO_AM_I_REG;
    <span class="type">uint8_t</span> data;

    <span class="comment">// Initialize GPIO and I2C</span>
    I2C1_GPIOInit();
    I2C1_Init();

    <span class="comment">// Enable I2C peripheral</span>
    I2C_PeripheralControl(I2C1, ENABLE);

    <span class="comment">// Enable ACKing</span>
    I2C_ManageAcking(I2C1, I2C_ACK_ENABLE);

    <span class="comment">// Send register address we want to read</span>
    I2C_MasterSendData(&I2C1Handle, &reg_addr, <span class="number">1</span>, MPU6050_ADDR, I2C_ENABLE_SR);

    <span class="comment">// Receive data from sensor</span>
    I2C_MasterReceiveData(&I2C1Handle, &data, <span class="number">1</span>, MPU6050_ADDR, I2C_DISABLE_SR);

    <span class="comment">// data should now contain WHO_AM_I value (0x68 for MPU6050)</span>

    <span class="keyword">while</span> (<span class="number">1</span>);

    <span class="keyword">return</span> <span class="number">0</span>;
}</code></pre>
                </div>
            </div>

            <h2>🎉 Congratulations!</h2>
            <p>You've built a working I2C driver! Key takeaways:</p>
            <ul>
                <li>I2C uses START, address, data, STOP sequence</li>
                <li>Clock calculation involves CCR and TRISE registers</li>
                <li>Flags must be cleared in specific ways</li>
                <li>GPIO must be configured as open-drain with pull-ups</li>
            </ul>

            <div class="info-box tip">
                <div class="info-box-title">💡 Next Steps</div>
                <p>Try implementing interrupt-based I2C for more efficient CPU usage, or add slave mode support to make your STM32 act as an I2C slave device!</p>
            </div>
        `
    }
];

