/**
 * Text-based embedded mock interview — question bank from InterviewPreperationAgent (interview_agent.py).
 * Evaluation is heuristic (keywords + length); not a substitute for a human interviewer.
 */
(function () {
    const questions = [
        {
            text:
                'Hello — thanks for joining. In one minute, what kind of embedded work do you focus on, and what is your current toolchain?',
            keywords: [
                'embedded',
                'mcu',
                'arm',
                'gcc',
                'cmake',
                'debug',
                'rtos',
                'stm32',
                'firmware',
                'toolchain',
                'ide',
                'hardware',
            ],
            minWords: 25,
            hint: 'Mention domain (e.g. drivers, RTOS, bare metal), MCU family if you can, and tools (compiler, debugger, RTOS name).',
        },
        {
            text:
                'Walk me through a recent bug you chased that turned out to be timing or hardware related. What did you measure first?',
            keywords: [
                'scope',
                'logic analyzer',
                'probe',
                'oscilloscope',
                'timing',
                'interrupt',
                'race',
                'hardware',
                'signal',
                'measure',
                'gpio',
                'dma',
            ],
            minWords: 30,
            hint: 'Interviewers want a structured story: symptom, first measurement, what you ruled out, root cause.',
        },
        {
            text:
                'When would you use a mutex versus a semaphore in firmware, and what is a common mistake teams make with ISRs and locking?',
            keywords: [
                'mutex',
                'semaphore',
                'binary',
                'counting',
                'priority inversion',
                'isr',
                'interrupt',
                'deadlock',
                'lock',
                'blocking',
                'short',
                'rtos',
            ],
            minWords: 35,
            hint: 'Contrast mutex (exclusive resource) vs semaphore (signalling / counting). Mention not blocking/mutex in ISR or keeping ISRs short.',
        },
        {
            text:
                'Compare SPI and I2C for a sensor you might put on a board. When would you reject one of them?',
            keywords: [
                'spi',
                'i2c',
                'speed',
                'wiring',
                'clock',
                'full duplex',
                'address',
                'bus',
                'length',
                'noise',
                'slave',
                'pull-up',
            ],
            minWords: 35,
            hint: 'SPI: higher speed, more pins, short traces. I2C: two wires, longer bus caveats, clock stretching.',
        },
        {
            text:
                'How do you decide stack sizes for tasks in an RTOS, and what would you do if you saw stack overflow in the field?',
            keywords: [
                'stack',
                'watermark',
                'high water',
                'overflow',
                'task',
                'worst case',
                'margin',
                'config',
                'uxtaskgetstackhighwatermark',
                'mpu',
                'guard',
            ],
            minWords: 30,
            hint: 'Discuss estimation, high-watermark APIs, testing load, and mitigations after overflow.',
        },
        {
            text:
                'Explain how you would validate that DMA and caches are safe for a peripheral buffer on a Cortex-M class device.',
            keywords: [
                'dma',
                'cache',
                'coherent',
                'invalidate',
                'clean',
                'align',
                'sram',
                'peripheral',
                'buffer',
                'mpu',
                'memory',
                'cortex',
            ],
            minWords: 35,
            hint: 'Mention alignment, D-cache clean/invalidate, non-cacheable regions, and DMA completion before CPU reads.',
        },
        {
            text:
                'How do you approach power management when the product must wake on a button or RTC — what do you verify in software?',
            keywords: [
                'wake',
                'sleep',
                'stop',
                'standby',
                'exti',
                'rtc',
                'wakeup',
                'clock',
                'low power',
                'peripheral',
                'gpio',
            ],
            minWords: 30,
            hint: 'Cover wake sources, re-init after wake, latency, and peripheral gating.',
        },
        {
            text:
                'Last question: what would you improve in our interview process or in how embedded teams collaborate with hardware? Thank you — that concludes the mock interview.',
            keywords: [
                'collaboration',
                'schematic',
                'review',
                'communication',
                'documentation',
                'hardware',
                'feedback',
                'process',
                'team',
                'handoff',
            ],
            minWords: 20,
            hint: 'Brief, constructive ideas (docs, early HW involvement, signal integrity reviews) work well.',
        },
    ];

    /**
     * @param {number} index
     * @param {string} answer
     * @returns {{ score: number, maxScore: number, matched: string[], missing: string[], feedback: string[] }}
     */
    function evaluateAnswer(index, answer) {
        const q = questions[index];
        const raw = (answer || '').trim();
        const lower = raw.toLowerCase();
        const words = raw ? raw.split(/\s+/) : [];
        const matched = [];
        for (const kw of q.keywords) {
            if (lower.includes(kw.toLowerCase())) {
                matched.push(kw);
            }
        }
        const missing = q.keywords.filter((k) => !matched.includes(k));
        const ratio = q.keywords.length ? matched.length / q.keywords.length : 0;

        let score = Math.round(ratio * 7);
        const wc = words.length;
        if (wc >= 12) score += 1;
        if (wc >= Math.max(q.minWords, 20)) score += 1;
        if (wc < 8) score = Math.min(score, 3);
        if (wc < Math.floor(q.minWords * 0.4)) score = Math.min(score, 2);

        score = Math.min(10, Math.max(0, score));

        const feedback = [];
        if (matched.length) {
            feedback.push('Topics you touched: ' + matched.slice(0, 8).join(', ') + (matched.length > 8 ? '…' : '') + '.');
        } else {
            feedback.push('Try to use vocabulary from embedded practice (peripherals, RTOS, debug, hardware).');
        }
        if (missing.length > 0 && score < 8) {
            feedback.push('Consider also mentioning: ' + missing.slice(0, 5).join(', ') + (missing.length > 5 ? '…' : '') + '.');
        }
        if (wc < q.minWords * 0.5) {
            feedback.push('Answer is quite short for this question — aim for at least ~' + q.minWords + ' words with concrete examples.');
        } else if (wc >= q.minWords) {
            feedback.push('Good length for a spoken-style answer.');
        }
        feedback.push('Tip: ' + q.hint);

        return { score, maxScore: 10, matched, missing, feedback };
    }

    window.mockInterviewData = {
        questions,
        evaluateAnswer,
        sourceNote: 'Question bank from InterviewPreperationAgent/interview_agent.py (text mode; no voice).',
    };
})();
