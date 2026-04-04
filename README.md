# STM32 Driver Mentor Tool

An interactive web-based learning tool for **STM32 peripheral drivers** and **FreeRTOS**—step-by-step lessons and long-form study guides.

## 🎯 Purpose

This tool guides students step-by-step through writing peripheral drivers for STM32F446RE microcontrollers. It covers:

- **GPIO Driver** - General Purpose Input/Output (Beginner)
- **GPIO Interrupts** - Interrupt-driven GPIO with EXTI, SYSCFG, and NVIC (Intermediate)
- **SPI Driver** - Serial Peripheral Interface (Intermediate)
- **I2C Driver** - Inter-Integrated Circuit (Intermediate)
- **USART Driver** - Serial Communication (Advanced)
- **RTOS / FreeRTOS** - Tasks, handles, scheduling, semaphores, mutexes, queues, and more (beginner-friendly, links to [FreeRTOS.org](https://www.freertos.org/))

## 🚀 Getting Started

### Option 1: Open Directly in Browser

Simply open `index.html` in any modern web browser:

```bash
# Linux/Mac
xdg-open index.html
# or
firefox index.html

# Windows
start index.html
```

### Option 2: Use a Local Server (Recommended)

For the best experience, use a local HTTP server:

```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

## 📚 Features

### Interactive Lessons
- Step-by-step tutorials for each peripheral
- Code examples with syntax highlighting
- Copy-to-clipboard functionality
- Progress tracking (saved in browser)

### Topics Covered

#### GPIO Driver (10 lessons)
1. Understanding GPIO Basics
2. GPIO Hardware Architecture
3. GPIO Register Map
4. Creating the Driver Header File
5. Defining Configuration Macros
6. API Function Prototypes
7. Implementing Clock Control
8. Implementing GPIO Initialization
9. Implementing Read/Write Operations
10. Testing Your GPIO Driver

#### GPIO Interrupts (10 lessons)
1. Introduction to GPIO Interrupts
2. Hardware Architecture Overview
3. EXTI Registers & Configuration
4. SYSCFG: GPIO to EXTI Mapping
5. NVIC: Interrupt Controller
6. Interrupt Priority Configuration
7. Complete Configuration Process
8. Complete Example: Button to LED
9. Advanced Examples
10. Common Pitfalls & Best Practices

#### SPI Driver (8 lessons)
1. Understanding SPI Protocol
2. SPI Clock Modes (CPOL & CPHA)
3. STM32F446RE SPI Peripheral
4. Creating the SPI Driver Header
5. SPI API Function Prototypes
6. Implementing SPI Initialization
7. Implementing Send and Receive
8. Testing Your SPI Driver

#### I2C Driver (8 lessons)
1. Understanding I2C Protocol
2. I2C Communication Sequence
3. STM32F446RE I2C Peripheral
4. Creating the I2C Driver Header
5. I2C API Function Prototypes
6. Implementing I2C Initialization
7. Implementing Master Send/Receive
8. Testing Your I2C Driver

#### USART Driver (7 lessons)
1. Understanding USART Protocol
2. USART Configuration Parameters
3. STM32F446RE USART Peripheral
4. Creating the USART Driver Header
5. Baud Rate Calculation
6. Implementing Init and Send
7. Testing Your USART Driver

#### RTOS / FreeRTOS (17 lessons)
1. What is an RTOS?
2. Tasks (building blocks)
3. Task handle (`TaskHandle_t`)
4. `xTaskCreate` — every parameter explained
5. Static task creation (`xTaskCreateStatic`)
6. Starting the scheduler and idle task
7. Ticks, time, and delays
8. Scheduling (states, preemption, priorities)
9. Semaphores and binary semaphores
10. Counting semaphores
11. Mutexes (shared resources, priority inversion)
12. Queues
13. Software timers
14. Interrupts and `FromISR` APIs
15. Task notifications
16. Heap and per-task stacks
17. Summary and next steps

Lessons link to **[FreeRTOS.org](https://www.freertos.org/)** (kernel book, API index, `FreeRTOSConfig.h`).

### Study Guides
Open **Study Guides** in the app (or the bundled Markdown references) for long-form material:
- **GPIO Interrupt Configuration** — GPIO interrupts end-to-end (hardware chain, registers, examples, pitfalls)
- **RTOS & FreeRTOS** — Theory plus FreeRTOS practice; **[freertos.org](https://www.freertos.org/)** API links in the guide header
- **FreeRTOS Simulator** — Run FreeRTOS on a PC without hardware

### Quick Reference
- Register maps for all peripherals
- Common macros and definitions
- Code patterns and best practices

## 🛠️ Technology

- Pure HTML, CSS, and JavaScript
- No build tools or dependencies required
- Works offline after initial load
- Progress saved in localStorage

## 📁 Project Structure

```
EmbeddedDriverDevTutor/
├── index.html                       # Main application
├── guides.html                      # Study guides listing page
├── styles.css                       # Styling
├── app.js                           # Application logic
├── lessons/
│   ├── c-programming-lessons.js     # C programming fundamentals
│   ├── mcu-header-lessons.js        # MCU header file structure
│   ├── gpio-lessons.js              # GPIO tutorial content
│   ├── gpio-interrupt-lessons.js    # GPIO interrupt configuration
│   ├── spi-lessons.js               # SPI tutorial content
│   ├── i2c-lessons.js               # I2C tutorial content
│   ├── usart-lessons.js             # USART tutorial content
│   └── rtos-lessons.js              # RTOS / FreeRTOS (STM32 + freertos.org)
├── guides/                          # Study guide documents (linked from guides.html)
├── RTOS_Tutor/                      # Optional: STM32 FreeRTOS examples (separate from lessons)
├── GPIO_Interrupt_Configuration_Study_Guide.md  # Extra GPIO reference copy (root)
└── README.md
```

## 🎓 For Instructors

This tool can be used in:
- Embedded systems courses
- Microcontroller labs
- Self-paced learning
- Workshop sessions

Students learn by doing - each lesson builds on the previous one, culminating in a working driver implementation.

## 📖 Reference

Based on:
- STM32F446RE Reference Manual (RM0390)
- STM32F446RE Datasheet
- ARM Cortex-M4 Technical Reference Manual

## 📝 License

This educational tool is provided for learning purposes. Feel free to use and modify for educational use.

---

## 👨‍💻 Developer

**Neeraj PM**

- 💼 LinkedIn: [linkedin.com/in/neeraj-pm](https://www.linkedin.com/in/neeraj-pm/)
- 📧 Email: neeraj.pm1995@gmail.com
- ☕ Support: [Buy Me a Coffee](https://buymeacoffee.com/neerajpm)

---

## ☕ Support This Project

If you find this tool helpful, consider buying me a coffee!

<a href="https://buymeacoffee.com/neerajpm" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
</a>

---

Created for STM32 driver development education.

