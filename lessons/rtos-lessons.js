/**
 * RTOS / FreeRTOS — beginner-first lessons (FreeRTOS.org references only)
 */

window.rtosLessons = [
    {
        title: "What Is an RTOS? (Start Here)",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 1 — Big picture</p>
            <h2>If you have never used an RTOS, read this first</h2>
            <p>An operating system is software that manages the CPU and helps multiple pieces of work <strong>share one processor</strong>. A <strong>Real-Time Operating System (RTOS)</strong> is designed so that important work can run when it needs to, within predictable time limits.</p>
            <p><strong>“Real-time” does not always mean “very fast.”</strong> It often means <em>deterministic</em>: you can reason about <em>when</em> things run and how long waits can be.</p>

            <h3>Bare-metal vs RTOS (simple analogy)</h3>
            <ul>
                <li><strong>Bare-metal:</strong> One big loop does everything in order. If one part waits for a slow event, you must structure the code carefully so nothing important is delayed too long.</li>
                <li><strong>RTOS:</strong> You split work into <strong>tasks</strong>. Each task looks like a small program. If one task waits (for a delay, or for data from another task), the CPU can run a <em>different</em> task in the meantime.</li>
            </ul>

            <div class="info-box tip">
                <div class="info-box-title">What you will learn in these lessons</div>
                <p>Tasks, <strong>task handles</strong>, how <strong>task creation</strong> works (every argument), the <strong>scheduler</strong>, <strong>delays</strong>, <strong>semaphores</strong>, <strong>mutexes</strong>, <strong>queues</strong>, and a few advanced ideas—explained in plain language with FreeRTOS-style examples.</p>
            </div>

            <p>We use <strong>FreeRTOS</strong> naming because it is widely used on STM32 and documented at <a href="https://www.freertos.org/" target="_blank" rel="noopener">FreeRTOS.org</a>. Other RTOS products use similar ideas.</p>
        `
    },
    {
        title: "Tasks: The Building Blocks",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 2 — Tasks</p>
            <h2>What is a task?</h2>
            <p>A <strong>task</strong> is an independent thread of execution: a C function that usually runs forever in a loop. Each task has:</p>
            <ul>
                <li>Its own <strong>stack</strong> (memory for local variables and function calls)</li>
                <li>A <strong>priority</strong> (used by the scheduler to decide who runs first)</li>
                <li>A <strong>state</strong> (running, ready, blocked, suspended—covered later)</li>
            </ul>

            <h3>Task function prototype</h3>
            <p>In FreeRTOS, a task function has this shape:</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Task function</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>void vMyTask(void *pvParameters)
{
    /* Optional: use data passed at creation time */
    (void)pvParameters;

    for (;;)   /* same as while(1) — runs forever */
    {
        /* Do useful work here */

        /* Then wait in a "blocking" call so other tasks get CPU time */
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}</code></pre>
                </div>
            </div>

            <p>The <strong>kernel</strong> (the RTOS core) calls this function for you after you <strong>create</strong> the task and <strong>start the scheduler</strong>. You never call <code>vMyTask()</code> from <code>main()</code> yourself—that would bypass the RTOS.</p>

            <div class="info-box note">
                <div class="info-box-title">Why an infinite loop?</div>
                <p>A task is meant to live as long as your application needs that work. If the work finishes, you can <strong>delete</strong> the task from inside it or from another task. Many embedded tasks never “finish”—they repeat forever with delays or waits in between.</p>
            </div>
        `
    },
    {
        title: "Task Handle (TaskHandle_t) Explained",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 3 — Handles</p>
            <h2>What is a task handle?</h2>
            <p>When the kernel creates a task, it builds an internal control block (metadata: stack pointer, priority, state, name, etc.). Your application does not access that structure directly. Instead, you get a <strong>handle</strong>: a variable of type <code>TaskHandle_t</code>.</p>
            <p>Think of a handle like a <strong>ticket number</strong> at a service desk: it identifies <em>which</em> task you mean when you ask the kernel to do something to that task.</p>

            <h3>Declaring a handle</h3>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">TaskHandle_t</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>#include "task.h"

TaskHandle_t xBlinkHandle = NULL;   /* Global or static — often NULL until created */</code></pre>
                </div>
            </div>

            <h3>What you use a handle for (examples)</h3>
            <ul>
                <li><strong>Delete</strong> the task: <code>vTaskDelete(xBlinkHandle)</code></li>
                <li><strong>Suspend / resume</strong>: <code>vTaskSuspend</code>, <code>vTaskResume</code></li>
                <li><strong>Notifications</strong>: <code>xTaskNotify</code>, etc., target a specific task</li>
                <li><strong>Inspect</strong> stack usage: <code>uxTaskGetStackHighWaterMark(xBlinkHandle)</code></li>
            </ul>

            <div class="info-box tip">
                <div class="info-box-title">Can the handle be NULL?</div>
                <p>When you create a task, you may pass <code>NULL</code> as the last parameter of <code>xTaskCreate</code> if you <strong>never</strong> need to refer to that task later. If you want to delete, suspend, or measure that task, store the handle in a <code>TaskHandle_t</code> variable.</p>
            </div>
        `
    },
    {
        title: "Creating Tasks: xTaskCreate — Every Argument",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 4 — Creation API</p>
            <h2><code>xTaskCreate</code> in FreeRTOS</h2>
            <p>The usual function to create a task dynamically (memory from the RTOS heap) is <code>xTaskCreate</code>. Official reference: <a href="https://www.freertos.org/a00019.html" target="_blank" rel="noopener">Task creation</a>.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Function signature (typical)</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>BaseType_t xTaskCreate(
    TaskFunction_t pvTaskCode,           /* 1 */
    const char * const pcName,           /* 2 */
    configSTACK_DEPTH_TYPE usStackDepth, /* 3 */
    void *pvParameters,                  /* 4 */
    UBaseType_t uxPriority,              /* 5 */
    TaskHandle_t *pxCreatedTask          /* 6 */
);</code></pre>
                </div>
            </div>

            <h3>1. <code>pvTaskCode</code> — pointer to the task function</h3>
            <p>This is the C function the kernel will run (for example <code>vMyTask</code>). Type <code>TaskFunction_t</code> means “function that returns void and takes one <code>void *</code> parameter.”</p>

            <h3>2. <code>pcName</code> — human-readable name (for debugging)</h3>
            <p>A short string, e.g. <code>"Blink"</code>. It does not affect scheduling. Debuggers and trace tools show this name. Keep it short to save RAM.</p>

            <h3>3. <code>usStackDepth</code> — stack size in words, not bytes</h3>
            <p>On many Cortex-M ports, one “word” is <strong>4 bytes</strong>. So <code>128</code> often means 128 × 4 = 512 bytes. If the stack is too small, the task crashes mysteriously; if too large, you waste RAM. Later you can tune using stack “high water mark” functions.</p>

            <h3>4. <code>pvParameters</code> — pointer passed to the task (one pointer only)</h3>
            <p>Whatever address you pass here becomes <code>pvParameters</code> inside the task function. Use it to pass a struct address, a numeric value cast to <code>void *</code>, or <code>NULL</code> if you do not need data.</p>

            <h3>5. <code>uxPriority</code> — priority number</h3>
            <p><strong>Higher number = higher priority</strong> (in FreeRTOS). Valid range depends on <code>configMAX_PRIORITIES</code> in <code>FreeRTOSConfig.h</code>. The idle task runs at priority 0.</p>

            <h3>6. <code>pxCreatedTask</code> — where to store the task handle</h3>
            <p>Pass the address of a <code>TaskHandle_t</code> variable, e.g. <code>&amp;xBlinkHandle</code>, or <code>NULL</code> if you do not need the handle.</p>

            <h3>Return value</h3>
            <p><code>pdPASS</code> means success. If task creation fails (often out of heap memory), it returns an error code—always check in development.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Minimal example</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>TaskHandle_t xHandle = NULL;

void vStartTasks(void)
{
    if (xTaskCreate(
            vMyTask,           /* task function */
            "MyTask",          /* name */
            256,               /* stack words */
            NULL,              /* no parameter */
            tskIDLE_PRIORITY + 1,
            &amp;xHandle) != pdPASS)
    {
        /* Creation failed — handle error */
    }
}</code></pre>
                </div>
            </div>
        `
    },
    {
        title: "Static Task Creation (Brief)",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 5 — Static option</p>
            <h2><code>xTaskCreateStatic</code></h2>
            <p>Sometimes you must not use the heap (safety-critical systems). FreeRTOS lets you supply the task’s stack buffer and task control block (TCB) yourself with <code>xTaskCreateStatic</code>. The <strong>ideas</strong> are the same: same task function, priority, parameters—but you pre-allocate memory.</p>
            <p>For your first projects, <code>xTaskCreate</code> is enough. See the <a href="https://www.freertos.org/a00019.html" target="_blank" rel="noopener">Task API</a> when you need static allocation.</p>
        `
    },
    {
        title: "Starting the Scheduler and the Idle Task",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 6 — Scheduler</p>
            <h2><code>vTaskStartScheduler()</code></h2>
            <p>After you create one or more tasks, you call <code>vTaskStartScheduler()</code>. This function:</p>
            <ul>
                <li>Starts the RTOS tick timer (the “heartbeat” of the system)</li>
                <li>Creates the <strong>idle task</strong> (priority zero—it runs when no other task is ready)</li>
                <li>Optionally creates the <strong>timer service task</strong> if software timers are enabled</li>
                <li>Begins scheduling: the highest-priority ready task runs</li>
            </ul>
            <p>In a normal system, <code>vTaskStartScheduler()</code> <strong>never returns</strong>. If it returns, the scheduler failed to start (e.g. not enough heap for idle task).</p>

            <div class="info-box note">
                <div class="info-box-title">Where does <code>main()</code> go?</div>
                <p>Typically <code>main()</code> sets up hardware, creates tasks, then calls <code>vTaskStartScheduler()</code>. Code after that line in <code>main()</code> does not run unless the scheduler fails. All ongoing work happens inside tasks (and ISRs).</p>
            </div>
        `
    },
    {
        title: "Ticks, Time, and Delays",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 7 — Time</p>
            <h2>What is a tick?</h2>
            <p>The kernel configures a periodic interrupt (often from SysTick on Cortex-M). Each interrupt is one <strong>tick</strong>. The tick rate is set by <code>configTICK_RATE_HZ</code> in <code>FreeRTOSConfig.h</code> (e.g. 1000 Hz means one tick per millisecond).</p>
            <p>Delays and timeouts are often specified in <strong>ticks</strong>. The macro <code>pdMS_TO_TICKS(milliseconds)</code> converts milliseconds to ticks at compile time (with care if the tick rate changes).</p>

            <h3><code>vTaskDelay</code> — relative delay</h3>
            <p>Blocks the <em>current</em> task for at least N ticks <strong>from now</strong>. Other tasks can run during this time.</p>

            <h3><code>vTaskDelayUntil</code> — fixed-rate periodic work</h3>
            <p>For control loops or sampling at a fixed period, use <code>vTaskDelayUntil</code> so timing does not drift when the work duration changes. You store the last wake time in a variable and pass it each iteration.</p>

            <p>Reference: <a href="https://www.freertos.org/a00012.html" target="_blank" rel="noopener">Task control</a>.</p>
        `
    },
    {
        title: "Scheduling: Who Runs, and When",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 8 — Scheduler</p>
            <h2>Preemptive priority scheduling (default)</h2>
            <p>With preemption enabled, the kernel always runs the <strong>highest-priority task that is in the Ready state</strong>. If that task blocks or delays, the next-highest ready task runs.</p>

            <h3>Task states (simplified)</h3>
            <ul>
                <li><strong>Running</strong> — currently using the CPU (one task per core on single-core)</li>
                <li><strong>Ready</strong> — able to run, waiting only for CPU because another task has higher priority</li>
                <li><strong>Blocked</strong> — waiting for time (<code>vTaskDelay</code>) or an event (queue, semaphore, etc.)</li>
                <li><strong>Suspended</strong> — explicitly suspended; does not run until resumed</li>
            </ul>

            <h3>Equal priorities</h3>
            <p>If several ready tasks share the same priority, they usually take <strong>turns</strong> in time slices (if time slicing is enabled in config).</p>

            <h3>Preemption</h3>
            <p>If a <strong>high-priority</strong> task becomes ready while a <strong>low-priority</strong> task is running, the kernel can <strong>preempt</strong> (interrupt) the low-priority task and switch to the high-priority one. That switch is a <strong>context switch</strong>.</p>

            <div class="info-box note">
                <div class="info-box-title">Starvation</div>
                <p>If a high-priority task <strong>never blocks</strong>, lower-priority tasks (and sometimes the idle task’s housekeeping) may never run. Design tasks so high-priority work still yields or blocks when appropriate.</p>
            </div>
        `
    },
    {
        title: "Semaphores: Idea and Binary Semaphore",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 9 — Semaphores</p>
            <h2>Why semaphores?</h2>
            <p>Tasks often need to <strong>coordinate</strong>: “wait until something happens” or “signal that something is ready.” A <strong>semaphore</strong> is a kernel object that holds a <strong>count</strong>. Tasks <strong>take</strong> (wait for / decrement) and <strong>give</strong> (signal / increment) using API functions.</p>

            <h3>Binary semaphore (count 0 or 1)</h3>
            <p>Often used as a <strong>flag</strong> or <strong>signal</strong> between two tasks (or between an ISR and a task):</p>
            <ul>
                <li><strong>Give</strong> — “event happened” (e.g. data received)</li>
                <li><strong>Take</strong> — wait until the event, then consume the signal</li>
            </ul>
            <p>In FreeRTOS, binary semaphores are created with <code>xSemaphoreCreateBinary()</code> (or counting variants). Access uses <code>xSemaphoreTake</code> and <code>xSemaphoreGive</code> for task context.</p>

            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Typical pattern (task)</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>/* Wait up to 100 ms for a signal */
if (xSemaphoreTake(xSem, pdMS_TO_TICKS(100)) == pdTRUE)
{
    /* Event occurred — handle it */
}</code></pre>
                </div>
            </div>

            <p>Full API: <a href="https://www.freertos.org/a00024.html" target="_blank" rel="noopener">Semaphore / mutex</a>.</p>

            <div class="info-box tip">
                <div class="info-box-title">Beginner mistake</div>
                <p>Do not use a binary semaphore to protect a shared data structure if <strong>priority inversion</strong> is a risk—use a <strong>mutex</strong> (next lessons). Binary semaphores are best for <em>signaling</em>, not always for <em>mutual exclusion</em>.</p>
            </div>
        `
    },
    {
        title: "Counting Semaphores",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 10 — Counting</p>
            <h2>When the count can be greater than one</h2>
            <p>A <strong>counting semaphore</strong> tracks <em>how many units</em> of something are available—empty slots in a buffer, free blocks in a pool, etc. The count goes up when resources are freed (<strong>give</strong>) and down when they are taken (<strong>take</strong>).</p>
            <p>Example: three identical buffers. Counting semaphore initial count = 3. A task <strong>takes</strong> when it claims a buffer; when done, it <strong>gives</strong> to return the buffer to the pool.</p>
            <p>Create with something like <code>xSemaphoreCreateCounting(maxCount, initialCount)</code> (exact name and parameters depend on your FreeRTOS version—check the <a href="https://www.freertos.org/a00024.html" target="_blank" rel="noopener">API reference</a>).</p>
        `
    },
    {
        title: "Mutexes: Protecting Shared Resources",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 11 — Mutexes</p>
            <h2>What is a mutex?</h2>
            <p><strong>Mutex</strong> means <strong>mutual exclusion</strong>: only <strong>one</strong> task at a time may hold the mutex. Use it when two or more tasks access the <strong>same memory or hardware</strong> and you must prevent them from interleaving in a dangerous way.</p>

            <h3>Take → use shared resource → give</h3>
            <div class="code-block">
                <div class="code-header">
                    <span class="code-filename">Pattern</span>
                    <button class="copy-btn">Copy</button>
                </div>
                <div class="code-content">
                    <pre><code>if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE)
{
    /* Critical section: only one task at a time here */
    SharedBuffer[index++] = value;
    xSemaphoreGive(xMutex);
}</code></pre>
                </div>
            </div>

            <h3>Mutex vs binary semaphore (for beginners)</h3>
            <table class="lesson-table">
                <tr><th>Topic</th><th>Mutex</th><th>Binary semaphore</th></tr>
                <tr><td>Typical use</td><td>Protect shared data or hardware</td><td>Signal events between tasks</td></tr>
                <tr><td>Priority inheritance</td><td>Often available (helps with priority inversion)</td><td>Not for that purpose</td></tr>
                <tr><td>Who “owns” it</td><td>Conceptually the task that took it should give it</td><td>Often ISR gives, task takes</td></tr>
            </table>

            <h3>Priority inversion (intuitive)</h3>
            <p>Imagine three tasks: Low, Medium, High. Low holds a mutex. High needs the same mutex and must wait. Medium runs and keeps preempting Low—so High waits for Medium even though High has higher priority than Medium. That bad situation is <strong>priority inversion</strong>. FreeRTOS mutexes can use <strong>priority inheritance</strong> to boost Low temporarily so it finishes the critical section faster.</p>

            <p>API: <a href="https://www.freertos.org/a00024.html" target="_blank" rel="noopener">Mutex functions</a> such as <code>xSemaphoreCreateMutex</code>.</p>
        `
    },
    {
        title: "Queues: Sending Data Between Tasks",
        content: `
            <p class="lesson-track"><span class="difficulty intermediate">Intermediate</span> Part 12 — Queues</p>
            <h2>Why queues?</h2>
            <p>A <strong>queue</strong> is a FIFO buffer managed by the kernel. Tasks (and ISRs, with special APIs) can <strong>send</strong> fixed-size items and <strong>receive</strong> them. Queues are ideal when you need to pass <strong>data</strong>, not just a yes/no signal.</p>
            <ul>
                <li><code>xQueueCreate(nItems, itemSizeBytes)</code> — create queue</li>
                <li><code>xQueueSend</code> — put item (may block if full)</li>
                <li><code>xQueueReceive</code> — get item (may block if empty)</li>
            </ul>
            <p>Common pattern: one task produces sensor samples, another consumes them from the queue—no busy-waiting.</p>
            <p>Reference: <a href="https://www.freertos.org/a00018.html" target="_blank" rel="noopener">Queue API</a>.</p>
        `
    },
    {
        title: "Software Timers (Overview)",
        content: `
            <p class="lesson-track"><span class="difficulty intermediate">Intermediate</span> Part 13 — Timers</p>
            <h2>Daemon task</h2>
            <p>FreeRTOS can run <strong>software timers</strong>: callbacks that fire periodically or once after a delay. The callbacks execute in the <strong>timer service task</strong> (a dedicated task), <strong>not</strong> in interrupt context—so keep callbacks short and defer heavy work to a worker task.</p>
            <p>Requires <code>configUSE_TIMERS</code> and correct priority/stack for the timer task in <code>FreeRTOSConfig.h</code>.</p>
            <p>Link: <a href="https://www.freertos.org/RTOS-software-timer.html" target="_blank" rel="noopener">Software timers</a>.</p>
        `
    },
    {
        title: "Interrupts and FromISR Functions",
        content: `
            <p class="lesson-track"><span class="difficulty intermediate">Intermediate</span> Part 14 — ISRs</p>
            <h2>ISRs must stay short</h2>
            <p>Hardware interrupts (button, UART RX, timer flags) run in <strong>ISR context</strong>. There you should:</p>
            <ol>
                <li>Clear interrupt flags</li>
                <li>Copy minimal data if needed</li>
                <li>Signal a task via <strong>FromISR</strong> APIs (<code>xQueueSendFromISR</code>, <code>xSemaphoreGiveFromISR</code>, etc.)</li>
            </ol>
            <p>Do <strong>not</strong> call normal <code>xSemaphoreTake</code> or <code>vTaskDelay</code> from an ISR—they can block. Use the <strong>FromISR</strong> variants and often request a <strong>context switch</strong> before the ISR returns if a higher-priority task was woken.</p>
            <p>Read: <a href="https://www.freertos.org/a00016.html" target="_blank" rel="noopener">ISRs</a>.</p>
        `
    },
    {
        title: "Task Notifications (Lightweight Signals)",
        content: `
            <p class="lesson-track"><span class="difficulty intermediate">Intermediate</span> Part 15 — Notifications</p>
            <h2>One task, one notification slot</h2>
            <p>Each task has a <strong>notification</strong> value in the kernel. <code>xTaskNotify</code> / <code>xTaskNotifyWait</code> can replace a binary semaphore or queue in simple cases where <strong>only one task</strong> waits for the signal—saving RAM and CPU.</p>
            <p>Link: <a href="https://www.freertos.org/RTOS-task-notifications.html" target="_blank" rel="noopener">Task notifications</a>.</p>
        `
    },
    {
        title: "Memory: Heap and Per-Task Stacks",
        content: `
            <p class="lesson-track"><span class="difficulty intermediate">Intermediate</span> Part 16 — Memory</p>
            <h2>Heap</h2>
            <p>Dynamic objects (tasks from <code>xTaskCreate</code>, queues, semaphores) use memory from the RTOS <strong>heap</strong>. Size is set by <code>configTOTAL_HEAP_SIZE</code> and the chosen <code>heap_x.c</code> implementation.</p>
            <h2>Per-task stack</h2>
            <p>Each task’s stack holds return addresses, local variables, and saved registers. Undersized stacks cause hard-to-debug faults. During development, use stack high-water APIs to find how much margin you have.</p>
            <p>Link: <a href="https://www.freertos.org/a00111.html" target="_blank" rel="noopener">Memory management</a>.</p>
        `
    },
    {
        title: "Putting It Together + Where to Go Next",
        content: `
            <p class="lesson-track"><span class="difficulty beginner">Beginner</span> Part 17 — Summary</p>
            <h2>Minimal mental model</h2>
            <ol>
                <li>Create tasks with <code>xTaskCreate</code>; store <code>TaskHandle_t</code> if you need control later.</li>
                <li>Call <code>vTaskStartScheduler()</code>; ongoing logic lives in tasks.</li>
                <li>Use <strong>priority</strong> and <strong>blocking</strong> (delay, queue, semaphore) so the CPU shares time fairly.</li>
                <li>Use <strong>mutex</strong> for shared resources; <strong>binary semaphore</strong> often for signaling; <strong>queue</strong> for data.</li>
                <li>Keep ISRs short; use <strong>FromISR</strong> APIs to wake tasks.</li>
            </ol>

            <h2>Official documentation</h2>
            <ul>
                <li><a href="https://www.freertos.org/Documentation/RTOS_book.html" target="_blank" rel="noopener">Mastering the FreeRTOS kernel</a> (book)</li>
                <li><a href="https://www.freertos.org/RTOS.html" target="_blank" rel="noopener">Kernel feature list</a></li>
                <li><a href="https://www.freertos.org/a00110.html" target="_blank" rel="noopener"><code>FreeRTOSConfig.h</code></a></li>
                <li><a href="https://www.freertos.org/FAQ.html" target="_blank" rel="noopener">FAQ</a></li>
            </ul>

            <div class="info-box tip">
                <div class="info-box-title">Practice</div>
                <p>After reading these lessons, the fastest way to learn is to build a small project: two tasks blinking different LEDs at different rates, then add a queue or mutex and watch how behavior changes. Use the official docs for exact function names in your FreeRTOS version.</p>
            </div>
        `
    }
];
