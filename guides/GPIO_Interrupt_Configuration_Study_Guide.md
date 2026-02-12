# STM32F407xx GPIO Interrupt Configuration - Detailed Study Guide

## Table of Contents
1. [Introduction to GPIO Interrupts](#introduction)
2. [Hardware Architecture Overview](#hardware-architecture)
3. [Key Components and Peripherals](#key-components)
4. [Driver Implementation Analysis](#driver-implementation)
5. [Configuration Steps](#configuration-steps)
6. [Coding Examples](#coding-examples)
7. [Common Pitfalls and Best Practices](#best-practices)

---

## 1. Introduction to GPIO Interrupts {#introduction}

### What are GPIO Interrupts?
GPIO (General Purpose Input/Output) interrupts allow the microcontroller to respond to external events (like button presses, sensor signals) without continuously polling the GPIO pins. This results in:
- **Lower power consumption** - CPU can sleep until an interrupt occurs
- **Faster response time** - Immediate reaction to external events
- **Better CPU utilization** - CPU can execute other tasks

### Interrupt vs Polling
```
Polling Method (Inefficient):
while(1) {
    if(GPIO_ReadPin() == PRESSED) {
        // Handle event
    }
    // CPU is constantly busy checking
}

Interrupt Method (Efficient):
// CPU does other work or sleeps
// When event occurs -> Interrupt fires -> ISR executes
```

---

## 2. Hardware Architecture Overview {#hardware-architecture}

### STM32F407xx Interrupt System Components

The GPIO interrupt system involves three major hardware blocks:

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐      ┌─────────┐
│   GPIO Pin  │─────>│    SYSCFG    │─────>│     EXTI     │─────>│  NVIC   │─────> CPU
│   (PA0-PI15)│      │ (Multiplexer)│      │ (Controller) │      │ (Core)  │
└─────────────┘      └──────────────┘      └──────────────┘      └─────────┘
```

#### 2.1 GPIO (General Purpose Input/Output)
- Physical pins on the microcontroller
- 9 ports (A-I) with up to 16 pins each
- Each pin can be configured as input, output, alternate function, or analog

#### 2.2 SYSCFG (System Configuration Controller)
- **Purpose**: Multiplexes GPIO pins to EXTI lines
- **Why needed?**: Multiple GPIO pins share the same EXTI line
  - Example: PA0, PB0, PC0, PD0, PE0, PF0, PG0, PH0, PI0 all map to EXTI0
- **Register**: SYSCFG_EXTICR[0:3] - 4 registers, each controlling 4 EXTI lines
- **Bus**: Connected to APB2 bus at address 0x40013800

#### 2.3 EXTI (External Interrupt/Event Controller)
- **Purpose**: Detects edges (rising/falling) and generates interrupt requests
- **Lines**: 23 EXTI lines (0-22)
  - EXTI0-15: Connected to GPIO pins
  - EXTI16-22: Connected to internal peripherals
- **Key Registers**:
  - **IMR** (Interrupt Mask Register): Enables/disables interrupt
  - **RTSR** (Rising Trigger Selection Register): Enables rising edge detection
  - **FTSR** (Falling Trigger Selection Register): Enables falling edge detection
  - **PR** (Pending Register): Indicates pending interrupt (must be cleared in ISR)

#### 2.4 NVIC (Nested Vectored Interrupt Controller)
- **Purpose**: ARM Cortex-M4 interrupt controller
- **Features**:
  - Manages all interrupts in the system
  - Supports priority levels (0-15, where 0 is highest)
  - Only 4 priority bits implemented in STM32F407xx
- **Key Registers**:
  - **ISER** (Interrupt Set Enable Register): Enables interrupt at NVIC level
  - **ICER** (Interrupt Clear Enable Register): Disables interrupt
  - **IPR** (Interrupt Priority Register): Sets priority level

---

## 3. Key Components and Peripherals {#key-components}

### 3.1 Memory Mapped Register Addresses

From the reference manual (RM0390) and driver code:

```c
// ARM Cortex-M4 NVIC Registers (Processor specific)
#define NVIC_ISER0          ( (__vo uint32_t*)0xE000E100 )  // IRQ 0-31
#define NVIC_ISER1          ( (__vo uint32_t*)0xE000E104 )  // IRQ 32-63
#define NVIC_ISER2          ( (__vo uint32_t*)0xE000E108 )  // IRQ 64-95

#define NVIC_ICER0          ( (__vo uint32_t*)0xE000E180 )  // IRQ 0-31
#define NVIC_ICER1          ( (__vo uint32_t*)0xE000E184 )  // IRQ 32-63
#define NVIC_ICER2          ( (__vo uint32_t*)0xE000E188 )  // IRQ 64-95

#define NVIC_PR_BASE_ADDR   ( (__vo uint32_t*)0xE000E400 )  // Priority registers

// APB2 Peripheral Addresses (STM32F407xx specific)
#define APB2PERIPH_BASEADDR     0x40010000U
#define EXTI_BASEADDR          (APB2PERIPH_BASEADDR + 0x3C00)  // 0x40013C00
#define SYSCFG_BASEADDR        (APB2PERIPH_BASEADDR + 0x3800)  // 0x40013800
```

### 3.2 EXTI Register Structure

```c
typedef struct
{
    __vo uint32_t IMR;     // Interrupt Mask Register         - Offset: 0x00
    __vo uint32_t EMR;     // Event Mask Register             - Offset: 0x04
    __vo uint32_t RTSR;    // Rising Trigger Selection Reg    - Offset: 0x08
    __vo uint32_t FTSR;    // Falling Trigger Selection Reg   - Offset: 0x0C
    __vo uint32_t SWIER;   // Software Interrupt Event Reg    - Offset: 0x10
    __vo uint32_t PR;      // Pending Register                - Offset: 0x14
} EXTI_RegDef_t;
```

#### Register Details:

**IMR (Interrupt Mask Register)**
- Bit position corresponds to EXTI line number
- `1` = Interrupt enabled, `0` = Interrupt masked
- Example: `IMR |= (1 << 5)` enables EXTI5 interrupt

**RTSR (Rising Trigger Selection Register)**
- `1` = Rising edge detection enabled
- `0` = Rising edge detection disabled

**FTSR (Falling Trigger Selection Register)**
- `1` = Falling edge detection enabled
- `0` = Falling edge detection disabled
- Can enable both RTSR and FTSR for both edges

**PR (Pending Register)**
- Read: `1` = Interrupt pending, `0` = No interrupt
- Write: `1` = Clear pending bit (RC_W1 - Read/Clear by writing 1)
- **CRITICAL**: Must be cleared in ISR, otherwise interrupt keeps firing

### 3.3 SYSCFG Register Structure

```c
typedef struct
{
    __vo uint32_t MEMRMP;           // Memory Remap Register       - Offset: 0x00
    __vo uint32_t PMC;              // Peripheral Mode Config      - Offset: 0x04
    __vo uint32_t EXTICR[4];        // External Interrupt Config   - Offset: 0x08-0x14
    uint32_t      RESERVED1[2];     // Reserved                    - Offset: 0x18-0x1C
    __vo uint32_t CMPCR;            // Compensation Cell Control   - Offset: 0x20
} SYSCFG_RegDef_t;
```

#### SYSCFG_EXTICR Register Mapping:

Each EXTICR register controls 4 EXTI lines (4 bits per line):

```
EXTICR[0]: Controls EXTI0, EXTI1, EXTI2, EXTI3
EXTICR[1]: Controls EXTI4, EXTI5, EXTI6, EXTI7
EXTICR[2]: Controls EXTI8, EXTI9, EXTI10, EXTI11
EXTICR[3]: Controls EXTI12, EXTI13, EXTI14, EXTI15

Bit Layout (for each EXTI line):
EXTICR[x] = [EXTIy+3][EXTIy+2][EXTIy+1][EXTIy]
            31...28   27...24  23...20  19...16   15...12  11...8   7...4    3...0

Port Code Values:
0000: PA[x] pin
0001: PB[x] pin
0010: PC[x] pin
0011: PD[x] pin
0100: PE[x] pin
0101: PF[x] pin
0110: PG[x] pin
0111: PH[x] pin
1000: PI[x] pin
```

**Example**: To configure PD5 for EXTI5
```
EXTI line = 5
EXTICR register index = 5 / 4 = 1 (EXTICR[1])
Bit position = (5 % 4) * 4 = 4
Port code for GPIOD = 0011 (3)

SYSCFG->EXTICR[1] |= (3 << 4);  // Bits 7:4 = 0011
```

### 3.4 GPIO Pin to EXTI Line Mapping

```
Pin Number (0-15) → EXTI Line (0-15)
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│ PA0     │ PB0     │ PC0     │ PD0     │ ...PI0  │ → EXTI0
│ PA1     │ PB1     │ PC1     │ PD1     │ ...PI1  │ → EXTI1
│ PA2     │ PB2     │ PC2     │ PD2     │ ...PI2  │ → EXTI2
│   ...   │   ...   │   ...   │   ...   │   ...   │
│ PA15    │ PB15    │ PC15    │ PD15    │ ...PI15 │ → EXTI15
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

**Important**: Only ONE port pin can be connected to an EXTI line at a time!
- ✅ Valid: PA0 and PB1 (different EXTI lines)
- ❌ Invalid: PA0 and PB0 simultaneously (same EXTI line 0)

### 3.5 EXTI to NVIC IRQ Mapping

From reference manual, EXTI lines map to NVIC IRQ numbers:

```c
#define IRQ_NO_EXTI0        6      // EXTI Line 0
#define IRQ_NO_EXTI1        7      // EXTI Line 1
#define IRQ_NO_EXTI2        8      // EXTI Line 2
#define IRQ_NO_EXTI3        9      // EXTI Line 3
#define IRQ_NO_EXTI4        10     // EXTI Line 4
#define IRQ_NO_EXTI9_5      23     // EXTI Lines 5-9 (shared)
#define IRQ_NO_EXTI15_10    40     // EXTI Lines 10-15 (shared)
```

**Note**: 
- EXTI0-4: Each has dedicated IRQ
- EXTI5-9: Share common IRQ (IRQ 23)
- EXTI10-15: Share common IRQ (IRQ 40)

For shared IRQs, check EXTI->PR register in ISR to determine which line triggered.

---

## 4. Driver Implementation Analysis {#driver-implementation}

### 4.1 GPIO Configuration Structure

```c
// Pin configuration structure
typedef struct
{
    uint8_t GPIO_PinNumber;        // Pin number (0-15)
    uint8_t GPIO_PinMode;          // Mode: Input, Output, Alternate, Analog, IT_FT, IT_RT, IT_RFT
    uint8_t GPIO_PinSpeed;         // Speed: Low, Medium, Fast, High
    uint8_t GPIO_PinPuPdControl;   // Pull-up/Pull-down: No-PUPD, Pull-up, Pull-down
    uint8_t GPIO_PinOPType;        // Output type: Push-pull, Open-drain
    uint8_t GPIO_PinAltFunMode;    // Alternate function (0-15)
} GPIO_PinConfig_t;

// GPIO handle structure
typedef struct
{
    GPIO_RegDef_t *pGPIOx;             // Pointer to GPIO port base address
    GPIO_PinConfig_t GPIO_PinConfig;   // Pin configuration
} GPIO_Handle_t;
```

### 4.2 GPIO Pin Modes for Interrupts

```c
// From stm32f407xx_gpio_driver.h
#define GPIO_MODE_IN        0      // Input mode
#define GPIO_MODE_OUT       1      // Output mode
#define GPIO_MODE_ALTFN     2      // Alternate function mode
#define GPIO_MODE_ANALOG    3      // Analog mode
#define GPIO_MODE_IT_FT     4      // Interrupt Falling edge Trigger
#define GPIO_MODE_IT_RT     5      // Interrupt Rising edge Trigger
#define GPIO_MODE_IT_RFT    6      // Interrupt Rising and Falling edge Trigger
```

These modes (4-6) indicate interrupt modes and trigger special configuration in `GPIO_Init()`.

### 4.3 GPIO_Init() Function - Interrupt Configuration Section

```c
void GPIO_Init(GPIO_Handle_t *pGPIOHandle)
{
    // ... other configurations ...
    
    // Check if mode is interrupt mode (value > 3)
    if(pGPIOHandle->GPIO_PinConfig.GPIO_PinMode > GPIO_MODE_ANALOG)
    {
        // ============== STEP 1: Configure EXTI Trigger Type ==============
        
        if(pGPIOHandle->GPIO_PinConfig.GPIO_PinMode == GPIO_MODE_IT_FT)
        {
            // Configure Falling Trigger
            EXTI->FTSR |= (1 << pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber);
            // Clear Rising Trigger (ensure it's not set)
            EXTI->RTSR &= ~(1 << pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber);
        }
        else if(pGPIOHandle->GPIO_PinConfig.GPIO_PinMode == GPIO_MODE_IT_RT)
        {
            // Configure Rising Trigger
            EXTI->RTSR |= (1 << pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber);
            // Clear Falling Trigger
            EXTI->FTSR &= ~(1 << pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber);
        }
        else if(pGPIOHandle->GPIO_PinConfig.GPIO_PinMode == GPIO_MODE_IT_RFT)
        {
            // Configure both Rising and Falling Trigger
            EXTI->RTSR |= (1 << pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber);
            EXTI->FTSR |= (1 << pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber);
        }
        
        // ============== STEP 2: Configure SYSCFG for GPIO-EXTI Connection ==============
        
        // Calculate which EXTICR register (0-3)
        uint8_t temp1 = pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber / 4;
        
        // Calculate bit position within that register (0, 4, 8, or 12)
        uint8_t temp2 = pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber % 4;
        
        // Get port code (0-8 for ports A-I)
        uint8_t portcode = GPIO_BASEADDR_TO_CODE(pGPIOHandle->pGPIOx);
        
        // Enable SYSCFG clock (required before accessing SYSCFG registers)
        SYSCFG_PCLK_EN();
        
        // Configure SYSCFG_EXTICR to connect GPIO port to EXTI line
        SYSCFG->EXTICR[temp1] = portcode << (temp2 * 4);
        
        // ============== STEP 3: Enable EXTI Interrupt Delivery ==============
        
        // Set bit in IMR to unmask/enable interrupt
        EXTI->IMR |= (1 << pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber);
    }
    
    // ... other configurations (speed, pull-up/down, output type, alternate function) ...
}
```

#### Detailed Breakdown:

**Step 1: EXTI Trigger Configuration**
- Configures when interrupt should trigger
- Sets FTSR bit for falling edge
- Sets RTSR bit for rising edge
- Sets both for both edges
- **Important**: Always clear opposite trigger bit to avoid unwanted triggers

**Step 2: SYSCFG Configuration**
- Calculation explanation for Pin 5:
  ```
  Pin Number = 5
  temp1 = 5 / 4 = 1        → Use EXTICR[1]
  temp2 = 5 % 4 = 1        → Use bits [7:4] (second group)
  portcode = 3 (for GPIOD) → Port D
  
  SYSCFG->EXTICR[1] = 3 << (1 * 4)
                    = 3 << 4
                    = 0x00000030  (bits 7:4 = 0011)
  ```
- **Clock Enable**: SYSCFG needs clock enabled before access
- **Note**: Code shown overwrites entire register (bug), should use `|=` or clear specific bits

**Step 3: EXTI IMR Enable**
- Unmasks the interrupt in EXTI controller
- Without this, interrupt won't be delivered to NVIC

### 4.4 GPIO_IRQInterruptConfig() - NVIC Configuration

```c
void GPIO_IRQInterruptConfig(uint8_t IRQNumber, uint8_t EnorDi)
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
}
```

**Purpose**: Enable or disable interrupt at NVIC level

**How it works**:
- NVIC has 240 interrupt lines in STM32F407xx
- ISER/ICER registers are 32-bit, so need multiple registers
- ISER0: IRQ 0-31, ISER1: IRQ 32-63, ISER2: IRQ 64-95
- Modulo operation finds bit position within register

**Example**: Enable IRQ 23 (EXTI9_5)
```
IRQNumber = 23
23 <= 31, so use ISER0
*NVIC_ISER0 |= (1 << 23);  // Set bit 23 in ISER0
```

### 4.5 GPIO_IRQPriorityConfig() - Priority Setting

```c
void GPIO_IRQPriorityConfig(uint8_t IRQNumber, uint32_t IRQPriority)
{
    // Calculate which IPR register (each handles 4 IRQs)
    uint8_t iprx = IRQNumber / 4;
    
    // Calculate which byte within IPR register (0-3)
    uint8_t iprx_section = IRQNumber % 4;
    
    // Calculate bit shift amount
    // Each IRQ uses 8 bits, but only upper 4 bits are implemented
    uint8_t shift_amount = (8 * iprx_section) + (8 - NO_PR_BITS_IMPLEMENTED);
    
    // Set priority value
    *(NVIC_PR_BASE_ADDR + iprx) |= (IRQPriority << shift_amount);
}
```

**Understanding Priority Registers**:
- Each IRQ priority is 8 bits wide
- STM32F407xx implements only 4 MSB (bits 7:4)
- Lower 4 bits (3:0) are always 0
- Each 32-bit IPR register holds 4 IRQ priorities

**Example**: Set priority for IRQ 23 to priority 15
```
IRQNumber = 23
IRQPriority = 15

iprx = 23 / 4 = 5              → Use IPR[5]
iprx_section = 23 % 4 = 3      → Use 4th byte (bits 31:24)
shift_amount = (8 * 3) + 4     → Shift by 28 bits
             = 24 + 4 = 28

*(NVIC_PR_BASE_ADDR + 5) |= (15 << 28);

Register layout:
IPR[5]: [IRQ23][IRQ22][IRQ21][IRQ20]
        31..24  23..16  15..8   7..0
         
IRQ23 priority bits:
Bits 31:28 = 1111 (priority 15)
Bits 27:24 = 0000 (not implemented)
```

**Priority Levels**:
- 0 = Highest priority
- 15 = Lowest priority
- Lower number = Higher urgency
- If same priority, lower IRQ number wins

### 4.6 GPIO_IRQHandling() - ISR Implementation

```c
void GPIO_IRQHandling(uint8_t PinNumber)
{
    // Check if interrupt is pending for this pin
    if(EXTI->PR & (1 << PinNumber))
    {
        // Clear the pending bit by writing 1 to it (RC_W1 type)
        EXTI->PR |= (1 << PinNumber);
    }
}
```

**Critical Points**:
1. **Must check PR bit**: Ensures this interrupt actually fired (important for shared IRQs)
2. **Must clear PR bit**: If not cleared, ISR will be called again immediately
3. **Clear by writing 1**: PR register uses RC_W1 (Read/Clear by Writing 1) mechanism

**Why clearing is mandatory**:
```
Without clearing:
EXTI detects edge → Sets PR bit → NVIC calls ISR → ISR returns
→ PR still set → NVIC calls ISR again → Infinite loop!

With clearing:
EXTI detects edge → Sets PR bit → NVIC calls ISR → ISR clears PR → ISR returns
→ PR cleared → System ready for next interrupt
```

---

## 5. Configuration Steps {#configuration-steps}

### Complete Step-by-Step Configuration Process

#### Step 1: GPIO Clock Enable
```c
GPIO_PeriClockControl(GPIOx, ENABLE);
```
- Enables clock to GPIO peripheral
- Must be done before any GPIO register access
- Uses RCC (Reset and Clock Control) peripheral

#### Step 2: Configure GPIO Pin for Interrupt Mode
```c
GPIO_Handle_t GPIOBtn;
GPIOBtn.pGPIOx = GPIOD;
GPIOBtn.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_5;
GPIOBtn.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_FT;  // Falling edge
GPIOBtn.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
GPIOBtn.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PU;  // Pull-up

GPIO_Init(&GPIOBtn);
```

This single `GPIO_Init()` call internally performs:
- Configures EXTI trigger (FTSR/RTSR)
- Configures SYSCFG_EXTICR (GPIO to EXTI mapping)
- Enables EXTI interrupt (IMR)
- Configures pin speed
- Configures pull-up/pull-down

#### Step 3: Configure IRQ Priority (Optional but Recommended)
```c
GPIO_IRQPriorityConfig(IRQ_NO_EXTI9_5, NVIC_IRQ_PRI15);
```
- Sets priority level (0-15)
- Lower number = higher priority
- If not set, default priority is 0

#### Step 4: Enable IRQ in NVIC
```c
GPIO_IRQInterruptConfig(IRQ_NO_EXTI9_5, ENABLE);
```
- Enables interrupt in NVIC
- IRQ number depends on EXTI line used
- Must match the ISR handler name

#### Step 5: Implement ISR Handler
```c
void EXTI9_5_IRQHandler(void)  // Name must match vector table
{
    // Optional: Add software debouncing delay
    delay();
    
    // Clear pending interrupt (MANDATORY)
    GPIO_IRQHandling(GPIO_PIN_NO_5);
    
    // Your interrupt handling code
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);
}
```

**ISR Handler Names** (from startup file):
- EXTI0_IRQHandler
- EXTI1_IRQHandler
- EXTI2_IRQHandler
- EXTI3_IRQHandler
- EXTI4_IRQHandler
- EXTI9_5_IRQHandler (for EXTI5-9)
- EXTI15_10_IRQHandler (for EXTI10-15)

### Configuration Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. Enable GPIO Clock                                             │
│    GPIO_PeriClockControl(GPIOD, ENABLE);                        │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. Configure GPIO Pin (GPIO_Init internally does 2a, 2b, 2c)    │
│    ┌──────────────────────────────────────────────────────────┐ │
│    │ 2a. Configure EXTI Trigger (FTSR/RTSR)                   │ │
│    │     - Falling edge: FTSR |= (1 << pin)                   │ │
│    │     - Rising edge: RTSR |= (1 << pin)                    │ │
│    └──────────────────────────────────────────────────────────┘ │
│    ┌──────────────────────────────────────────────────────────┐ │
│    │ 2b. Configure SYSCFG (GPIO to EXTI mapping)             │ │
│    │     - Enable SYSCFG clock                                │ │
│    │     - SYSCFG->EXTICR[x] = portcode << offset             │ │
│    └──────────────────────────────────────────────────────────┘ │
│    ┌──────────────────────────────────────────────────────────┐ │
│    │ 2c. Enable EXTI Interrupt (IMR)                          │ │
│    │     - EXTI->IMR |= (1 << pin)                            │ │
│    └──────────────────────────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. Configure IRQ Priority (NVIC)                                │
│    GPIO_IRQPriorityConfig(IRQ_NO_EXTI9_5, priority);           │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. Enable IRQ in NVIC                                           │
│    GPIO_IRQInterruptConfig(IRQ_NO_EXTI9_5, ENABLE);            │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. Implement ISR Handler                                        │
│    void EXTI9_5_IRQHandler(void) {                             │
│        GPIO_IRQHandling(pin);  // Clear PR bit                 │
│        // User code here                                        │
│    }                                                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. Coding Examples {#coding-examples}

### Example 1: Button Interrupt to Toggle LED (Falling Edge)

```c
#include "stm32f407xx.h"

// Software delay for debouncing
void delay(void)
{
    // ~200ms delay when system clock is 16MHz
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
    GpioLed.GPIO_PinConfig.GPIO_PinOPType = GPIO_OP_TYPE_PP;  // Push-pull
    GpioLed.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;
    
    GPIO_PeriClockControl(GPIOD, ENABLE);
    GPIO_Init(&GpioLed);
    
    // ========== Configure Button Pin (PD5) - Interrupt ==========
    GPIOBtn.pGPIOx = GPIOD;
    GPIOBtn.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_5;
    GPIOBtn.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_FT;  // Falling edge trigger
    GPIOBtn.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GPIOBtn.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PU;  // Pull-up
    
    // Clock already enabled above
    GPIO_Init(&GPIOBtn);  // This configures EXTI, SYSCFG, and EXTI IMR
    
    // Initialize LED to OFF
    GPIO_WriteToOutputPin(GPIOD, GPIO_PIN_NO_12, GPIO_PIN_RESET);
    
    // ========== Configure Interrupt ==========
    GPIO_IRQPriorityConfig(IRQ_NO_EXTI9_5, NVIC_IRQ_PRI15);  // Lowest priority
    GPIO_IRQInterruptConfig(IRQ_NO_EXTI9_5, ENABLE);
    
    // Main loop - do nothing, wait for interrupts
    while(1);
}

// Interrupt Service Routine
void EXTI9_5_IRQHandler(void)
{
    delay();  // Software debouncing
    GPIO_IRQHandling(GPIO_PIN_NO_5);  // Clear pending interrupt
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);  // Toggle LED
}
```

### Example 2: Multiple Buttons with Different Priorities

```c
#include "stm32f407xx.h"

volatile uint8_t button1_pressed = 0;
volatile uint8_t button2_pressed = 0;

int main(void)
{
    GPIO_Handle_t GPIOBtn1, GPIOBtn2, GpioLed;
    
    // ========== Configure Button 1 (PA0) - EXTI0 - Rising Edge ==========
    GPIOBtn1.pGPIOx = GPIOA;
    GPIOBtn1.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_0;
    GPIOBtn1.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_RT;  // Rising edge
    GPIOBtn1.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GPIOBtn1.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PD;  // Pull-down
    
    GPIO_PeriClockControl(GPIOA, ENABLE);
    GPIO_Init(&GPIOBtn1);
    
    // ========== Configure Button 2 (PC13) - EXTI13 - Falling Edge ==========
    GPIOBtn2.pGPIOx = GPIOC;
    GPIOBtn2.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_13;
    GPIOBtn2.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_FT;  // Falling edge
    GPIOBtn2.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GPIOBtn2.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PU;  // Pull-up
    
    GPIO_PeriClockControl(GPIOC, ENABLE);
    GPIO_Init(&GPIOBtn2);
    
    // ========== Configure LED (PD15) ==========
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
        // Main loop can process button presses
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
    // Check which line triggered (important for shared IRQ)
    if(EXTI->PR & (1 << GPIO_PIN_NO_13))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_13);
        button2_pressed = 1;
    }
}
```

### Example 3: Both Edge Detection (Rising and Falling)

```c
#include "stm32f407xx.h"

int main(void)
{
    GPIO_Handle_t GPIOSensor, GpioLed;
    
    // ========== Configure Sensor Input (PB8) - Both Edges ==========
    GPIOSensor.pGPIOx = GPIOB;
    GPIOSensor.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_8;
    GPIOSensor.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_RFT;  // Both edges
    GPIOSensor.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GPIOSensor.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;
    
    GPIO_PeriClockControl(GPIOB, ENABLE);
    GPIO_Init(&GPIOSensor);
    
    // ========== Configure LED (PA5) ==========
    GpioLed.pGPIOx = GPIOA;
    GpioLed.GPIO_PinConfig.GPIO_PinNumber = GPIO_PIN_NO_5;
    GpioLed.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_OUT;
    GpioLed.GPIO_PinConfig.GPIO_PinSpeed = GPIO_SPEED_FAST;
    GpioLed.GPIO_PinConfig.GPIO_PinOPType = GPIO_OP_TYPE_PP;
    GpioLed.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;
    
    GPIO_PeriClockControl(GPIOA, ENABLE);
    GPIO_Init(&GpioLed);
    
    // ========== Configure Interrupt ==========
    GPIO_IRQPriorityConfig(IRQ_NO_EXTI9_5, NVIC_IRQ_PRI0);  // Highest priority
    GPIO_IRQInterruptConfig(IRQ_NO_EXTI9_5, ENABLE);
    
    while(1)
    {
        // Main loop - can do other work
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
}
```

### Example 4: Handling Shared IRQ Lines (EXTI9_5)

```c
#include "stm32f407xx.h"

void EXTI9_5_IRQHandler(void)
{
    // Multiple pins (5-9) share this IRQ
    // Must check which pin triggered
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_5))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_5);
        // Handle pin 5 interrupt
    }
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_6))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_6);
        // Handle pin 6 interrupt
    }
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_7))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_7);
        // Handle pin 7 interrupt
    }
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_8))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_8);
        // Handle pin 8 interrupt
    }
    
    if(EXTI->PR & (1 << GPIO_PIN_NO_9))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_9);
        // Handle pin 9 interrupt
    }
}
```

---

## 7. Common Pitfalls and Best Practices {#best-practices}

### Common Pitfalls

#### 1. Forgetting to Clear Pending Bit in ISR
```c
// ❌ WRONG - Will cause infinite ISR calls
void EXTI0_IRQHandler(void)
{
    // Forgot to clear PR bit
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);
}

// ✅ CORRECT
void EXTI0_IRQHandler(void)
{
    GPIO_IRQHandling(GPIO_PIN_NO_0);  // Clears PR bit
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);
}
```

#### 2. Not Enabling Required Clocks
```c
// ❌ WRONG - Missing SYSCFG clock enable
SYSCFG->EXTICR[0] = 0x1;  // Will not work!

// ✅ CORRECT - Enable SYSCFG clock first
SYSCFG_PCLK_EN();
SYSCFG->EXTICR[0] = 0x1;
```

#### 3. Wrong ISR Handler Name
```c
// ❌ WRONG - Name doesn't match vector table
void EXTI5_IRQHandler(void)  // No such handler!
{
    // This will never be called
}

// ✅ CORRECT - Use exact name from startup file
void EXTI9_5_IRQHandler(void)  // Handles EXTI5-9
{
    // This will be called
}
```

#### 4. Not Checking PR Bit in Shared IRQ
```c
// ❌ WRONG - Assumes pin 5 without checking
void EXTI9_5_IRQHandler(void)
{
    GPIO_IRQHandling(GPIO_PIN_NO_5);  // Might clear wrong interrupt!
    // Handle pin 5...
}

// ✅ CORRECT - Check before handling
void EXTI9_5_IRQHandler(void)
{
    if(EXTI->PR & (1 << GPIO_PIN_NO_5))
    {
        GPIO_IRQHandling(GPIO_PIN_NO_5);
        // Handle pin 5...
    }
}
```

#### 5. Forgetting Pull-Up/Pull-Down Configuration
```c
// ❌ WRONG - Floating input can cause spurious interrupts
GPIOBtn.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_NO_PUPD;

// ✅ CORRECT - Use pull-up for active-low button
GPIOBtn.GPIO_PinConfig.GPIO_PinPuPdControl = GPIO_PIN_PU;
```

#### 6. Wrong Trigger Edge Selection
```c
// Button: Connected to VCC through switch, to ground through pull-down
// When pressed: GPIO sees rising edge (0→1)
// When released: GPIO sees falling edge (1→0)

// ❌ WRONG - Falling edge won't trigger on button press
GPIOBtn.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_FT;

// ✅ CORRECT - Rising edge triggers on button press
GPIOBtn.GPIO_PinConfig.GPIO_PinMode = GPIO_MODE_IT_RT;
```

#### 7. Not Handling Button Debouncing
```c
// ❌ WRONG - No debouncing causes multiple interrupts
void EXTI0_IRQHandler(void)
{
    GPIO_IRQHandling(GPIO_PIN_NO_0);
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);
}

// ✅ BETTER - Add software debouncing
void EXTI0_IRQHandler(void)
{
    delay();  // Wait for bouncing to settle
    GPIO_IRQHandling(GPIO_PIN_NO_0);
    GPIO_ToggleOutputPin(GPIOD, GPIO_PIN_NO_12);
}
```

#### 8. Using Same EXTI Line for Multiple Ports
```c
// ❌ WRONG - Can't use PA0 and PB0 simultaneously
// They both map to EXTI0, last configuration wins

// ✅ CORRECT - Use different pin numbers
// PA0 (EXTI0) and PB1 (EXTI1) can work together
```

### Best Practices

#### 1. Keep ISR Short and Fast
```c
// ✅ GOOD - Set flag and return quickly
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
}
```

#### 2. Use Volatile for Shared Variables
```c
// ✅ CORRECT - Prevents compiler optimization issues
volatile uint8_t interrupt_count = 0;

void EXTI0_IRQHandler(void)
{
    GPIO_IRQHandling(GPIO_PIN_NO_0);
    interrupt_count++;  // Compiler won't optimize away
}
```

#### 3. Disable Interrupts During Critical Sections
```c
void critical_operation(void)
{
    // Disable interrupts
    __disable_irq();
    
    // Critical code that shouldn't be interrupted
    shared_data = new_value;
    
    // Re-enable interrupts
    __enable_irq();
}
```

#### 4. Document IRQ Numbers and Priorities
```c
// Good practice - Document your interrupt configuration
#define BUTTON1_IRQ     IRQ_NO_EXTI0        // PA0 - User button
#define BUTTON1_PRIORITY NVIC_IRQ_PRI5      // Medium priority

#define EMERGENCY_STOP_IRQ      IRQ_NO_EXTI1        // PA1 - Emergency stop
#define EMERGENCY_STOP_PRIORITY NVIC_IRQ_PRI0       // Highest priority
```

#### 5. Use Proper Naming Conventions
```c
// ✅ GOOD - Clear, descriptive names
GPIO_Handle_t EmergencyStopButton;
GPIO_Handle_t UserInputButton;
GPIO_Handle_t StatusLED;

void EmergencyStop_IRQHandler(void);
void UserButton_IRQHandler(void);
```

#### 6. Test Edge Cases
- Test rapid button presses
- Test simultaneous interrupts
- Test with different priority levels
- Test interrupt during sleep modes

#### 7. Use Hardware Debouncing When Possible
```
Button ─── [RC Filter] ─── GPIO Pin
         
C = 100nF, R = 10kΩ
Time constant τ = RC = 1ms
```

### Debugging Tips

#### 1. Check Interrupt Flags
```c
// Debug: Check if interrupt is pending
if(EXTI->PR & (1 << pin_number))
{
    printf("Interrupt pending for pin %d\n", pin_number);
}

// Debug: Check if IMR is set
if(EXTI->IMR & (1 << pin_number))
{
    printf("Interrupt enabled for pin %d\n", pin_number);
}
```

#### 2. Verify NVIC Configuration
```c
// Check if NVIC interrupt is enabled
uint32_t iser_value = *NVIC_ISER0;
if(iser_value & (1 << IRQ_NUMBER))
{
    printf("NVIC interrupt %d is enabled\n", IRQ_NUMBER);
}
```

#### 3. Use Toggle Pin for ISR Debugging
```c
void EXTI0_IRQHandler(void)
{
    // Toggle debug pin to verify ISR is being called
    GPIO_ToggleOutputPin(GPIOC, GPIO_PIN_NO_13);
    
    GPIO_IRQHandling(GPIO_PIN_NO_0);
    // Rest of handler...
}
```

#### 4. Count Interrupt Occurrences
```c
volatile uint32_t isr_call_count = 0;

void EXTI0_IRQHandler(void)
{
    isr_call_count++;
    GPIO_IRQHandling(GPIO_PIN_NO_0);
    // Rest of handler...
}

// Check in main or debugger
printf("ISR called %lu times\n", isr_call_count);
```

---

## Summary

### Key Takeaways

1. **GPIO Interrupt Chain**: GPIO → SYSCFG → EXTI → NVIC → CPU
   
2. **Essential Configuration Steps**:
   - Enable GPIO clock
   - Configure pin as interrupt mode (IT_FT/IT_RT/IT_RFT)
   - Set interrupt priority
   - Enable interrupt in NVIC
   - Implement ISR with correct name
   - Clear pending bit in ISR

3. **Critical Registers**:
   - EXTI: FTSR, RTSR, IMR, PR
   - SYSCFG: EXTICR[0:3]
   - NVIC: ISER, ICER, IPR

4. **Must Remember**:
   - Always clear EXTI->PR bit in ISR
   - Enable SYSCFG clock before configuring EXTICR
   - Use correct ISR handler name from vector table
   - Only one port can use an EXTI line at a time
   - EXTI5-9 and EXTI10-15 share IRQ handlers

5. **Best Practices**:
   - Keep ISR short and fast
   - Use volatile for shared variables
   - Implement button debouncing
   - Use pull-up/pull-down resistors
   - Document IRQ numbers and priorities

### Quick Reference

#### IRQ Numbers for EXTI
```
EXTI0:      IRQ 6
EXTI1:      IRQ 7
EXTI2:      IRQ 8
EXTI3:      IRQ 9
EXTI4:      IRQ 10
EXTI5-9:    IRQ 23 (shared)
EXTI10-15:  IRQ 40 (shared)
```

#### Priority Levels
```
0:  Highest priority
15: Lowest priority
Default: 0
```

#### ISR Handler Template
```c
void EXTIx_IRQHandler(void)
{
    // 1. Check PR bit (if shared IRQ)
    if(EXTI->PR & (1 << pin))
    {
        // 2. Clear PR bit (MANDATORY)
        GPIO_IRQHandling(pin);
        
        // 3. Handle interrupt
        // Your code here
    }
}
```

---

**References**:
- STM32F446xx Reference Manual (RM0390)
- STM32F407xx GPIO Driver (stm32f407xx_gpio_driver.h/c)
- ARM Cortex-M4 Generic User Guide

**Prepared for**: STM32F407xx MCU Development
**Last Updated**: February 2026
