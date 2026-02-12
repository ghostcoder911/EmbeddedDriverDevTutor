/**
 * STM32 Driver Mentor - Main Application
 * Interactive learning tool for embedded driver development
 */

class DriverMentor {
    constructor() {
        this.currentDriver = null;
        this.currentStep = 0;
        this.progress = this.loadProgress();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgressDisplay();
        this.renderReferenceContent();
    }

    bindEvents() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Driver cards
        document.querySelectorAll('.driver-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectDriver(card.dataset.driver));
        });

        // Back button
        document.getElementById('back-to-home').addEventListener('click', () => this.switchView('home'));

        // Lesson navigation
        document.getElementById('prev-step').addEventListener('click', () => this.prevStep());
        document.getElementById('next-step').addEventListener('click', () => this.nextStep());

        // Reference tabs
        document.querySelectorAll('.ref-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchRefTab(e.target.dataset.ref));
        });
    }

    switchView(view) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
        });
        document.getElementById(`${view}-view`).classList.add('active');

        // Update progress view if switching to it
        if (view === 'progress') {
            this.renderProgressView();
        }
    }

    selectDriver(driver) {
        this.currentDriver = driver;
        this.currentStep = this.progress[driver]?.currentStep || 0;
        
        // Update sidebar title
        const driverNames = {
            'c-programming': 'Embedded C Programming',
            'mcu-header': 'MCU Header File',
            gpio: 'GPIO Driver',
            'gpio-interrupt': 'GPIO Interrupts',
            spi: 'SPI Driver',
            i2c: 'I2C Driver',
            usart: 'USART Driver'
        };
        document.getElementById('current-driver-title').textContent = driverNames[driver];

        // Render steps list
        this.renderStepsList();
        
        // Render current lesson
        this.renderLesson();

        // Switch to lesson view
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('lesson-view').classList.add('active');
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    }

    renderStepsList() {
        const lessons = this.getLessons();
        const stepsList = document.getElementById('steps-list');
        
        stepsList.innerHTML = lessons.map((lesson, index) => `
            <div class="step-item ${index === this.currentStep ? 'active' : ''} ${this.isStepCompleted(index) ? 'completed' : ''}" 
                 data-step="${index}">
                <span class="step-number">${index + 1}</span>
                <span class="step-title">${lesson.title}</span>
            </div>
        `).join('');

        // Bind click events to steps
        stepsList.querySelectorAll('.step-item').forEach(item => {
            item.addEventListener('click', () => {
                const step = parseInt(item.dataset.step);
                this.goToStep(step);
            });
        });
    }

    renderLesson() {
        const lessons = this.getLessons();
        const lesson = lessons[this.currentStep];

        // Update step indicator
        document.getElementById('current-step-num').textContent = `Step ${this.currentStep + 1}`;
        document.getElementById('total-steps').textContent = lessons.length;
        document.getElementById('lesson-title').textContent = lesson.title;

        // Render lesson content
        document.getElementById('lesson-body').innerHTML = lesson.content;

        // Update navigation buttons
        document.getElementById('prev-step').disabled = this.currentStep === 0;
        const nextBtn = document.getElementById('next-step');
        if (this.currentStep === lessons.length - 1) {
            nextBtn.innerHTML = `
                Complete
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            `;
        } else {
            nextBtn.innerHTML = `
                Next
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            `;
        }

        // Update sidebar active state
        document.querySelectorAll('.step-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentStep);
        });

        // Add copy functionality to code blocks
        this.initCodeCopy();

        // Scroll to top of lesson
        document.querySelector('.lesson-content').scrollTop = 0;
    }

    initCodeCopy() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const codeBlock = btn.closest('.code-block');
                const code = codeBlock.querySelector('code').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    btn.textContent = 'Copied!';
                    setTimeout(() => btn.textContent = 'Copy', 2000);
                });
            });
        });
    }

    getLessons() {
        switch (this.currentDriver) {
            case 'c-programming': return window.cProgrammingLessons || [];
            case 'mcu-header': return window.mcuHeaderLessons || [];
            case 'gpio': return window.gpioLessons || [];
            case 'gpio-interrupt': return window.gpioInterruptLessons || [];
            case 'spi': return window.spiLessons || [];
            case 'i2c': return window.i2cLessons || [];
            case 'usart': return window.usartLessons || [];
            default: return [];
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.saveProgress();
            this.renderLesson();
            this.renderStepsList();
        }
    }

    nextStep() {
        const lessons = this.getLessons();
        if (this.currentStep < lessons.length - 1) {
            this.markStepCompleted(this.currentStep);
            this.currentStep++;
            this.saveProgress();
            this.renderLesson();
            this.renderStepsList();
        } else {
            // Complete the driver
            this.markStepCompleted(this.currentStep);
            this.saveProgress();
            this.showCompletionMessage();
        }
    }

    goToStep(step) {
        this.currentStep = step;
        this.saveProgress();
        this.renderLesson();
        this.renderStepsList();
    }

    isStepCompleted(step) {
        return this.progress[this.currentDriver]?.completedSteps?.includes(step) || false;
    }

    markStepCompleted(step) {
        if (!this.progress[this.currentDriver]) {
            this.progress[this.currentDriver] = { completedSteps: [], currentStep: 0 };
        }
        if (!this.progress[this.currentDriver].completedSteps.includes(step)) {
            this.progress[this.currentDriver].completedSteps.push(step);
        }
        this.updateProgressDisplay();
    }

    saveProgress() {
        if (!this.progress[this.currentDriver]) {
            this.progress[this.currentDriver] = { completedSteps: [], currentStep: 0 };
        }
        this.progress[this.currentDriver].currentStep = this.currentStep;
        localStorage.setItem('driverMentorProgress', JSON.stringify(this.progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('driverMentorProgress');
        return saved ? JSON.parse(saved) : {};
    }

    updateProgressDisplay() {
        const drivers = ['c-programming', 'mcu-header', 'gpio', 'gpio-interrupt', 'spi', 'i2c', 'usart'];
        
        drivers.forEach(driver => {
            const lessons = this.getDriverLessons(driver);
            const completed = this.progress[driver]?.completedSteps?.length || 0;
            const total = lessons.length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            const card = document.querySelector(`.driver-card[data-driver="${driver}"]`);
            if (card) {
                card.querySelector('.progress-fill').style.width = `${percent}%`;
                card.querySelector('.progress-text').textContent = `${percent}% Complete`;
            }
        });
    }

    getDriverLessons(driver) {
        switch (driver) {
            case 'c-programming': return window.cProgrammingLessons || [];
            case 'mcu-header': return window.mcuHeaderLessons || [];
            case 'gpio': return window.gpioLessons || [];
            case 'gpio-interrupt': return window.gpioInterruptLessons || [];
            case 'spi': return window.spiLessons || [];
            case 'i2c': return window.i2cLessons || [];
            case 'usart': return window.usartLessons || [];
            default: return [];
        }
    }

    renderProgressView() {
        const drivers = [
            { id: 'c-programming', name: 'Embedded C Programming', icon: 'c-icon' },
            { id: 'mcu-header', name: 'MCU Header File', icon: 'mcu-icon' },
            { id: 'gpio', name: 'GPIO Driver', icon: 'gpio-icon' },
            { id: 'gpio-interrupt', name: 'GPIO Interrupts', icon: 'gpio-icon' },
            { id: 'spi', name: 'SPI Driver', icon: 'spi-icon' },
            { id: 'i2c', name: 'I2C Driver', icon: 'i2c-icon' },
            { id: 'usart', name: 'USART Driver', icon: 'usart-icon' }
        ];

        let totalCompleted = 0;
        let totalLessons = 0;

        const progressList = document.getElementById('driver-progress-list');
        progressList.innerHTML = drivers.map(driver => {
            const lessons = this.getDriverLessons(driver.id);
            const completed = this.progress[driver.id]?.completedSteps?.length || 0;
            const total = lessons.length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            totalCompleted += completed;
            totalLessons += total;

            return `
                <div class="driver-progress-item">
                    <div class="driver-progress-icon ${driver.icon}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                        </svg>
                    </div>
                    <div class="driver-progress-info">
                        <div class="driver-progress-name">${driver.name}</div>
                        <div class="driver-progress-bar">
                            <div class="driver-progress-fill" style="width: ${percent}%"></div>
                        </div>
                    </div>
                    <div class="driver-progress-percent">${percent}%</div>
                </div>
            `;
        }).join('');

        // Update overview
        const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
        document.getElementById('total-progress').textContent = `${overallPercent}%`;
        document.getElementById('completed-lessons').textContent = totalCompleted;
    }

    showCompletionMessage() {
        const driverNames = {
            'c-programming': 'Embedded C',
            'mcu-header': 'MCU Header',
            gpio: 'GPIO',
            spi: 'SPI',
            i2c: 'I2C',
            usart: 'USART'
        };

        // Show the celebration modal with fireworks
        this.showCelebration(driverNames[this.currentDriver]);
    }

    showCelebration(driverName) {
        // Create celebration overlay
        const overlay = document.createElement('div');
        overlay.className = 'celebration-overlay';
        overlay.innerHTML = `
            <div class="fireworks-container" id="fireworks-container"></div>
            <div class="celebration-content">
                <div class="trophy-icon">🏆</div>
                <h1 class="celebration-title">Congratulations!</h1>
                <p class="celebration-subtitle">You've mastered the <span class="driver-name">${driverName} Driver</span>!</p>
                <div class="achievement-badge">
                    <div class="badge-icon">⭐</div>
                    <div class="badge-text">Achievement Unlocked</div>
                    <div class="badge-name">${driverName} Driver Expert</div>
                </div>
                <p class="celebration-message">
                    You now have the knowledge to write your own ${driverName} driver from scratch.
                    Keep learning and exploring!
                </p>
                <div class="celebration-buttons">
                    <button class="celebration-btn secondary" onclick="app.closeCelebration(); app.switchView('home');">
                        Back to Home
                    </button>
                    <button class="celebration-btn primary" onclick="app.closeCelebration(); app.switchView('progress');">
                        View Progress
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Start fireworks animation
        this.startFireworks();
        
        // Trigger entrance animation
        setTimeout(() => overlay.classList.add('active'), 50);
    }

    closeCelebration() {
        const overlay = document.querySelector('.celebration-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 500);
        }
        this.stopFireworks();
    }

    startFireworks() {
        const container = document.getElementById('fireworks-container');
        if (!container) return;

        this.fireworksInterval = setInterval(() => {
            this.createFirework(container);
        }, 300);

        // Create initial burst
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.createFirework(container), i * 100);
        }
    }

    stopFireworks() {
        if (this.fireworksInterval) {
            clearInterval(this.fireworksInterval);
            this.fireworksInterval = null;
        }
    }

    createFirework(container) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 60 + 10;
        firework.style.left = `${x}%`;
        firework.style.top = `${y}%`;
        
        // Random color
        const colors = ['#3fb950', '#58a6ff', '#f0883e', '#a371f7', '#39c5cf', '#f85149', '#d29922'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create particles
        const particleCount = 12 + Math.floor(Math.random() * 8);
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const angle = (i / particleCount) * 360;
            const velocity = 50 + Math.random() * 50;
            particle.style.setProperty('--angle', `${angle}deg`);
            particle.style.setProperty('--velocity', `${velocity}px`);
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 6px ${color}, 0 0 10px ${color}`;
            firework.appendChild(particle);
        }
        
        container.appendChild(firework);
        
        // Remove after animation
        setTimeout(() => firework.remove(), 1500);
    }

    switchRefTab(tab) {
        document.querySelectorAll('.ref-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.ref === tab);
        });
        this.renderReferenceContent(tab);
    }

    renderReferenceContent(tab = 'registers') {
        const content = document.getElementById('reference-content');
        
        const referenceData = {
            registers: `
                <h2>GPIO Registers</h2>
                <table class="lesson-table">
                    <tr><th>Register</th><th>Offset</th><th>Description</th></tr>
                    <tr><td><code>MODER</code></td><td>0x00</td><td>Mode Register - Input/Output/Alternate/Analog</td></tr>
                    <tr><td><code>OTYPER</code></td><td>0x04</td><td>Output Type - Push-Pull/Open-Drain</td></tr>
                    <tr><td><code>OSPEEDR</code></td><td>0x08</td><td>Output Speed - Low/Medium/High/Very High</td></tr>
                    <tr><td><code>PUPDR</code></td><td>0x0C</td><td>Pull-Up/Pull-Down Configuration</td></tr>
                    <tr><td><code>IDR</code></td><td>0x10</td><td>Input Data Register (Read-Only)</td></tr>
                    <tr><td><code>ODR</code></td><td>0x14</td><td>Output Data Register</td></tr>
                    <tr><td><code>BSRR</code></td><td>0x18</td><td>Bit Set/Reset Register (Atomic)</td></tr>
                    <tr><td><code>LCKR</code></td><td>0x1C</td><td>Lock Register</td></tr>
                    <tr><td><code>AFR[2]</code></td><td>0x20-0x24</td><td>Alternate Function Registers</td></tr>
                </table>
                
                <h2>SPI Registers</h2>
                <table class="lesson-table">
                    <tr><th>Register</th><th>Offset</th><th>Description</th></tr>
                    <tr><td><code>CR1</code></td><td>0x00</td><td>Control Register 1</td></tr>
                    <tr><td><code>CR2</code></td><td>0x04</td><td>Control Register 2</td></tr>
                    <tr><td><code>SR</code></td><td>0x08</td><td>Status Register</td></tr>
                    <tr><td><code>DR</code></td><td>0x0C</td><td>Data Register</td></tr>
                </table>
                
                <h2>I2C Registers</h2>
                <table class="lesson-table">
                    <tr><th>Register</th><th>Offset</th><th>Description</th></tr>
                    <tr><td><code>CR1</code></td><td>0x00</td><td>Control Register 1</td></tr>
                    <tr><td><code>CR2</code></td><td>0x04</td><td>Control Register 2</td></tr>
                    <tr><td><code>OAR1</code></td><td>0x08</td><td>Own Address Register 1</td></tr>
                    <tr><td><code>OAR2</code></td><td>0x0C</td><td>Own Address Register 2</td></tr>
                    <tr><td><code>DR</code></td><td>0x10</td><td>Data Register</td></tr>
                    <tr><td><code>SR1</code></td><td>0x14</td><td>Status Register 1</td></tr>
                    <tr><td><code>SR2</code></td><td>0x18</td><td>Status Register 2</td></tr>
                    <tr><td><code>CCR</code></td><td>0x1C</td><td>Clock Control Register</td></tr>
                    <tr><td><code>TRISE</code></td><td>0x20</td><td>Rise Time Register</td></tr>
                </table>
            `,
            macros: `
                <h2>Clock Enable Macros</h2>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">stm32f446xx.h</span>
                    </div>
                    <div class="code-content">
                        <pre><code><span class="comment">// GPIO Clock Enable</span>
<span class="preprocessor">#define</span> <span class="function">GPIOA_PCLK_EN()</span>    (RCC->AHB1ENR |= (1 << 0))
<span class="preprocessor">#define</span> <span class="function">GPIOB_PCLK_EN()</span>    (RCC->AHB1ENR |= (1 << 1))
<span class="preprocessor">#define</span> <span class="function">GPIOC_PCLK_EN()</span>    (RCC->AHB1ENR |= (1 << 2))

<span class="comment">// SPI Clock Enable</span>
<span class="preprocessor">#define</span> <span class="function">SPI1_PCLK_EN()</span>     (RCC->APB2ENR |= (1 << 12))
<span class="preprocessor">#define</span> <span class="function">SPI2_PCLK_EN()</span>     (RCC->APB1ENR |= (1 << 14))
<span class="preprocessor">#define</span> <span class="function">SPI3_PCLK_EN()</span>     (RCC->APB1ENR |= (1 << 15))

<span class="comment">// I2C Clock Enable</span>
<span class="preprocessor">#define</span> <span class="function">I2C1_PCLK_EN()</span>     (RCC->APB1ENR |= (1 << 21))
<span class="preprocessor">#define</span> <span class="function">I2C2_PCLK_EN()</span>     (RCC->APB1ENR |= (1 << 22))
<span class="preprocessor">#define</span> <span class="function">I2C3_PCLK_EN()</span>     (RCC->APB1ENR |= (1 << 23))</code></pre>
                    </div>
                </div>
                
                <h2>Generic Macros</h2>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">stm32f446xx.h</span>
                    </div>
                    <div class="code-content">
                        <pre><code><span class="preprocessor">#define</span> ENABLE          <span class="number">1</span>
<span class="preprocessor">#define</span> DISABLE         <span class="number">0</span>
<span class="preprocessor">#define</span> SET             ENABLE
<span class="preprocessor">#define</span> RESET           DISABLE
<span class="preprocessor">#define</span> GPIO_PIN_SET    SET
<span class="preprocessor">#define</span> GPIO_PIN_RESET  RESET
<span class="preprocessor">#define</span> FLAG_SET        SET
<span class="preprocessor">#define</span> FLAG_RESET      RESET</code></pre>
                    </div>
                </div>
            `,
            patterns: `
                <h2>Driver Structure Pattern</h2>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">driver_pattern.h</span>
                    </div>
                    <div class="code-content">
                        <pre><code><span class="comment">// 1. Configuration Structure</span>
<span class="keyword">typedef struct</span> {
    <span class="type">uint8_t</span> Config1;
    <span class="type">uint8_t</span> Config2;
    <span class="comment">// ... more configuration options</span>
} <span class="type">Peripheral_Config_t</span>;

<span class="comment">// 2. Handle Structure</span>
<span class="keyword">typedef struct</span> {
    <span class="type">Peripheral_RegDef_t</span> *pPeripheralx;  <span class="comment">// Pointer to peripheral</span>
    <span class="type">Peripheral_Config_t</span> Config;         <span class="comment">// Configuration</span>
} <span class="type">Peripheral_Handle_t</span>;</code></pre>
                    </div>
                </div>
                
                <h2>Standard API Pattern</h2>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">driver_api.c</span>
                    </div>
                    <div class="code-content">
                        <pre><code><span class="comment">// Clock Control</span>
<span class="type">void</span> <span class="function">Peripheral_PeriClockControl</span>(<span class="type">Peripheral_RegDef_t</span> *pPeripheralx, <span class="type">uint8_t</span> EnOrDi);

<span class="comment">// Init and De-init</span>
<span class="type">void</span> <span class="function">Peripheral_Init</span>(<span class="type">Peripheral_Handle_t</span> *pHandle);
<span class="type">void</span> <span class="function">Peripheral_DeInit</span>(<span class="type">Peripheral_RegDef_t</span> *pPeripheralx);

<span class="comment">// Data Read/Write</span>
<span class="type">void</span> <span class="function">Peripheral_SendData</span>(...);
<span class="type">void</span> <span class="function">Peripheral_ReceiveData</span>(...);

<span class="comment">// IRQ Configuration and ISR Handling</span>
<span class="type">void</span> <span class="function">Peripheral_IRQInterruptConfig</span>(<span class="type">uint8_t</span> IRQNumber, <span class="type">uint8_t</span> EnOrDi);
<span class="type">void</span> <span class="function">Peripheral_IRQPriorityConfig</span>(<span class="type">uint8_t</span> IRQNumber, <span class="type">uint32_t</span> IRQPriority);
<span class="type">void</span> <span class="function">Peripheral_IRQHandling</span>(<span class="type">Peripheral_Handle_t</span> *pHandle);</code></pre>
                    </div>
                </div>
                
                <h2>Bit Manipulation Pattern</h2>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-filename">bit_operations.c</span>
                    </div>
                    <div class="code-content">
                        <pre><code><span class="comment">// Set a bit</span>
Register |= (<span class="number">1</span> << BitPosition);

<span class="comment">// Clear a bit</span>
Register &= ~(<span class="number">1</span> << BitPosition);

<span class="comment">// Toggle a bit</span>
Register ^= (<span class="number">1</span> << BitPosition);

<span class="comment">// Check a bit</span>
<span class="keyword">if</span> (Register & (<span class="number">1</span> << BitPosition)) { ... }

<span class="comment">// Clear multiple bits (e.g., 2 bits)</span>
Register &= ~(<span class="number">0x3</span> << BitPosition);

<span class="comment">// Set multiple bits to a value</span>
Register |= (Value << BitPosition);</code></pre>
                    </div>
                </div>
            `
        };

        content.innerHTML = referenceData[tab] || referenceData.registers;
    }
}

// Initialize the application
const app = new DriverMentor();

