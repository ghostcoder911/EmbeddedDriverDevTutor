# 🎓 Complete RTOS Study Guide for Embedded Systems
## Mastering Real-Time Operating Systems with FreeRTOS on STM32

---

## Official FreeRTOS documentation (reference)

Use these alongside this guide and your own hands-on projects on a board or simulator:

| Resource | URL |
|----------|-----|
| **FreeRTOS home** | [https://www.freertos.org/](https://www.freertos.org/) |
| **Kernel quick start** | [https://www.freertos.org/Documentation/RTOS_book.html](https://www.freertos.org/Documentation/RTOS_book.html) |
| **Kernel features & API index** | [https://www.freertos.org/RTOS.html](https://www.freertos.org/RTOS.html) |
| **Task API** | [https://www.freertos.org/a00019.html](https://www.freertos.org/a00019.html) |
| **Queue API** | [https://www.freertos.org/a00018.html](https://www.freertos.org/a00018.html) |
| **Semaphore / mutex API** | [https://www.freertos.org/a00024.html](https://www.freertos.org/a00024.html) |
| **Software timers** | [https://www.freertos.org/RTOS-software-timer.html](https://www.freertos.org/RTOS-software-timer.html) |
| **Config options (`FreeRTOSConfig.h`)** | [https://www.freertos.org/a00110.html](https://www.freertos.org/a00110.html) |

---

# Table of Contents

## Part A: RTOS Theory - Deep Dive
1. [RTOS Fundamentals](#part-a-rtos-theory-fundamentals)
2. [Processes vs Threads vs Tasks](#processes-vs-threads-vs-tasks)
3. [Scheduling Theory](#scheduling-theory)
4. [Synchronization Mechanisms](#synchronization-mechanisms)
5. [Inter-Process Communication (IPC)](#inter-process-communication-theory)
6. [Deadlocks and Resource Management](#deadlocks-and-resource-management)
7. [Real-Time Constraints](#real-time-constraints)
8. [RTOS Architecture](#rtos-architecture)

## Part B: FreeRTOS Practical Implementation
1. [Introduction to RTOS](#1-introduction-to-rtos)
2. [Understanding Tasks](#2-understanding-tasks)
3. [Task States and Scheduling](#3-task-states-and-scheduling)
4. [Task Priorities](#4-task-priorities)
5. [Task Delays and Timing](#5-task-delays-and-timing)
6. [Inter-Task Communication](#6-inter-task-communication)
7. [Semaphores](#7-semaphores)
8. [Mutexes](#8-mutexes)
9. [Queues](#9-queues)
10. [Software Timers](#10-software-timers)
11. [Interrupt Handling in RTOS](#11-interrupt-handling-in-rtos)
12. [Task Notifications](#12-task-notifications)
13. [Memory Management](#13-memory-management)
14. [Practical exercises](#14-practical-exercises)

---

# PART A: RTOS THEORY - DEEP DIVE

---

# RTOS Fundamentals

## What is Real-Time?

**Real-Time** doesn't mean "fast" - it means **predictable** and **deterministic**. A real-time system must respond to events within a guaranteed time constraint, called a **deadline**.

### Types of Real-Time Systems:

#### 1. Hard Real-Time Systems
- **Definition**: Missing a deadline results in catastrophic failure
- **Deadline Tolerance**: ZERO - deadlines are absolute
- **Examples**:
  - **Anti-lock Braking System (ABS)**: Must respond within milliseconds or crash occurs
  - **Airbag Deployment**: Must trigger within 20-30ms of impact detection
  - **Pacemaker**: Must deliver electrical pulses at precise intervals or heart fails
  - **Nuclear Reactor Control**: Must respond instantly to prevent meltdown
  - **Flight Control Systems**: Delayed response = aircraft crash

**Consequence of Missing Deadline**: Loss of life, property damage, system failure

#### 2. Soft Real-Time Systems
- **Definition**: Missing occasional deadlines is tolerable but degrades quality
- **Deadline Tolerance**: Some flexibility - occasional misses acceptable
- **Examples**:
  - **Video Streaming**: Dropped frames cause stuttering but system continues
  - **VoIP Phone Calls**: Delayed packets cause jitter but call doesn't drop
  - **Online Gaming**: Lag affects experience but game playable
  - **ATM Transactions**: Slow response is annoying but acceptable
  - **Video Conferencing**: Quality degrades but communication continues

**Consequence of Missing Deadline**: Reduced quality of service, user dissatisfaction

#### 3. Firm Real-Time Systems
- **Definition**: Results after deadline are useless but not catastrophic
- **Deadline Tolerance**: Medium - late results are discarded
- **Examples**:
  - **Video Frame Processing**: Late frames are dropped but next frame processed
  - **Stock Trading Systems**: Old price data is useless but system continues
  - **Industrial Robot Vision**: Late image processing skipped for next cycle
  - **Weather Data Collection**: Old sensor reading discarded, wait for next

**Consequence of Missing Deadline**: Wasted computation, degraded performance

---

## Operating System Basics

### What is an Operating System?

An **Operating System (OS)** is a software layer that manages:

1. **Hardware Resources**:
   - CPU (processor time allocation)
   - Memory (RAM management)
   - I/O Devices (peripherals, sensors, actuators)
   - Storage (if available)

2. **Process/Task Management**:
   - Creating and destroying processes
   - Scheduling (deciding which process runs when)
   - Inter-process communication
   - Synchronization

3. **Memory Management**:
   - Allocating/deallocating memory
   - Virtual memory (if applicable)
   - Memory protection
   - Heap and stack management

4. **File System Management** (Desktop OS):
   - Creating, deleting, reading, writing files
   - Directory structures
   - File permissions

5. **Device Management**:
   - Device drivers
   - Interrupt handling
   - I/O operations

### General Purpose OS vs RTOS

| Aspect | General Purpose OS | RTOS |
|--------|-------------------|------|
| **Primary Goal** | Maximize throughput, fairness | Meet timing deadlines |
| **Scheduling** | Time-sharing, fair scheduling | Priority-based, preemptive |
| **Response Time** | Variable, unpredictable | Bounded, deterministic |
| **Throughput** | High (more work per time) | Lower (prioritizes deadlines) |
| **Resource Sharing** | Fair sharing among all | Priority-based allocation |
| **Context Switch** | Can be slow (milliseconds) | Must be fast (microseconds) |
| **Interrupt Latency** | Variable, can be long | Bounded, must be minimal |
| **Examples** | Windows, Linux, macOS | FreeRTOS, VxWorks, QNX |
| **Use Cases** | Desktop, servers, multimedia | Industrial, automotive, medical |

---

## RTOS Core Principles

### 1. Determinism

**Determinism** means the system's behavior is predictable and repeatable.

**Key Aspects**:
- **Same Input → Same Output**: Given identical inputs and conditions, the system produces identical outputs
- **Timing Predictability**: Execution time is bounded and known
- **No Random Delays**: No unpredictable delays from garbage collection, page faults, etc.

**Example**:
- **Deterministic**: Sensor reading takes 10-15 microseconds every time
- **Non-Deterministic**: Sensor reading takes anywhere from 5-500 microseconds randomly

### 2. Responsiveness

**Responsiveness** is the system's ability to react quickly to external events.

**Measured By**:
- **Interrupt Latency**: Time from interrupt signal to interrupt handler execution
  - **Best RTOS**: < 1-5 microseconds
  - **Acceptable RTOS**: < 50 microseconds
  - **Poor RTOS**: > 100 microseconds

- **Task Switch Time**: Time to switch from one task to another
  - **Typical**: 1-10 microseconds

- **Jitter**: Variation in response time
  - **Good**: < 1% variation
  - **Poor**: > 10% variation

### 3. Priority-Based Scheduling

Higher priority tasks **always** preempt lower priority tasks.

**Rule**: If Task A (priority 5) is running and Task B (priority 7) becomes ready, Task B immediately preempts Task A.

### 4. Preemption

**Preemption** is the ability to interrupt a running task and switch to a higher priority task immediately.

**Types**:
- **Preemptive**: Scheduler can interrupt any task at any time
- **Cooperative**: Tasks must voluntarily yield control
- **Hybrid**: Critical sections non-preemptive, rest preemptive

---

# Processes vs Threads vs Tasks

## Understanding the Terminology

### Process (Heavy-Weight Entity)

**Definition**: A process is an independent program in execution with its own memory space.

**Characteristics**:
- **Isolated Memory Space**: Each process has its own address space
- **Protected**: One process cannot access another's memory directly
- **Independent**: Crash in one process doesn't affect others
- **Heavyweight**: Creating/destroying is expensive (milliseconds)
- **IPC Required**: Must use special mechanisms to communicate
- **Context Switch**: Expensive (save/restore entire memory mapping)

**Memory Layout of a Process**:
```
┌──────────────────────────────────────┐ High Address
│        Command Line Args & Env       │
├──────────────────────────────────────┤
│             Stack (grows down)       │
│                  ↓                   │
│                                      │
│         (Free Memory)                │
│                                      │
│                  ↑                   │
│             Heap (grows up)          │
├──────────────────────────────────────┤
│         Uninitialized Data (BSS)     │
├──────────────────────────────────────┤
│         Initialized Data             │
├──────────────────────────────────────┤
│         Code (Text Segment)          │
└──────────────────────────────────────┘ Low Address
```

**Used In**: Desktop/Server OS (Windows, Linux, macOS)

**Example**: Running multiple applications - Chrome, Word, Spotify are separate processes

### Thread (Light-Weight Entity)

**Definition**: A thread is a lightweight execution unit within a process that shares the same memory space.

**Characteristics**:
- **Shared Memory**: All threads in a process share the same address space
- **Shared Resources**: Share global variables, heap, file descriptors
- **Private Stack**: Each thread has its own stack
- **Lightweight**: Creating/destroying is fast (microseconds)
- **Direct Communication**: Can access shared variables directly
- **Context Switch**: Fast (only save/restore registers and stack pointer)

**Memory Layout of Multi-Threaded Process**:
```
┌──────────────────────────────────────┐
│           SHARED MEMORY              │
│  ┌──────────────────────────────┐   │
│  │    Global Variables (Shared) │   │
│  ├──────────────────────────────┤   │
│  │    Heap (Shared)             │   │
│  ├──────────────────────────────┤   │
│  │    Code (Shared)             │   │
│  └──────────────────────────────┘   │
├──────────────────────────────────────┤
│        THREAD-PRIVATE MEMORY         │
│  ┌────────────┬────────────┬────────┤
│  │ Thread 1   │ Thread 2   │Thread 3│
│  │ Stack      │ Stack      │Stack   │
│  │ Registers  │ Registers  │Register│
│  └────────────┴────────────┴────────┘
└──────────────────────────────────────┘
```

**Used In**: Desktop/Server multithreading (pthread, Win32 threads, Java threads)

### Task (RTOS Specific)

**Definition**: In RTOS context, a **task** is similar to a thread - an independent execution unit with its own stack.

**Characteristics**:
- **Independent Stack**: Each task has private stack memory
- **Shared Global Memory**: All tasks share global variables and heap
- **Lightweight**: Optimized for embedded systems
- **Priority-Based**: Each task has a priority level
- **Deterministic**: Switching is fast and bounded

**In FreeRTOS**:
- "Task" is the term used (not "thread")
- All tasks share the same memory space
- Each task has its own stack allocated from heap
- Tasks communicate via queues, semaphores, mutexes

**Comparison Table**:

| Feature | Process | Thread | RTOS Task |
|---------|---------|--------|-----------|
| **Memory Space** | Separate | Shared | Shared |
| **Stack** | Private | Private | Private |
| **Heap** | Private | Shared | Shared |
| **Creation Cost** | High (ms) | Medium (μs) | Low (μs) |
| **Context Switch** | Expensive | Medium | Fast |
| **Protection** | Strong | Weak | Weak |
| **Communication** | IPC needed | Direct | Queues/Semaphores |
| **Typical Use** | Desktop OS | Desktop multithreading | Embedded RTOS |

---

# Scheduling Theory

## What is Scheduling?

**Scheduling** is the process of deciding which task/process gets to use the CPU at any given time.

**Scheduler's Job**:
1. Maintain list of all tasks and their states
2. Select which task should run next
3. Perform context switch to selected task
4. Handle preemption when higher priority task becomes ready

## Scheduling Terminology

### 1. CPU Burst
The time a task spends executing on the CPU continuously.

### 2. Waiting Time
Time spent by a task in the ready queue waiting for CPU.

### 3. Turnaround Time
Total time from task creation to completion:
```
Turnaround Time = Completion Time - Arrival Time
```

### 4. Response Time
Time from task creation to first execution:
```
Response Time = First Execution Time - Arrival Time
```

### 5. Context Switch
Saving the state of current task and loading the state of next task:
- Save: Program Counter, Registers, Stack Pointer
- Load: Program Counter, Registers, Stack Pointer of next task

### 6. Dispatch Latency
Time taken by scheduler to stop one task and start another:
- Stop current task
- Save context
- Select next task
- Load context
- Start next task

## Scheduling Algorithms

### 1. First-Come, First-Served (FCFS)

**Principle**: Tasks are executed in the order they arrive.

**Characteristics**:
- **Simple**: Easy to implement (just a queue)
- **Non-preemptive**: Running task completes before next starts
- **Fair**: Everyone gets turn eventually
- **Convoy Effect**: Short tasks wait for long tasks

**Pros**:
- Simple implementation
- No starvation (all tasks eventually run)

**Cons**:
- Long waiting times for short tasks
- Not suitable for real-time systems
- No priority support

**Example**:
```
Tasks: T1(10ms), T2(5ms), T3(2ms) arrive in that order

Timeline: |----T1----|--T2--|T3|
          0         10     15  17

Waiting Times: T1=0ms, T2=10ms, T3=15ms
Average Wait: 8.3ms
```

### 2. Shortest Job First (SJF)

**Principle**: Execute task with shortest execution time first.

**Characteristics**:
- **Optimal**: Minimizes average waiting time
- **Non-preemptive**: (in basic form)
- **Prediction Required**: Must know execution time in advance
- **Starvation Possible**: Long tasks may never run

**Example**:
```
Tasks: T1(10ms), T2(5ms), T3(2ms)

Timeline: |T3|--T2--|----T1----|
          0   2     7         17

Waiting Times: T3=0ms, T2=2ms, T1=7ms
Average Wait: 3ms (much better than FCFS!)
```

**Problem**: In real-time systems, we rarely know exact execution times.

### 3. Priority Scheduling

**Principle**: Each task has a priority; higher priority tasks execute first.

**Characteristics**:
- **Preemptive or Non-preemptive**
- **Flexible**: Different tasks can have different urgencies
- **Starvation Risk**: Low priority tasks may never run
- **Priority Inversion Problem**: High priority task blocked by low priority

**Priority Assignment**:
- **Static Priority**: Set at task creation, never changes
- **Dynamic Priority**: Changes based on behavior (waiting time, deadlines)

**Example**:
```
Tasks: T1(Priority=3), T2(Priority=5), T3(Priority=1)

Execution Order: T2 → T1 → T3
(Regardless of arrival order)
```

**Solution to Starvation**: **Aging**
- Gradually increase priority of waiting tasks
- Eventually, even lowest priority task gets high enough priority to run

### 4. Round-Robin (RR)

**Principle**: Each task gets a fixed time slice (quantum); tasks rotate in circular queue.

**Characteristics**:
- **Preemptive**: Task is preempted after time quantum expires
- **Fair**: All tasks get equal CPU time
- **No Starvation**: All tasks eventually get CPU
- **Time Quantum Critical**: Too small = overhead, too large = poor response

**Time Quantum Selection**:
- **Too Small (< 1ms)**: Excessive context switching overhead
- **Too Large (> 100ms)**: Poor responsiveness
- **Optimal (10-50ms)**: Balance between overhead and responsiveness

**Example**:
```
Tasks: T1(10ms), T2(5ms), T3(8ms)
Quantum: 3ms

Timeline: |T1|T2|T3|T1|T2|T3|T1|T3|
          0  3  6  9  12 15 18 21 23

Each task gets fair share of CPU
```

### 5. Rate Monotonic Scheduling (RMS)

**Principle**: Assign priorities based on task period - shorter period = higher priority.

**Characteristics**:
- **Static Priority**: Priorities set once based on periods
- **Optimal Static**: Best static priority algorithm for periodic tasks
- **CPU Utilization Bound**: Can guarantee scheduling if:
  ```
  CPU Utilization ≤ n × (2^(1/n) - 1)
  
  For n=2: ≤ 82.8%
  For n=3: ≤ 78.0%
  For n→∞: ≤ 69.3%
  ```

**Example**:
```
Task T1: Period = 10ms, Execution = 3ms, Priority = HIGH
Task T2: Period = 20ms, Execution = 5ms, Priority = LOW

Timeline (0-40ms):
|T1|  |T1|  |T1|  |T1|  
   |T2|   |T2|   |T2|   |T2|

T1 runs every 10ms (higher priority - shorter period)
T2 runs when T1 is not running
```

### 6. Earliest Deadline First (EDF)

**Principle**: Assign priorities based on deadlines - closest deadline = highest priority.

**Characteristics**:
- **Dynamic Priority**: Changes as deadlines approach
- **Optimal Dynamic**: Can schedule any feasible task set
- **CPU Utilization**: Can use 100% CPU if all tasks meet deadlines
- **Complexity**: More complex to implement than RMS

**Example**:
```
At t=0:
Task T1: Deadline at t=15ms, Execution=4ms
Task T2: Deadline at t=10ms, Execution=3ms

Timeline:
|--T2--|--T1---|
0      3        7

T2 runs first (deadline at 10ms comes before T1's 15ms)
```

### 7. Priority Inheritance Protocol

**Principle**: Temporarily boost low-priority task's priority when it blocks a high-priority task.

**Purpose**: Solve priority inversion problem.

**How It Works**:
1. Low priority task locks resource
2. High priority task needs same resource → blocked
3. Low priority task **inherits** high priority temporarily
4. Low priority task completes quickly (at high priority)
5. Low priority task releases resource
6. High priority task acquires resource and runs
7. Low priority task returns to original priority

---

# Synchronization Mechanisms

## What is Synchronization?

**Synchronization** is coordinating the execution of multiple tasks to ensure correct behavior when accessing shared resources.

## Why Do We Need Synchronization?

### Problem: Race Condition

A **race condition** occurs when multiple tasks access shared data concurrently, and the final result depends on timing/order of execution.

**Example - Bank Account**:
```
Shared Variable: account_balance = $100

Task 1 (Deposit $50):          Task 2 (Withdraw $30):
1. Read balance ($100)         1. Read balance ($100)
2. Add $50 → $150             2. Subtract $30 → $70
3. Write back $150             3. Write back $70

Without synchronization:
- Both read $100 simultaneously
- Task 1 writes $150
- Task 2 writes $70 (overwrites Task 1!)
- Final balance: $70 (Should be $120!)
- $50 deposit was lost!
```

### Problem: Data Corruption

**Example - UART Print**:
```
Task 1 wants to print: "HELLO"
Task 2 wants to print: "WORLD"

Without synchronization:
Output: "HWEOLRLLOD" (characters interleaved!)
```

## Critical Section

A **critical section** is a section of code that accesses shared resources and must not be executed by multiple tasks simultaneously.

**Properties of Good Critical Section Solution**:

1. **Mutual Exclusion**: Only one task in critical section at a time
2. **Progress**: If no task in critical section, other tasks shouldn't be prevented from entering
3. **Bounded Waiting**: Task shouldn't wait indefinitely to enter critical section
4. **No Assumptions**: Should work regardless of CPU speed or number of cores

**Structure**:
```
┌──────────────────────────────────────┐
│        Entry Section                 │
│    (Acquire permission to enter)     │
├──────────────────────────────────────┤
│        Critical Section              │
│    (Access shared resource)          │
├──────────────────────────────────────┤
│        Exit Section                  │
│    (Release permission)              │
├──────────────────────────────────────┤
│        Remainder Section             │
│    (Rest of task code)               │
└──────────────────────────────────────┘
```

---

## Semaphore (Deep Theory)

### Origin

Invented by **Edsger Dijkstra** in 1965. Name comes from railway/naval signaling systems (semaphore flags).

### Definition

A **semaphore** is an integer variable that can be accessed only through two atomic operations:

1. **P() or Wait() or Down()**: Decrement and possibly block
2. **V() or Signal() or Up()**: Increment and possibly wake up waiting task

**Atomic**: Operation completes entirely without interruption.

### Mathematical Definition

```
Semaphore S (integer variable)

P(S):  // Wait / Acquire
    S = S - 1
    if S < 0:
        block task (move to waiting queue)
        
V(S):  // Signal / Release
    S = S + 1
    if S ≤ 0:
        wake up one waiting task (move to ready queue)
```

### Types of Semaphores

#### 1. Binary Semaphore (Mutex-like)

**Value**: 0 or 1 only

**Use Cases**:
- Signaling between tasks
- Indicating resource availability (yes/no)
- ISR to task communication

**Behavior**:
```
Initial Value = 0 (empty)

Task A:             Task B:
Wait on S           [some work]
(blocks at S=0)     Signal S (S=1)
(wakes up!)         
(continues)
```

**Key Point**: Can be given without taking (useful for signaling)

#### 2. Counting Semaphore

**Value**: 0 to N (any non-negative integer)

**Use Cases**:
- Managing multiple identical resources
- Counting available items
- Rate limiting (max N concurrent operations)

**Example - Parking Lot**:
```
Parking lot has 5 spaces
Semaphore S = 5

Car arrives → P(S)  // S decrements (4 spaces left)
Car leaves  → V(S)  // S increments (5 spaces again)

When S = 0: No spaces, cars wait (block)
When car leaves: V(S) makes S=1, one waiting car can enter
```

### Semaphore Implementation (Conceptual)

```
Structure Semaphore {
    int value;
    Queue waiting_queue;  // Tasks blocked on this semaphore
}

P(Semaphore S) {
    Disable_Interrupts();  // Make operation atomic
    
    S.value = S.value - 1;
    
    if (S.value < 0) {
        Add current_task to S.waiting_queue;
        Block current_task;
        Scheduler_Invoke();  // Switch to another task
    }
    
    Enable_Interrupts();
}

V(Semaphore S) {
    Disable_Interrupts();  // Make operation atomic
    
    S.value = S.value + 1;
    
    if (S.value <= 0) {
        Remove a task from S.waiting_queue;
        Make that task ready (move to ready queue);
    }
    
    Enable_Interrupts();
}
```

### Semaphore Properties

**Advantages**:
- Simple concept
- Works for signaling and mutual exclusion
- Can manage multiple resources
- No busy waiting (efficient)

**Disadvantages**:
- No ownership (any task can signal)
- Can lead to priority inversion
- No automatic release on task termination
- Easy to misuse (forget to signal → deadlock)

---

## Mutex (Mutual Exclusion) - Deep Theory

### Definition

A **mutex** is a binary semaphore with **ownership**. Only the task that acquired the mutex can release it.

### Mutex vs Binary Semaphore

| Feature | Binary Semaphore | Mutex |
|---------|------------------|-------|
| **Ownership** | No | Yes (only owner can unlock) |
| **Purpose** | Signaling | Resource protection |
| **Initial State** | Can be 0 or 1 | Always 1 (unlocked) |
| **ISR Use** | Yes (FromISR functions) | No (ownership concept invalid in ISR) |
| **Priority Inheritance** | No | Yes (optional) |
| **Recursive Locking** | No | Yes (by same task) |

### Mutex States

```
┌─────────────────────────────────────────┐
│              UNLOCKED                    │
│         (Available, owner=none)          │
│              value = 1                   │
└──────────────┬──────────────────────────┘
               │ Task A: Lock()
               ▼
┌─────────────────────────────────────────┐
│              LOCKED                      │
│         (Busy, owner=Task A)             │
│              value = 0                   │
└──────────────┬──────────────────────────┘
               │ Task A: Unlock()
               ▼
               (Back to UNLOCKED)
```

### Priority Inversion Problem (Detailed)

**Scenario**:

```
Task H (High Priority)
Task M (Medium Priority)
Task L (Low Priority)
Shared Resource: Protected by Mutex

Timeline:
─────────────────────────────────────────────────────────────
1. Task L locks mutex, starts using resource
   [L runs]

2. Task H becomes ready, preempts Task L
   [H runs]

3. Task H tries to lock same mutex → BLOCKED (owned by L)
   [L runs again]

4. Task M becomes ready, preempts Task L
   [M runs - doesn't need mutex]

5. Task L must wait for M to finish!
   Meanwhile, Task H (highest priority) is still blocked!

6. Finally M finishes, L resumes and completes
   [L finishes, unlocks mutex]

7. Task H unblocked, finally runs
   [H runs]

Problem: High priority task waited for BOTH medium and low!
This is called "Priority Inversion"
```

### Priority Inheritance (Solution)

**Principle**: When high-priority task blocks on mutex held by low-priority task, temporarily boost low-priority task to high priority.

**Steps**:
1. Low priority task locks mutex
2. High priority task tries to lock → blocked
3. **Low priority task inherits high priority temporarily**
4. Low priority task (now running at high priority) completes quickly
5. Low priority task unlocks mutex
6. Low priority task returns to original priority
7. High priority task locks mutex and runs

**Effect**: Medium priority task can't preempt the boosted low-priority task.

```
Without Priority Inheritance:
[L]─[H waits]─[M runs]────────[L]─[H runs]
              └─── Problem: H waits for M ───┘

With Priority Inheritance:
[L]─[H waits]─[L boosted to H priority]─[H runs]
              └─ M can't preempt! ────┘
```

### Mutex Types

#### 1. Standard Mutex
- Basic mutual exclusion
- Only owner can unlock
- No recursion

#### 2. Recursive Mutex
- Same task can lock multiple times
- Must unlock same number of times
- Useful for nested function calls

**Example**:
```
Recursive Mutex M

Task A:
    Lock(M)    // Count = 1, Owner = A
    FunctionX()
        Lock(M)    // Count = 2, Owner = A (allowed!)
        ...
        Unlock(M)  // Count = 1
    Unlock(M)      // Count = 0, Available
```

#### 3. Error-Checking Mutex
- Detects errors:
  - Unlocking already-unlocked mutex
  - Unlocking mutex owned by another task
  - Deadlock detection

---

## Spinlock

### Definition

A **spinlock** is a lock where the waiting task **busy-waits** in a loop checking if lock is available.

### Behavior

```
while (lock == LOCKED) {
    // Do nothing, just keep checking
    // CPU actively runs this loop!
}
lock = LOCKED;  // Acquired!

// Critical section

lock = UNLOCKED;  // Release
```

### When to Use

**Good Use Cases**:
- **Very short** critical sections (< 1 microsecond)
- **Multicore systems** where other cores can make progress
- **Interrupt handlers** that need non-blocking locks

**Bad Use Cases**:
- Long critical sections (wastes CPU)
- Single-core systems (no other task can unlock it!)
- RTOS tasks (better to block and let other tasks run)

### Spinlock vs Mutex

| Aspect | Spinlock | Mutex |
|--------|----------|-------|
| **Waiting** | Busy-wait (wastes CPU) | Block (efficient) |
| **Context Switch** | No | Yes |
| **Duration** | Very short (microseconds) | Any length |
| **CPU Cores** | Useful on multicore | Works on single/multi |
| **ISR Safe** | Yes | No |
| **Overhead** | Low (if very short) | Higher (context switch) |

---

## Reader-Writer Lock

### Problem

Multiple tasks can **read** shared data simultaneously (safe), but **writing** requires exclusive access.

### Solution: Reader-Writer Lock

**Rules**:
1. Multiple readers can hold lock simultaneously
2. Only one writer can hold lock
3. Readers and writers cannot hold lock simultaneously

**States**:
```
┌─────────────────────────────────────┐
│          UNLOCKED                   │
│     (No readers, no writers)        │
└───┬──────────────────────────┬──────┘
    │                          │
    │ read_lock()             │ write_lock()
    ▼                          ▼
┌─────────────────┐     ┌─────────────────┐
│   READ-LOCKED   │     │  WRITE-LOCKED   │
│ (N readers)     │     │  (1 writer)     │
│ (0 writers)     │     │  (0 readers)    │
└─────────────────┘     └─────────────────┘
```

### Policies

#### Reader-Preference
- Readers get priority
- **Starvation**: Writers may never get access if continuous readers

#### Writer-Preference
- Writers get priority
- **Starvation**: Readers may wait long if many writers

#### Fair
- First-come, first-served
- No starvation

---

# Inter-Process Communication (Theory)

## What is IPC?

**Inter-Process Communication (IPC)** - mechanisms for tasks/processes to exchange data and coordinate.

## Why IPC?

1. **Data Sharing**: Multiple tasks need access to same data
2. **Modularity**: Divide application into cooperating tasks
3. **Convenience**: Easier to organize as separate tasks
4. **Privilege Separation**: Run parts with different access levels

## IPC Mechanisms

### 1. Shared Memory

**Concept**: Tasks share a common memory region.

**Characteristics**:
- **Fastest**: No copying data, direct access
- **Dangerous**: Need synchronization (race conditions)
- **Efficient**: One write, multiple reads without overhead

**Requirements**:
- Mutex/Semaphore for synchronization
- Careful programming to avoid race conditions

**Use When**: High-performance data sharing needed

### 2. Message Passing

**Concept**: Tasks send/receive messages through system-provided channels.

**Characteristics**:
- **Safe**: No shared memory issues
- **Slower**: Overhead of copying data
- **Structured**: Clear sender and receiver
- **Synchronous or Asynchronous**

**Implementations**:
- Message Queues
- Pipes
- Mailboxes
- Sockets

### 3. Message Queue

**Concept**: Buffer that stores messages sent from tasks; receiver retrieves in order (usually FIFO).

**Features**:
- **Bounded**: Fixed maximum number of messages
- **Typed**: Messages have specific size/structure
- **Blocking**: Can block sender (if full) or receiver (if empty)
- **Priority**: Some implementations support priority messages

**Operations**:
- **Send**: Add message to queue (blocks if full)
- **Receive**: Remove message from queue (blocks if empty)
- **Peek**: Look at message without removing

**Use Cases**:
- Sensor data buffering
- Command processing
- Event notification
- Data pipeline

### 4. Pipes

**Concept**: Unidirectional data channel between two processes.

**Types**:

#### Named Pipe (FIFO)
- Has a name in file system
- Any process can open and use
- Persists until explicitly deleted

#### Unnamed Pipe
- Only between related processes (parent-child)
- Temporary, disappears when closed

**Characteristics**:
- **Byte Stream**: No message boundaries
- **Unidirectional**: Data flows one way
- **Buffered**: Kernel maintains buffer

### 5. Signals

**Concept**: Software interrupts sent to notify tasks of events.

**Characteristics**:
- **Asynchronous**: Can arrive any time
- **Limited Info**: Just notification, no data
- **Process-level**: Interrupt task execution

**Common Signals** (Unix/Linux):
- SIGTERM: Termination request
- SIGKILL: Force kill
- SIGALRM: Timer expired
- SIGUSR1/SIGUSR2: User-defined

**Not common in RTOS**: Tasks typically use task notifications instead.

### 6. Sockets

**Concept**: Communication endpoints for network communication.

**Types**:
- **Stream Sockets (TCP)**: Reliable, ordered, connection-based
- **Datagram Sockets (UDP)**: Unreliable, unordered, connectionless
- **Unix Domain Sockets**: Inter-process on same machine

**Use Cases**:
- Network communication
- Client-server architecture
- Distributed systems

**Not typical in small RTOS**: Used in larger systems like Linux RTOS.

---

# Deadlocks and Resource Management

## What is Deadlock?

**Deadlock** is a situation where two or more tasks are permanently blocked, each waiting for a resource held by another.

### Classic Example: Dining Philosophers

```
5 Philosophers sit at round table
5 forks, one between each pair
Each philosopher needs 2 forks to eat

Deadlock Scenario:
1. All 5 pick up left fork simultaneously
2. All 5 try to pick up right fork
3. No right fork available (held by neighbor)
4. All 5 wait forever!
```

### Deadlock Example in Code

```
Task A:                Task B:
Lock(Mutex1)           Lock(Mutex2)
  ...                    ...
  Lock(Mutex2)  ← BLOCKS Lock(Mutex1)  ← BLOCKS
    ↑                      ↑
    Waits for B           Waits for A
    
Neither can proceed → DEADLOCK!
```

## Four Necessary Conditions for Deadlock

Deadlock occurs **only if ALL four** conditions hold simultaneously:

### 1. Mutual Exclusion

**Definition**: At least one resource must be held in non-sharable mode.

**Meaning**: Only one task can use resource at a time.

**Example**: Mutex lock (by design, only one task can hold it)

### 2. Hold and Wait

**Definition**: Task holds at least one resource and is waiting to acquire additional resources held by others.

**Example**:
```
Task A holds Mutex1, waits for Mutex2
Task B holds Mutex2, waits for Mutex1
```

### 3. No Preemption

**Definition**: Resources cannot be forcibly taken away; only voluntary release.

**Meaning**: Task must explicitly release resource; system can't reclaim it.

**Example**: Can't force task to unlock mutex it holds

### 4. Circular Wait

**Definition**: There exists a circular chain of tasks, each waiting for resource held by next in chain.

**Example**:
```
T1 waits for T2
T2 waits for T3
T3 waits for T1
(Circle!)
```

## Deadlock Handling Strategies

### Strategy 1: Deadlock Prevention

**Approach**: Ensure at least ONE of the four conditions can NEVER hold.

#### Prevent Mutual Exclusion
- Make resources sharable
- **Problem**: Many resources can't be shared (e.g., printer)
- **Rarely Practical**

#### Prevent Hold and Wait
- **Method 1**: Require task to request ALL resources at once before starting
  - **Pro**: No deadlock
  - **Con**: Poor resource utilization (holds resources not yet needed)
  
- **Method 2**: Task must release all resources before requesting new ones
  - **Pro**: No hold-and-wait
  - **Con**: Starvation possible, complex

#### Prevent No Preemption
- Allow system to forcibly take resources
- **Problem**: Many resources can't be preempted safely
- **Example**: Can force task to release CPU but not safely take half-written data

#### Prevent Circular Wait
- **Method**: Impose ordering on resource acquisition
- **Rule**: Tasks must request resources in increasing order

**Example**:
```
Resources: R1, R2, R3 (numbered 1, 2, 3)

Rule: Must request in order 1 → 2 → 3

Task A:
  Lock(R1)  // OK
  Lock(R2)  // OK (2 > 1)
  Lock(R3)  // OK (3 > 2)

Task B:
  Lock(R3)  // NOT ALLOWED (would violate order)
  Lock(R1)  // Must start with R1

This prevents circular wait!
```

**Most Practical Solution in RTOS**

### Strategy 2: Deadlock Avoidance

**Approach**: System dynamically checks if granting request could lead to deadlock.

#### Banker's Algorithm

**Concept**: System maintains information about:
- Available resources
- Maximum demand of each task
- Currently allocated resources

**Decision**: Grant resource only if system remains in "safe state"

**Safe State**: Sequence exists where all tasks can complete

**Example**:
```
3 Tasks, 1 Resource Type, 10 Total Units

           Current  Maximum  Need
Task A        2       5       3
Task B        3       6       3
Task C        2       8       6
Available: 3

Safe Sequence: B → A → C
- Give 3 to B (finishes, returns 6)
- Give 3 to A (finishes, returns 5)
- Give 6 to C (finishes)
All can complete → SAFE

If we gave 4 to C instead:
Available would be 0, no task can finish → UNSAFE → DENY
```

**Problem**: Requires advance knowledge of max resource needs (rare in real systems)

### Strategy 3: Deadlock Detection and Recovery

**Approach**: Allow deadlock to occur, detect it, then recover.

#### Detection

**Method 1**: Wait-for Graph
- Nodes = Tasks
- Edges = "waits for" relationships
- Cycle in graph = Deadlock

```
Graph:
A → B → C → A  (Cycle! Deadlock detected!)
```

**Method 2**: Periodic check
- Run detection algorithm periodically (e.g., every 10 seconds)
- Check resource allocation state

#### Recovery

**Option 1: Process Termination**
- Kill one or more tasks to break cycle
- **Choice**: Kill lowest priority, shortest elapsed time, or manual selection

**Option 2: Resource Preemption**
- Take resource from task
- Roll back task to safe state
- **Problem**: Requires checkpointing/rollback support

### Strategy 4: Deadlock Ignorance (Ostrich Algorithm)

**Approach**: Ignore the problem!

**Rationale**:
- Deadlocks rare
- Prevention/avoidance too expensive
- Detection/recovery complex
- **Just reboot** if it happens

**Used In**: Windows, Linux (for user-level applications)

**NOT suitable for**: Safety-critical RTOS systems

## Resource Allocation Graph

**Visual representation** of resource allocation and requests.

**Elements**:
- **Circles**: Tasks
- **Squares**: Resources
- **Dots inside squares**: Resource instances
- **Arrow from Task to Resource**: Request (waiting)
- **Arrow from Resource to Task**: Allocation (holding)

**Example**:
```
  T1 ─────→ [R1] ─────→ T2 ─────→ [R2] ─────→ T1
    request      allocated     request      allocated
    
Cycle exists → Deadlock!
```

---

# Real-Time Constraints

## Types of Timing Constraints

### 1. Deadline

**Definition**: Latest time by which task must complete.

**Types**:
- **Hard Deadline**: Missing causes catastrophic failure
- **Soft Deadline**: Missing reduces quality but system continues
- **Firm Deadline**: Late results useless but not catastrophic

### 2. Period

**Definition**: Time interval between successive activations of periodic task.

**Example**: Sensor task runs every 100ms → Period = 100ms

### 3. Execution Time

**Definition**: CPU time required to execute task.

**Types**:
- **BCET** (Best Case Execution Time): Minimum time
- **WCET** (Worst Case Execution Time): Maximum time
- **ACET** (Average Case Execution Time): Typical time

### 4. Release Time (Arrival Time)

**Definition**: Time when task becomes ready to execute.

### 5. Response Time

**Definition**: Time from release to completion.
```
Response Time = Completion Time - Release Time
```

### 6. Jitter

**Definition**: Variation in timing.

**Types**:
- **Release Jitter**: Variation in release time
- **Execution Jitter**: Variation in execution time
- **Response Jitter**: Variation in response time

**Example**:
```
Expected: Task completes at 10ms every time
Actual: 9.8ms, 10.3ms, 9.9ms, 10.5ms
Jitter: 0.7ms (difference between max and min)
```

## Schedulability Analysis

**Question**: Can scheduler guarantee all tasks meet their deadlines?

### Utilization-Based Test (RMS)

For Rate Monotonic Scheduling:

```
U = Σ (Execution Time / Period)

For n tasks:
If U ≤ n × (2^(1/n) - 1), schedulable

n=1: U ≤ 100%
n=2: U ≤ 82.8%
n=3: U ≤ 78.0%
n→∞: U ≤ 69.3%
```

**Example**:
```
Task 1: Execution=2ms, Period=10ms → U1=0.2
Task 2: Execution=3ms, Period=15ms → U2=0.2
Total: U = 0.4 (40%)

For 2 tasks: Bound = 82.8%
40% < 82.8% → Schedulable!
```

### Response Time Analysis

**Calculate worst-case response time** for each task considering all higher-priority interference.

**Iterative calculation**:
```
R_i^(n+1) = C_i + Σ(ceiling(R_i^n / T_j) × C_j)
          where j are higher priority tasks
          
C_i: Execution time of task i
T_j: Period of task j
```

**Schedulable if**: R_i ≤ D_i (response time ≤ deadline) for all tasks

---

# RTOS Architecture

## Kernel Architecture Types

### 1. Monolithic Kernel

**Structure**: All OS services in single kernel space.

```
┌─────────────────────────────────────────┐
│           Application Space              │
│         (User Applications)              │
├─────────────────────────────────────────┤
│      System Call Interface              │
├─────────────────────────────────────────┤
│          KERNEL SPACE                    │
│  ┌──────────────────────────────────┐   │
│  │ Scheduler │ Memory │ Drivers │FS │   │
│  │ IPC │ Network │ File System      │   │
│  │ (Everything together)            │   │
│  └──────────────────────────────────┘   │
├─────────────────────────────────────────┤
│            Hardware                      │
└─────────────────────────────────────────┘
```

**Advantages**:
- Fast (no context switches between services)
- Efficient (direct function calls)
- Simple communication

**Disadvantages**:
- Large (all services included)
- Less reliable (bug in one service crashes entire kernel)
- Harder to maintain

**Examples**: Linux, traditional Unix

### 2. Microkernel

**Structure**: Minimal kernel; services in separate processes.

```
┌─────────────────────────────────────────┐
│        Application Space                 │
├─────────────────────────────────────────┤
│   File    │  Network  │  Device         │
│  Server   │   Server  │  Drivers        │
│  (User Space Processes)                 │
├─────────────────────────────────────────┤
│           MICROKERNEL                    │
│  (Only: IPC, Basic Scheduler,            │
│   Memory Protection, Low-level I/O)     │
├─────────────────────────────────────────┤
│            Hardware                      │
└─────────────────────────────────────────┘
```

**Advantages**:
- Reliable (service crash doesn't crash kernel)
- Secure (services isolated)
- Maintainable (easy to add/remove services)
- Small kernel

**Disadvantages**:
- Slower (IPC overhead between services)
- Complex (more message passing)

**Examples**: QNX, Minix, L4

### 3. Hybrid Kernel

**Structure**: Microkernel with some services in kernel for performance.

**Advantages**: Balance between monolithic and microkernel

**Examples**: Windows NT, macOS

### 4. Exokernel

**Structure**: Minimal abstraction; applications directly manage hardware.

**Rarely Used in RTOS**

---

## RTOS Layers

```
┌─────────────────────────────────────────────────┐
│            APPLICATION LAYER                     │
│  (User tasks: LED control, sensor reading,etc)  │
├─────────────────────────────────────────────────┤
│          RTOS SERVICES LAYER                     │
│  (Queues, Semaphores, Mutexes, Timers)          │
├─────────────────────────────────────────────────┤
│            KERNEL LAYER                          │
│  (Scheduler, Task Management, Context Switch)    │
├─────────────────────────────────────────────────┤
│        HARDWARE ABSTRACTION LAYER (HAL)          │
│  (Port-specific code, interrupt handling)        │
├─────────────────────────────────────────────────┤
│             HARDWARE                             │
│  (CPU, Memory, Peripherals, Timers)              │
└─────────────────────────────────────────────────┘
```

---

## Additional Advanced Topics

### Interrupt Latency Components

**Total Interrupt Latency** = Hardware Latency + Software Latency + Scheduling Latency

1. **Hardware Latency**: Time for CPU to recognize interrupt
2. **Software Latency**: Time in ISR wrapper before user handler
3. **Scheduling Latency**: Time from ISR exit to task resumption

### Memory Models

#### Stack Memory
- **Per-task**: Each task has private stack
- **Grows down**: Typically from high to low address
- **Overflow**: Catastrophic if exceeds allocated size

#### Heap Memory
- **Shared**: All tasks share heap
- **Dynamic**: Allocate/deallocate as needed
- **Fragmentation**: Problem over time

#### Static Memory
- **Global variables**: Known at compile time
- **No allocation overhead**: Fastest
- **Limited flexibility**: Size fixed

### Power Management in RTOS

**Idle Hook**: Enter low-power mode when no tasks ready
**Tickless Idle**: Stop tick interrupt during long idle periods
**Dynamic Frequency Scaling**: Reduce CPU clock when load low

---

# Summary and Key Takeaways

## Essential RTOS Concepts

1. **Real-Time = Predictable**, not necessarily fast
2. **Tasks** are independent execution units with own stack
3. **Scheduler** decides which task runs based on priority
4. **Preemption** allows higher priority tasks to interrupt lower
5. **Synchronization** (semaphores, mutexes) prevents race conditions
6. **IPC** (queues, messages) enables tasks to communicate
7. **Deadlock** occurs when tasks wait in circular dependency
8. **Schedulability Analysis** ensures all deadlines can be met

## Design Principles

1. Keep critical sections short
2. Use appropriate synchronization primitive
3. Avoid busy-waiting
4. Design for worst-case, not average-case
5. Measure and validate timing
6. Test under full load conditions

---

**End of RTOS Theory Deep Dive**

---

# 1. Introduction to RTOS

## 1.1 What is an Operating System?

An **Operating System (OS)** is software that manages hardware resources and provides services to application programs. It acts as an intermediary between the user/application and the computer hardware.

## 1.2 What is an RTOS?

An **RTOS (Real-Time Operating System)** is a specialized operating system designed for applications that require **deterministic timing** and **guaranteed response times**. Unlike general-purpose operating systems (like Windows or Linux), an RTOS ensures that critical tasks are executed within strict time constraints.

### Key Characteristics of RTOS:
- **Deterministic Behavior**: Response times are predictable and consistent
- **Low Latency**: Minimal delay between an event and the system's response
- **Priority-based Scheduling**: Higher priority tasks always run before lower priority ones
- **Preemption**: A higher priority task can interrupt a lower priority task immediately

## 1.3 RTOS vs Bare-Metal Programming

### Bare-Metal Programming (Super Loop):
```c
int main(void) {
    init_hardware();
    
    while(1) {
        read_sensors();
        process_data();
        update_display();
        check_buttons();
        // Problem: Each function must complete before the next runs
        // No prioritization possible
    }
}
```

**Problems with Super Loop:**
- ❌ No task prioritization
- ❌ Blocking operations affect all functionality
- ❌ Complex timing management
- ❌ Difficult to scale
- ❌ One slow function delays everything

### RTOS Approach:
```c
int main(void) {
    init_hardware();
    
    xTaskCreate(sensor_task, "Sensors", 200, NULL, 3, NULL);  // High priority
    xTaskCreate(display_task, "Display", 200, NULL, 2, NULL); // Medium priority
    xTaskCreate(button_task, "Buttons", 200, NULL, 1, NULL);  // Low priority
    
    vTaskStartScheduler();  // RTOS takes over!
}
```

**Benefits of RTOS:**
- ✅ Tasks run independently ("concurrently")
- ✅ Priority-based execution
- ✅ Blocking one task doesn't affect others
- ✅ Modular, maintainable code
- ✅ Time-critical operations are guaranteed

## 1.4 What is FreeRTOS?

**FreeRTOS** is a leading open-source RTOS for embedded systems. It's:
- **Free and Open Source** (MIT License)
- **Portable** - Runs on 40+ microcontroller architectures
- **Small Footprint** - Minimal RAM/ROM usage
- **Well Documented** - Extensive documentation and community support
- **Industry Proven** - Used in millions of devices worldwide

### FreeRTOS Architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION CODE                          │
│              (Your Tasks: LED, Sensor, Motor, etc.)          │
├─────────────────────────────────────────────────────────────┤
│                    FreeRTOS KERNEL                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │Scheduler │ │ Queues   │ │Semaphores│ │ Timers   │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    HARDWARE ABSTRACTION                      │
│                     (Port Layer)                             │
├─────────────────────────────────────────────────────────────┤
│                    MICROCONTROLLER                           │
│                (STM32, Arduino, ESP32, etc.)                 │
└─────────────────────────────────────────────────────────────┘
```

## 1.5 When to Use an RTOS?

**Use RTOS when you have:**
- Multiple independent functionalities (tasks)
- Time-critical operations requiring guaranteed response
- Complex systems that benefit from modular design
- Need for efficient CPU utilization
- Multiple priority levels needed

**Stick with Bare-Metal when:**
- Very simple applications (single LED blink)
- Extremely tight memory constraints (< 4KB RAM)
- Ultra-low power applications with mostly sleep mode
- Single-purpose devices with no concurrency needs

---

# 2. Understanding Tasks

## 2.1 What is a Task?

A **Task** (also called a Thread) is an independent unit of execution that appears to run in parallel with other tasks. Each task:
- Has its own **stack** (private memory space)
- Maintains its own **context** (CPU registers, program counter)
- Can be in different **states** (Running, Ready, Blocked, Suspended)
- Has a **priority level** that determines execution order

### Conceptual View of Tasks:

```
┌─────────────────────────────────────────────────────────────┐
│                        CPU                                   │
│    (Can only run ONE task at a time!)                       │
└─────────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  Task 1  │    │  Task 2  │    │  Task 3  │
    │ (LED)    │    │ (Button) │    │ (UART)   │
    │          │    │          │    │          │
    │ Stack    │    │ Stack    │    │ Stack    │
    │ Context  │    │ Context  │    │ Context  │
    └──────────┘    └──────────┘    └──────────┘
    
    The RTOS scheduler rapidly switches between tasks,
    creating the ILLUSION of parallel execution!
```

## 2.2 Task Structure

Every FreeRTOS task follows this basic structure:

```c
void task_function(void* parameters)
{
    // 1. INITIALIZATION (runs once)
    // Initialize variables, set up hardware specific to this task
    
    // 2. INFINITE LOOP (task never returns!)
    while(1)
    {
        // Task's main work goes here
        
        // IMPORTANT: Must include a blocking call or yield!
        // Otherwise, lower priority tasks will never run
        vTaskDelay(pdMS_TO_TICKS(100));  // Example: delay 100ms
    }
    
    // 3. CLEANUP (rarely reached)
    vTaskDelete(NULL);  // Delete itself if loop exits
}
```

### ⚠️ Critical Rule: Tasks Must Never Return!

```c
// ❌ WRONG - Task function returns
void bad_task(void* params)
{
    do_something();
    // No infinite loop - task returns and crashes!
}

// ✅ CORRECT - Task runs forever or deletes itself
void good_task(void* params)
{
    while(1)
    {
        do_something();
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}
```

## 2.3 Creating Tasks with xTaskCreate()

The `xTaskCreate()` function creates a new task:

```c
BaseType_t xTaskCreate(
    TaskFunction_t pvTaskCode,     // Pointer to task function
    const char* pcName,            // Task name (for debugging)
    configSTACK_DEPTH_TYPE usStackDepth, // Stack size in words
    void* pvParameters,            // Parameters passed to task
    UBaseType_t uxPriority,        // Task priority
    TaskHandle_t* pxCreatedTask    // Handle to created task
);
```

### Parameter Explanation:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `pvTaskCode` | Function pointer to task | `led_task` |
| `pcName` | Debug name (up to configMAX_TASK_NAME_LEN chars) | `"LED_Task"` |
| `usStackDepth` | Stack size in words (not bytes!) | `200` (= 800 bytes on 32-bit) |
| `pvParameters` | Data passed to task (can be NULL) | `&led_config` |
| `uxPriority` | Priority (0 = lowest, higher = more priority) | `2` |
| `pxCreatedTask` | Returns handle for controlling task | `&led_handle` |

### Return Value:
- `pdPASS` (1) - Task created successfully
- `errCOULD_NOT_ALLOCATE_REQUIRED_MEMORY` - Failed (not enough heap)

## 2.4 Practical Example: Creating Your First Tasks

Example (typical `main` before `vTaskStartScheduler`):

```c
#include "FreeRTOS.h"
#include "task.h"

// Task handles (global so we can reference tasks later)
TaskHandle_t task1_handle;
TaskHandle_t task2_handle;

// Task 1: Prints "Hello world from Task-1"
static void task1_handler(void* parameters)
{
    char msg[100];
    
    while(1)
    {
        // Get the message from parameters and print it
        snprintf(msg, 100, "%s\n", (char*)parameters);
        SEGGER_SYSVIEW_PrintfTarget(msg);
        
        // Yield to allow other same-priority tasks to run
        taskYIELD();
    }
}

// Task 2: Prints "Hello world from Task-2"
static void task2_handler(void* parameters)
{
    char msg[100];
    
    while(1)
    {
        snprintf(msg, 100, "%s\n", (char*)parameters);
        SEGGER_SYSVIEW_PrintfTarget(msg);
        
        taskYIELD();
    }
}

int main(void)
{
    BaseType_t status;
    
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();
    
    // Create Task 1
    status = xTaskCreate(
        task1_handler,                    // Task function
        "Task-1",                         // Name
        200,                              // Stack size (200 words = 800 bytes)
        "Hello world from Task-1",        // Parameter (passed to task)
        2,                                // Priority
        &task1_handle                     // Handle
    );
    configASSERT(status == pdPASS);  // Check if creation succeeded
    
    // Create Task 2
    status = xTaskCreate(
        task2_handler,
        "Task-2",
        200,
        "Hello world from Task-2",
        2,                                // Same priority as Task-1
        &task2_handle
    );
    configASSERT(status == pdPASS);
    
    // Start the scheduler - FreeRTOS takes over!
    vTaskStartScheduler();
    
    // Code here never executes (scheduler doesn't return)
    while(1) {}
}
```

### What Happens When This Runs:

1. Both tasks have **equal priority (2)**
2. Scheduler uses **round-robin** between same-priority tasks
3. `taskYIELD()` voluntarily gives up CPU to other ready tasks
4. Output alternates: "Task-1" → "Task-2" → "Task-1" → ...

## 2.5 Task Stack Size Considerations

The stack size is **critical** for task stability. Too small = stack overflow = crash!

### What Uses Task Stack:
- Local variables in task function
- Function call nesting (each call uses stack)
- Interrupt handlers (on some architectures)
- Context save during task switch

### Guidelines for Stack Size:

| Task Type | Recommended Size | Notes |
|-----------|------------------|-------|
| Simple LED toggle | 100-128 words | Minimal local variables |
| Sensor reading | 150-200 words | Some buffers needed |
| String processing | 200-300 words | sprintf uses significant stack |
| Complex calculations | 300-500 words | Deep call nesting |
| Network/File I/O | 500+ words | Large buffers, complex operations |

### Detecting Stack Overflow:

Enable in `FreeRTOSConfig.h`:
```c
#define configCHECK_FOR_STACK_OVERFLOW  2  // Most thorough check
```

Then implement the hook function:
```c
void vApplicationStackOverflowHook(TaskHandle_t xTask, char *pcTaskName)
{
    // This is called when stack overflow is detected
    printf("STACK OVERFLOW in task: %s\n", pcTaskName);
    while(1);  // Halt for debugging
}
```

---

# 3. Task States and Scheduling

## 3.1 Task States Explained

A task can be in one of **four states**:

```
                    ┌──────────────────────────────────────────────────────┐
                    │                                                      │
                    ▼                                                      │
              ┌──────────┐     vTaskSuspend()      ┌──────────────┐       │
              │ RUNNING  │─────────────────────────▶│  SUSPENDED   │       │
              │(executing│◀─────────────────────────│              │       │
              │ on CPU)  │     vTaskResume()        └──────────────┘       │
              └────┬─────┘                                                 │
                   │                                                       │
    Preempted by   │ Task blocks on                                       │
    higher priority│ delay/queue/semaphore                                │
    OR time slice  │                                                       │
    expires        │                                                       │
                   │                                                       │
              ┌────▼─────┐                         ┌──────────────┐        │
              │  READY   │◀────────────────────────│   BLOCKED    │        │
              │(waiting  │      Event occurs       │  (waiting    │        │
              │ for CPU) │      (delay expires,    │   for event) │        │
              └──────────┘       data available)   └──────────────┘        │
                   │                                                       │
                   │   Scheduler selects this task                         │
                   └───────────────────────────────────────────────────────┘
```

### State Descriptions:

| State | Description | How to Enter | How to Exit |
|-------|-------------|--------------|-------------|
| **RUNNING** | Currently executing on CPU | Selected by scheduler | Preemption, blocking, yield |
| **READY** | Ready to run, waiting for CPU | Created, unblocked, resumed | Scheduler selects it |
| **BLOCKED** | Waiting for event (timeout, queue, semaphore) | Called blocking API | Event occurs or timeout |
| **SUSPENDED** | Frozen, won't run until resumed | `vTaskSuspend()` called | `vTaskResume()` called |

## 3.2 The Scheduler

The **scheduler** is the heart of FreeRTOS. It decides which task runs next.

### Scheduling Algorithm:

FreeRTOS uses **Preemptive Priority Scheduling with Round-Robin**:

1. **Priority-Based**: Higher priority tasks ALWAYS run before lower priority
2. **Preemptive**: If a higher priority task becomes ready, it immediately preempts the current task
3. **Round-Robin**: Tasks with EQUAL priority share CPU time using time slices

### Time Slice (Tick):

The **tick** is the basic time unit in FreeRTOS (typically 1ms):

```c
// In FreeRTOSConfig.h
#define configTICK_RATE_HZ    1000   // 1000 ticks per second = 1ms per tick
```

Every tick, the scheduler checks if:
- A higher priority task is ready → Switch to it
- Current task's time slice expired → Switch to next same-priority task
- Current task blocked → Switch to next ready task

## 3.3 The Idle Task

FreeRTOS automatically creates an **Idle Task** with **priority 0** (lowest):

- Runs when NO other tasks are ready
- Cleans up deleted tasks (frees their memory)
- Can be used for power saving

### Idle Hook (Optional):

```c
// Enable in FreeRTOSConfig.h
#define configUSE_IDLE_HOOK    1

// Implement the hook
void vApplicationIdleHook(void)
{
    // Called repeatedly when idle task runs
    // Perfect for entering low-power mode!
    HAL_PWR_EnterSLEEPMode(PWR_MAINREGULATOR_ON, PWR_SLEEPENTRY_WFI);
}
```

Example:
```c
void vApplicationIdleHook(void)
{
    // Enter sleep mode when no tasks have work to do
    // Saves power - CPU wakes on next tick interrupt
    HAL_PWR_EnterSLEEPMode(PWR_MAINREGULATOR_ON, PWR_SLEEPENTRY_WFI);
}
```

## 3.4 Context Switching

When the scheduler switches between tasks, it performs a **context switch**:

```
Task A Running                        Task B Running
┌────────────────┐                   ┌────────────────┐
│  Program       │                   │  Program       │
│  Counter: 0x100│                   │  Counter: 0x500│
│  Registers:    │                   │  Registers:    │
│  R0-R12, SP, LR│    CONTEXT       │  R0-R12, SP, LR│
│  Stack Pointer │◀═══SWITCH════════▶│  Stack Pointer │
└────────────────┘                   └────────────────┘

1. Save Task A's context to its stack
2. Switch stack pointer to Task B's stack
3. Restore Task B's context from its stack
4. Jump to Task B's saved program counter
```

### Context Switch Triggers:

1. **Tick Interrupt**: Regular timer interrupt (every 1ms typically)
2. **API Calls**: `vTaskDelay()`, `xQueueSend()`, `xSemaphoreTake()`, etc.
3. **Manual Yield**: `taskYIELD()` or `portYIELD_FROM_ISR()`

---

# 4. Task Priorities

## 4.1 Understanding Priority Levels

In FreeRTOS:
- **Priority 0** = Lowest (Idle task)
- **Higher number** = Higher priority
- Maximum priority = `configMAX_PRIORITIES - 1`

```c
// Typical configuration in FreeRTOSConfig.h
#define configMAX_PRIORITIES    5   // Priorities 0, 1, 2, 3, 4 available
```

### Priority Selection Guidelines:

| Priority Level | Use Case | Example Tasks |
|----------------|----------|---------------|
| 4 (Highest) | Critical, time-sensitive | Safety systems, watchdog feeding |
| 3 (High) | Important, responsive | Button handling, motor control |
| 2 (Medium) | Normal operations | Sensor reading, data processing |
| 1 (Low) | Background, non-critical | Display updates, logging |
| 0 (Lowest) | Idle, cleanup | System idle, memory defrag |

## 4.2 Priority Scheduling Example

Example:

```c
static void task1_handler(void* parameters)
{
    while(1)
    {
        HAL_GPIO_TogglePin(GPIOD, LED_RED_PIN);
        HAL_Delay(100);
        switch_priority();  // Check if priority should change
    }
}

static void task2_handler(void* parameters)
{
    while(1)
    {
        HAL_GPIO_TogglePin(GPIOD, LED_GREEN_PIN);
        HAL_Delay(1000);
        switch_priority();
    }
}

int main(void)
{
    // Task-1 starts with priority 2
    xTaskCreate(task1_handler, "Task-1", 200, NULL, 2, &task1_handle);
    
    // Task-2 starts with priority 3 (HIGHER - runs first)
    xTaskCreate(task2_handler, "Task-2", 200, NULL, 3, &task2_handle);
    
    vTaskStartScheduler();
}
```

### Dynamic Priority Change:

```c
void switch_priority(void)
{
    UBaseType_t p1, p2;
    TaskHandle_t t1, t2;
    
    portENTER_CRITICAL();  // Disable interrupts briefly
    
    if(status_button)  // Button was pressed
    {
        status_button = 0;
        
        // Get task handles by name
        t1 = xTaskGetHandle("Task-1");
        t2 = xTaskGetHandle("Task-2");
        
        // Get current priorities
        p1 = uxTaskPriorityGet(t1);
        p2 = uxTaskPriorityGet(t2);
        
        // Swap priorities!
        vTaskPrioritySet(t1, p2);
        vTaskPrioritySet(t2, p1);
    }
    
    portEXIT_CRITICAL();
}
```

### Priority-Related API Functions:

| Function | Description |
|----------|-------------|
| `uxTaskPriorityGet(taskHandle)` | Get a task's current priority |
| `vTaskPrioritySet(taskHandle, newPriority)` | Change a task's priority |
| `uxTaskPriorityGetFromISR(taskHandle)` | Get priority from ISR |

## 4.3 Priority Inversion Problem

**Priority Inversion** occurs when a high-priority task is blocked by a low-priority task:

```
Time →
┌────────────────────────────────────────────────────────────┐
│ High Priority Task:     [===BLOCKED====][RUNNING]         │
│ Medium Priority Task:          [========RUNNING========]  │
│ Low Priority Task:      [LOCK][..waiting..........][UNLOCK│
└────────────────────────────────────────────────────────────┘

Problem:
1. Low priority task takes a lock
2. High priority task needs the lock → BLOCKED
3. Medium priority task runs (doesn't need lock)
4. High priority task waits for BOTH medium AND low!
```

**Solution**: Use **Mutex with Priority Inheritance** (covered in Mutex section)

---

# 5. Task Delays and Timing

## 5.1 Why Tasks Need Delays

Tasks that run continuously without delays will:
- ❌ Starve lower priority tasks
- ❌ Waste CPU cycles
- ❌ Prevent idle task from running (no power saving)
- ❌ Make the system unresponsive

## 5.2 Types of Delays

### 5.2.1 HAL_Delay() - DON'T USE IN RTOS!

```c
// ❌ BAD - Blocking busy-wait delay
while(1)
{
    HAL_GPIO_TogglePin(GPIOD, LED_PIN);
    HAL_Delay(500);  // CPU spins, wasting cycles!
}
```

`HAL_Delay()` uses busy-waiting - the CPU keeps checking the time without doing anything useful. In RTOS, this prevents other tasks from running!

### 5.2.2 vTaskDelay() - Relative Delay

```c
// ✅ GOOD - Task goes to BLOCKED state
while(1)
{
    HAL_GPIO_TogglePin(GPIOD, LED_PIN);
    vTaskDelay(pdMS_TO_TICKS(500));  // Task sleeps, other tasks can run!
}
```

**How it works:**
1. Task enters BLOCKED state
2. Scheduler runs other ready tasks
3. After delay expires, task moves to READY state
4. Task runs when scheduler selects it

**Important**: Delay is **relative to when vTaskDelay() is called**, not absolute!

```
Time →     |----Task Work----|----Delay 100ms----|----Task Work----|
                              ^                    ^
                              Call vTaskDelay()    Wakes up

Problem: If task work takes varying time, the period varies too!
```

### 5.2.3 vTaskDelayUntil() - Absolute Periodic Delay

For precise periodic execution, use `vTaskDelayUntil()`:

```c
// ✅ BEST for periodic tasks - maintains constant period
static void led_handler(void* parameters)
{
    TickType_t last_wake_time;
    
    // Initialize with current time
    last_wake_time = xTaskGetTickCount();
    
    while(1)
    {
        HAL_GPIO_TogglePin(GPIOD, LED_PIN);
        
        // Delay UNTIL exactly 1000ms after last wake
        vTaskDelayUntil(&last_wake_time, pdMS_TO_TICKS(1000));
    }
}
```

**How it works:**

```
Time →     |--Work (5ms)--|---------------------------|--Work (5ms)--|
           ^              ^                            ^              ^
           Wake          Sleep                        Wake          Sleep
           |<----------1000ms exactly---------------->|
           
Period is constant regardless of work duration!
```

Example:

```c
static void led_green_handler(void* parameters)
{
    TickType_t last_wakeup_time;
    
    // Initialize the last_wakeup_time variable with current time
    last_wakeup_time = xTaskGetTickCount();
    
    while(1)
    {
        SEGGER_SYSVIEW_PrintfTarget("Toggling green LED");
        HAL_GPIO_TogglePin(GPIOD, LED_GREEN_PIN);
        
        // Wait for exactly 1000ms from last wake time
        vTaskDelayUntil(&last_wakeup_time, pdMS_TO_TICKS(1000));
    }
}

static void led_orange_handler(void* parameters)
{
    TickType_t last_wakeup_time;
    
    last_wakeup_time = xTaskGetTickCount();
    
    while(1)
    {
        SEGGER_SYSVIEW_PrintfTarget("Toggling orange LED");
        HAL_GPIO_TogglePin(GPIOD, LED_ORANGE_PIN);
        
        // Wait for exactly 800ms from last wake time
        vTaskDelayUntil(&last_wakeup_time, pdMS_TO_TICKS(800));
    }
}
```

## 5.3 Time Conversion Macro

```c
// Convert milliseconds to ticks
pdMS_TO_TICKS(ms)

// Examples:
pdMS_TO_TICKS(100)   // 100 ticks (if tick rate is 1000Hz)
pdMS_TO_TICKS(1000)  // 1000 ticks = 1 second
pdMS_TO_TICKS(50)    // 50 ticks = 50ms
```

## 5.4 Timing API Summary

| Function | Purpose | Use Case |
|----------|---------|----------|
| `vTaskDelay(ticks)` | Relative delay | Simple pauses between operations |
| `vTaskDelayUntil(&time, ticks)` | Absolute periodic delay | Precise periodic tasks |
| `xTaskGetTickCount()` | Get current tick count | Time measurements |
| `pdMS_TO_TICKS(ms)` | Convert ms to ticks | Portable timing |

---

# 6. Inter-Task Communication

## 6.1 Why Inter-Task Communication?

Tasks often need to:
- **Share data** between each other
- **Synchronize** their operations
- **Signal events** to other tasks
- **Protect shared resources** from corruption

### Communication Mechanisms in FreeRTOS:

```
┌─────────────────────────────────────────────────────────────────┐
│                   INTER-TASK COMMUNICATION                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   QUEUES    │    │ SEMAPHORES  │    │   MUTEXES   │          │
│  │             │    │             │    │             │          │
│  │ Data        │    │ Signaling   │    │ Mutual      │          │
│  │ Transfer    │    │ & Counting  │    │ Exclusion   │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   TASK      │    │  SOFTWARE   │    │   EVENT     │          │
│  │NOTIFICATIONS│    │   TIMERS    │    │   GROUPS    │          │
│  │             │    │             │    │             │          │
│  │ Direct      │    │ Scheduled   │    │ Multi-bit   │          │
│  │ Signaling   │    │ Callbacks   │    │ Flags       │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 7. Semaphores

## 7.1 What is a Semaphore?

A **Semaphore** is a signaling mechanism used to:
- **Synchronize** tasks with events
- **Count** available resources
- **Signal** from ISR to tasks

Think of it like a traffic light or a concert ticket system!

### Types of Semaphores:

| Type | Purpose | Initial Value | Example Use |
|------|---------|---------------|-------------|
| **Binary** | Signal events (yes/no) | 0 or 1 | "Data is ready" |
| **Counting** | Track resource count | 0 to N | "3 UART buffers available" |

## 7.2 Binary Semaphore

A binary semaphore can only be 0 (empty) or 1 (full):

```
┌─────────────────────────────────────────────────────────────┐
│ Binary Semaphore States:                                    │
│                                                             │
│    ┌───┐          ┌───┐                                    │
│    │ 0 │ Empty    │ 1 │ Full                               │
│    └───┘          └───┘                                    │
│                                                             │
│ xSemaphoreGive()  →  Sets to 1 (signals event occurred)    │
│ xSemaphoreTake()  →  Sets to 0 (acknowledges and clears)   │
│                      (blocks if already 0)                  │
└─────────────────────────────────────────────────────────────┘
```

### Creating Binary Semaphore:

```c
SemaphoreHandle_t xSemaphore;

// Create binary semaphore (starts EMPTY - 0)
xSemaphore = xSemaphoreCreateBinary();

// Alternative older syntax
vSemaphoreCreateBinary(xSemaphore);
```

### Binary Semaphore Example (ISR to Task Signaling):

Example:

```c
// Global semaphore handle
SemaphoreHandle_t xWork;
QueueHandle_t xWorkQueue;

void vManagerTask(void *pvParameters)
{
    unsigned int xWorkTicketId;
    
    // Give the semaphore initially (make it available)
    xSemaphoreGive(xWork);
    
    while(1)
    {
        // Generate a random work ticket ID
        xWorkTicketId = (rand() & 0x1FF);
        
        // Send the ticket to queue
        xQueueSend(xWorkQueue, &xWorkTicketId, portMAX_DELAY);
        
        // Signal employee that work is available
        xSemaphoreGive(xWork);
        
        // Let employee process
        taskYIELD();
    }
}

void vEmployeeTask(void *pvParameters)
{
    unsigned char xWorkTicketId;
    
    while(1)
    {
        // Wait for manager to give work (blocks until semaphore given)
        xSemaphoreTake(xWork, portMAX_DELAY);
        
        // Get the work ticket from queue
        if(xQueueReceive(xWorkQueue, &xWorkTicketId, 0) == pdPASS)
        {
            // Process the work
            EmployeeDoWork(xWorkTicketId);
        }
    }
}

int main(void)
{
    // Create binary semaphore
    vSemaphoreCreateBinary(xWork);
    
    // Create queue for work tickets
    xWorkQueue = xQueueCreate(1, sizeof(unsigned int));
    
    if((xWork != NULL) && (xWorkQueue != NULL))
    {
        xTaskCreate(vManagerTask, "Manager", 500, NULL, 3, NULL);
        xTaskCreate(vEmployeeTask, "Employee", 500, NULL, 1, NULL);
        
        vTaskStartScheduler();
    }
}
```

## 7.3 Counting Semaphore

Counting semaphores can hold values from 0 to a maximum:

```
┌─────────────────────────────────────────────────────────────┐
│ Counting Semaphore (max=3):                                 │
│                                                             │
│    [3] → xSemaphoreTake() → [2] → xSemaphoreTake() → [1]   │
│         ↑                         ↑                         │
│    xSemaphoreGive()          xSemaphoreGive()              │
│         |                         |                         │
│    [1] ← ─ ─ ─ ─ ─ ─ ─ ─ ─ [2] ← ─ ─ ─ ─ ─ ─ ─ ─ ─ [3]    │
│                                                             │
│ Perfect for tracking multiple resources!                    │
└─────────────────────────────────────────────────────────────┘
```

### Creating Counting Semaphore:

```c
SemaphoreHandle_t xCountingSem;

// Create counting semaphore
// Parameters: max count, initial count
xCountingSem = xSemaphoreCreateCounting(3, 3);  // 3 resources, all available
```

### Counting Semaphore Example:

```c
#define NUM_BUFFERS 3
SemaphoreHandle_t buffer_sem;

void producer_task(void* params)
{
    while(1)
    {
        // Wait for a buffer to be available
        if(xSemaphoreTake(buffer_sem, pdMS_TO_TICKS(100)) == pdTRUE)
        {
            // Use a buffer
            fill_buffer();
            process_data();
            
            // Release the buffer
            xSemaphoreGive(buffer_sem);
        }
    }
}

int main(void)
{
    // Create semaphore with 3 buffers available
    buffer_sem = xSemaphoreCreateCounting(NUM_BUFFERS, NUM_BUFFERS);
    
    xTaskCreate(producer_task, "Producer1", 200, NULL, 1, NULL);
    xTaskCreate(producer_task, "Producer2", 200, NULL, 1, NULL);
    xTaskCreate(producer_task, "Producer3", 200, NULL, 1, NULL);
    
    vTaskStartScheduler();
}
```

## 7.4 Semaphore API Summary

| Function | Description | Context |
|----------|-------------|---------|
| `xSemaphoreCreateBinary()` | Create binary semaphore | Before scheduler |
| `xSemaphoreCreateCounting(max, init)` | Create counting semaphore | Before scheduler |
| `xSemaphoreTake(sem, timeout)` | Acquire semaphore (blocks if empty) | Task only |
| `xSemaphoreGive(sem)` | Release semaphore | Task only |
| `xSemaphoreTakeFromISR(sem, &woken)` | Acquire from ISR | ISR only |
| `xSemaphoreGiveFromISR(sem, &woken)` | Release from ISR | ISR only |

---

# 8. Mutexes

## 8.1 What is a Mutex?

A **Mutex** (Mutual Exclusion) is a special type of binary semaphore used to:
- **Protect shared resources** from simultaneous access
- **Prevent race conditions** when multiple tasks access the same data
- **Provide ownership** - only the task that took the mutex can give it

### Mutex vs Binary Semaphore:

| Feature | Binary Semaphore | Mutex |
|---------|------------------|-------|
| Purpose | Signaling/synchronization | Resource protection |
| Ownership | No owner | Has owner |
| Priority Inheritance | No | Yes (optional) |
| Can give without taking | Yes | No |
| Typical use | ISR to task signaling | Protecting shared data |

## 8.2 The Race Condition Problem

```c
// PROBLEM: Shared UART resource
char shared_buffer[100];

void task1(void* params)
{
    while(1)
    {
        sprintf(shared_buffer, "Task 1 message\n");  // Takes time!
        UART_Send(shared_buffer);
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

void task2(void* params)
{
    while(1)
    {
        sprintf(shared_buffer, "Task 2 message\n");  // Corrupts buffer!
        UART_Send(shared_buffer);
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

// OUTPUT might be garbage: "Task 1 Tes2 message"
// Task switch happened mid-sprintf!
```

## 8.3 Solving with Mutex

Example:

```c
// Enable mutex in your code
#define USE_MUTEX

#ifdef USE_MUTEX
SemaphoreHandle_t xMutex;
#endif

static void prvNewPrintString(const char *pcString)
{
    static char cBuffer[80];
    
#ifdef USE_MUTEX
    // Take the mutex - blocks if another task has it
    xSemaphoreTake(xMutex, portMAX_DELAY);
    {
#endif
        // Critical section - only one task at a time!
        sprintf(cBuffer, "%s", pcString);
        printmsg(cBuffer);
        
#ifdef USE_MUTEX
    }
    // Release the mutex
    xSemaphoreGive(xMutex);
#endif
}

static void prvPrintTask(void *pvParameters)
{
    char *pcStringToPrint = (char *)pvParameters;
    
    while(1)
    {
        // Multiple tasks call this - mutex protects the shared UART
        prvNewPrintString(pcStringToPrint);
        
        vTaskDelay(rand() & 0xF);  // Random delay
    }
}

int main(void)
{
#ifdef USE_MUTEX
    // Create the mutex
    xMutex = xSemaphoreCreateMutex();
    
    if(xMutex != NULL)
    {
#endif
        // Both tasks try to print, but mutex ensures clean output
        xTaskCreate(prvPrintTask, "Print1", 240, 
                   "Task 1 ******************************************\r\n", 1, NULL);
        xTaskCreate(prvPrintTask, "Print2", 240, 
                   "Task 2 ------------------------------------------\r\n", 2, NULL);
        
        vTaskStartScheduler();
        
#ifdef USE_MUTEX
    }
#endif
}
```

### Without Mutex (garbled output):
```
Task 1 ***********Task 2 ------****----Task 1 **--
```

### With Mutex (clean output):
```
Task 1 ******************************************
Task 2 ------------------------------------------
Task 1 ******************************************
```

## 8.4 Priority Inheritance

Mutexes in FreeRTOS support **priority inheritance** to solve priority inversion:

```
WITHOUT Priority Inheritance:
────────────────────────────────────────────────────────────
High Task:     [WAIT.......WAIT.......WAIT.......][RUN]
Medium Task:              [RUNNING..............]
Low Task:      [LOCK][wait..................][UNLOCK]
                     ↑
                     Medium task delays high task!

WITH Priority Inheritance:
────────────────────────────────────────────────────────────
High Task:     [WAIT........][RUN]
Medium Task:                        [RUNNING]
Low Task:      [LOCK][BOOSTED!][UNLOCK]
                     ↑
                     Low task inherits high priority!
                     Finishes quickly, releases mutex
```

The mutex automatically boosts the low-priority task to the highest priority of any waiting task.

## 8.5 Mutex Best Practices

1. **Keep critical sections SHORT** - Other tasks are waiting!

```c
// ✅ GOOD - Short critical section
xSemaphoreTake(xMutex, portMAX_DELAY);
shared_variable = new_value;  // Quick operation
xSemaphoreGive(xMutex);

// ❌ BAD - Long critical section
xSemaphoreTake(xMutex, portMAX_DELAY);
do_complex_calculation();  // Takes 100ms!
communicate_over_network();  // Takes even longer!
xSemaphoreGive(xMutex);
```

2. **Always release** - Forgetting causes deadlock!

```c
xSemaphoreTake(xMutex, portMAX_DELAY);
if(condition) {
    return;  // ❌ FORGOT TO RELEASE! DEADLOCK!
}
xSemaphoreGive(xMutex);
```

3. **Never use in ISR** - Use binary semaphores for ISR signaling

---

# 9. Queues

## 9.1 What is a Queue?

A **Queue** is a thread-safe FIFO (First-In-First-Out) data structure for passing data between tasks:

```
┌──────────────────────────────────────────────────────────────┐
│                         QUEUE                                 │
│                                                              │
│  Producer Task                              Consumer Task    │
│       │                                          ▲           │
│       ▼                                          │           │
│    ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  │           │
│    │ D5  │──│ D4  │──│ D3  │──│ D2  │──│ D1  │──┘           │
│    └─────┘  └─────┘  └─────┘  └─────┘  └─────┘              │
│    ← Send                                Receive →           │
│    (Blocks if full)               (Blocks if empty)         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Queue Features:
- **Thread-safe**: Multiple tasks can access safely
- **Blocking**: Tasks wait if queue is full/empty
- **Copy semantics**: Data is copied into/out of queue
- **Configurable size**: Set item count and item size at creation

## 9.2 Creating Queues

```c
QueueHandle_t xQueue;

// Create queue: 10 items, each sizeof(int) bytes
xQueue = xQueueCreate(10, sizeof(int));

// Check if creation succeeded
if(xQueue == NULL)
{
    // Failed - not enough heap memory
    Error_Handler();
}
```

## 9.3 Queue Operations

### Sending Data:

```c
int data_to_send = 42;

// Send to back of queue (normal FIFO)
xQueueSend(xQueue, &data_to_send, pdMS_TO_TICKS(100));
// OR
xQueueSendToBack(xQueue, &data_to_send, pdMS_TO_TICKS(100));

// Send to front of queue (priority/urgent data)
xQueueSendToFront(xQueue, &data_to_send, pdMS_TO_TICKS(100));

// Overwrite (only for queue size 1 - like a mailbox)
xQueueOverwrite(xQueue, &data_to_send);
```

### Receiving Data:

```c
int received_data;

// Receive and remove from queue
if(xQueueReceive(xQueue, &received_data, pdMS_TO_TICKS(100)) == pdTRUE)
{
    // Successfully received
    process_data(received_data);
}
else
{
    // Timeout - no data available within 100ms
}

// Peek - receive without removing
xQueuePeek(xQueue, &received_data, pdMS_TO_TICKS(100));
```

## 9.4 Queue example

Example:

```c
// Queue handles
QueueHandle_t q_data;    // For user input data
QueueHandle_t q_print;   // For print messages

int main(void)
{
    // Create queues
    q_data = xQueueCreate(10, sizeof(char));   // 10 characters
    q_print = xQueueCreate(10, sizeof(size_t)); // 10 pointers
    
    configASSERT(q_data != NULL);
    configASSERT(q_print != NULL);
    
    // Create tasks
    xTaskCreate(menu_task, "menu_task", 250, NULL, 2, &handle_menu_task);
    xTaskCreate(cmd_handler_task, "cmd_task", 250, NULL, 2, &handle_cmd_task);
    xTaskCreate(print_task, "print_task", 250, NULL, 2, &handle_print_task);
    
    // Enable UART receive interrupt
    HAL_UART_Receive_IT(&huart2, (uint8_t*)&user_data, 1);
    
    vTaskStartScheduler();
}

// UART receive callback (runs in interrupt context)
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    // Small delay for debounce
    for(uint32_t i = 0; i < 4000; i++);
    
    // Check if queue has space
    if(!xQueueIsQueueFullFromISR(q_data))
    {
        // Send received character to queue
        xQueueSendFromISR(q_data, (void*)&user_data, NULL);
    }
    else
    {
        // Queue full - ensure newline is last character
        if(user_data == '\n')
        {
            uint8_t dummy;
            xQueueReceiveFromISR(q_data, (void*)&dummy, NULL);
            xQueueSendFromISR(q_data, (void*)&user_data, NULL);
        }
    }
    
    // Notify command handler if newline received
    if(user_data == '\n')
    {
        xTaskNotifyFromISR(handle_cmd_task, 0, eNoAction, NULL);
    }
    
    // Re-enable UART receive interrupt
    HAL_UART_Receive_IT(&huart2, (uint8_t*)&user_data, 1);
}
```

## 9.5 Queue API Summary

| Function | Description | Timeout | Context |
|----------|-------------|---------|---------|
| `xQueueCreate(n, size)` | Create queue | N/A | Before scheduler |
| `xQueueSend(q, &data, timeout)` | Send to back | Yes | Task |
| `xQueueSendToFront(q, &data, timeout)` | Send to front | Yes | Task |
| `xQueueReceive(q, &data, timeout)` | Receive (remove) | Yes | Task |
| `xQueuePeek(q, &data, timeout)` | Receive (keep) | Yes | Task |
| `xQueueSendFromISR(q, &data, &woken)` | Send from ISR | No | ISR |
| `xQueueReceiveFromISR(q, &data, &woken)` | Receive from ISR | No | ISR |
| `uxQueueMessagesWaiting(q)` | Get queue count | N/A | Any |

---

# 10. Software Timers

## 10.1 What are Software Timers?

**Software Timers** execute callback functions at specified times/intervals without needing a dedicated task:

```
┌──────────────────────────────────────────────────────────────┐
│                    SOFTWARE TIMER                             │
│                                                              │
│    Start Timer                                               │
│         │                                                    │
│         ▼                                                    │
│    ┌─────────────────────────────────────────┐              │
│    │    Timer Period (e.g., 500ms)           │              │
│    └─────────────────────────────────────────┘              │
│                                               │              │
│                                               ▼              │
│                                    ┌──────────────────┐      │
│                                    │ Callback Function│      │
│                                    │ (LED toggle, etc)│      │
│                                    └──────────────────┘      │
│                                               │              │
│         ┌─────────────────────────────────────┘              │
│         │ Auto-Reload?                                       │
│         │   Yes → Restart timer                              │
│         │   No  → Timer stops                                │
│         ▼                                                    │
└──────────────────────────────────────────────────────────────┘
```

### Timer Types:

| Type | Behavior | Use Case |
|------|----------|----------|
| **One-Shot** | Fires once, then stops | Timeout, delayed action |
| **Auto-Reload** | Fires repeatedly | Periodic tasks, blinking |

## 10.2 Creating Timers

```c
TimerHandle_t xTimer;

// Create a software timer
xTimer = xTimerCreate(
    "MyTimer",                    // Name (debugging)
    pdMS_TO_TICKS(1000),         // Period (1 second)
    pdTRUE,                       // pdTRUE=Auto-reload, pdFALSE=One-shot
    (void*)1,                     // Timer ID (for identifying in callback)
    timer_callback                // Callback function
);

// Start the timer
xTimerStart(xTimer, portMAX_DELAY);
```

## 10.3 Timer Callback Functions

```c
void timer_callback(TimerHandle_t xTimer)
{
    // Get timer ID to identify which timer fired
    uint32_t timer_id = (uint32_t)pvTimerGetTimerID(xTimer);
    
    switch(timer_id)
    {
        case 1:
            // Handle timer 1 event
            HAL_GPIO_TogglePin(GPIOD, LED1_PIN);
            break;
        case 2:
            // Handle timer 2 event
            HAL_GPIO_TogglePin(GPIOD, LED2_PIN);
            break;
    }
}
```

## 10.4 Timer example

Example:

```c
// Timer handles
TimerHandle_t handle_led_timer[4];
TimerHandle_t rtc_timer;

void led_effect_callback(TimerHandle_t xTimer)
{
    // Get which LED effect timer fired
    int id = (uint32_t)pvTimerGetTimerID(xTimer);
    
    switch(id)
    {
        case 1:
            LED_effect1();  // First LED pattern
            break;
        case 2:
            LED_effect2();  // Second LED pattern
            break;
        case 3:
            LED_effect3();  // Third LED pattern
            break;
        case 4:
            LED_effect4();  // Fourth LED pattern
            break;
    }
}

void rtc_report_callback(TimerHandle_t xTimer)
{
    // Called every second to display time
    show_time_date_itm();
}

int main(void)
{
    // Create 4 LED effect timers (each with different ID)
    for(int i = 0; i < 4; i++)
    {
        handle_led_timer[i] = xTimerCreate(
            "led_timer",
            pdMS_TO_TICKS(500),     // 500ms period
            pdTRUE,                  // Auto-reload
            (void*)(i + 1),          // Timer ID: 1, 2, 3, or 4
            led_effect_callback
        );
    }
    
    // Create RTC reporting timer
    rtc_timer = xTimerCreate(
        "rtc_report_timer",
        pdMS_TO_TICKS(1000),         // 1 second period
        pdTRUE,                       // Auto-reload
        NULL,                         // No ID needed
        rtc_report_callback
    );
    
    vTaskStartScheduler();
}

// Start a specific LED effect
void led_effect(int effect_no)
{
    // Start the appropriate timer
    xTimerStart(handle_led_timer[effect_no - 1], portMAX_DELAY);
}

// Stop all LED effects
void led_effect_stop(void)
{
    for(int i = 0; i < 4; i++)
    {
        xTimerStop(handle_led_timer[i], portMAX_DELAY);
    }
}
```

## 10.5 Timer API Summary

| Function | Description |
|----------|-------------|
| `xTimerCreate(name, period, reload, id, callback)` | Create timer |
| `xTimerStart(timer, timeout)` | Start/restart timer |
| `xTimerStop(timer, timeout)` | Stop timer |
| `xTimerReset(timer, timeout)` | Restart timer from now |
| `xTimerChangePeriod(timer, newPeriod, timeout)` | Modify period |
| `pvTimerGetTimerID(timer)` | Get timer's ID |
| `vTimerSetTimerID(timer, newId)` | Change timer's ID |

---

# 11. Interrupt Handling in RTOS

## 11.1 ISR-Safe API Functions

FreeRTOS provides special API functions for use in **Interrupt Service Routines (ISRs)**:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     ISR Context                         Task Context         │
│                                                              │
│   ┌──────────────────┐              ┌──────────────────┐    │
│   │xQueueSendFromISR │              │xQueueSend        │    │
│   │xSemaphoreGiveFrom│              │xSemaphoreGive    │    │
│   │xTaskNotifyFromISR│              │xTaskNotify       │    │
│   │                  │              │                  │    │
│   │ ⚡ Non-blocking  │              │ Can block task   │    │
│   │ ⚡ No scheduler  │              │ May switch tasks │    │
│   │    calls         │              │                  │    │
│   └──────────────────┘              └──────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Why Special ISR Functions?

1. **ISRs must be FAST** - Can't wait/block
2. **No scheduler calls** in ISR - Could corrupt state
3. **Deferred processing** - Signal task, let it do heavy work

## 11.2 ISR to Task Signaling Pattern

Example:

```c
// Task handles (global for ISR access)
TaskHandle_t volatile next_task_handle = NULL;

// Button interrupt handler
void button_interrupt_handler(void)
{
    BaseType_t pxHigherPriorityTaskWoken = pdFALSE;
    
    traceISR_ENTER();  // For debugging/tracing
    
    // Send notification to the current LED task
    xTaskNotifyFromISR(
        next_task_handle,              // Target task
        0,                             // Notification value
        eNoAction,                     // Don't modify value
        &pxHigherPriorityTaskWoken     // Was a task woken?
    );
    
    // If we woke a higher priority task, request context switch
    portYIELD_FROM_ISR(pxHigherPriorityTaskWoken);
    
    traceISR_EXIT();
}

// LED task that waits for button press
static void led_green_handler(void* parameters)
{
    BaseType_t status;
    
    while(1)
    {
        HAL_GPIO_TogglePin(GPIOD, LED_GREEN_PIN);
        
        // Wait for notification OR timeout after 1000ms
        status = xTaskNotifyWait(0, 0, NULL, pdMS_TO_TICKS(1000));
        
        if(status == pdTRUE)
        {
            // Button was pressed! Delete this task
            portENTER_CRITICAL();
            next_task_handle = ledo_task_handle;  // Switch to next LED
            HAL_GPIO_WritePin(GPIOD, LED_GREEN_PIN, GPIO_PIN_SET);
            portEXIT_CRITICAL();
            
            vTaskDelete(NULL);
        }
    }
}

// Configure interrupt in GPIO init
static void MX_GPIO_Init(void)
{
    // ... other GPIO config ...
    
    // Configure button as interrupt input
    GPIO_InitStruct.Pin = B1_Pin;
    GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;  // Interrupt on falling edge
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    HAL_GPIO_Init(B1_GPIO_Port, &GPIO_InitStruct);
    
    // Enable EXTI interrupt
    HAL_NVIC_SetPriority(EXTI0_IRQn, 6, 0);  // Priority 6 (below FreeRTOS max)
    HAL_NVIC_EnableIRQ(EXTI0_IRQn);
}
```

## 11.3 Critical Sections

To protect code from both other tasks AND interrupts:

```c
// Method 1: Task-level critical section (disables preemption)
taskENTER_CRITICAL();
// Critical code here - no task switch, no interrupt
taskEXIT_CRITICAL();

// Method 2: Scheduler suspend (tasks can't switch, but interrupts run)
vTaskSuspendAll();
// Critical code here - tasks don't switch, but ISRs can run
xTaskResumeAll();

// Method 3: Interrupt masking (for ISR-safe critical sections)
UBaseType_t saved = taskENTER_CRITICAL_FROM_ISR();
// ISR critical code
taskEXIT_CRITICAL_FROM_ISR(saved);
```

### When to Use Each:

| Method | Use Case |
|--------|----------|
| `taskENTER/EXIT_CRITICAL` | Short critical section, no FreeRTOS calls inside |
| `vTaskSuspendAll/xTaskResumeAll` | Longer section, ISRs OK, some API calls allowed |
| `portENTER/EXIT_CRITICAL` | Same as taskENTER_CRITICAL |

## 11.4 Interrupt Priority Configuration

**CRITICAL**: FreeRTOS has specific interrupt priority requirements!

```c
// In FreeRTOSConfig.h
#define configLIBRARY_LOWEST_INTERRUPT_PRIORITY      15
#define configLIBRARY_MAX_SYSCALL_INTERRUPT_PRIORITY 5

// Interrupts 0-4: CANNOT call FreeRTOS API (too high priority)
// Interrupts 5-15: CAN call FreeRTOS FromISR functions
// Priority 15: Lowest priority (FreeRTOS tick, PendSV, etc.)
```

```
Priority 0 ──┬── Highest priority (NO FreeRTOS API!)
         1   │
         2   │
         3   │
         4   │
configMAX ─5 ──┼── Highest that can use FreeRTOS FromISR APIs
         6   │
         7   │    Your button interrupt (can use xTaskNotifyFromISR)
         8   │
         ...  │
         14  │
configLOW  15 ──┴── Lowest (SysTick, PendSV)
```

---

# 12. Task Notifications

## 12.1 What are Task Notifications?

**Task Notifications** are a lightweight, fast mechanism for signaling tasks directly:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│    Task A                                    Task B          │
│   (Sender)                                 (Receiver)        │
│                                                              │
│      │                                                       │
│      │  xTaskNotify(taskB_handle, value, action)             │
│      └──────────────────────────────────────────────▶ ⚡     │
│                                                      │       │
│                               xTaskNotifyWait() ◀────┘       │
│                               (unblocks immediately)         │
│                                                              │
│  ✅ Faster than semaphores/queues                            │
│  ✅ No separate object to create                             │
│  ✅ Built into every task                                    │
│  ⚠️  Only one notification per task at a time               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Notification Actions:

| Action | Description |
|--------|-------------|
| `eNoAction` | Just unblock the task |
| `eSetBits` | OR value with notification value |
| `eIncrement` | Increment notification value |
| `eSetValueWithOverwrite` | Set value (overwrite existing) |
| `eSetValueWithoutOverwrite` | Set value only if no pending notification |

## 12.2 Task Notification Example

Example:

```c
TaskHandle_t ledg_task_handle;
TaskHandle_t ledo_task_handle;
TaskHandle_t ledr_task_handle;
TaskHandle_t btn_task_handle;

TaskHandle_t volatile next_task_handle = NULL;

// Button task polls the button and notifies LED tasks
static void button_handler(void* parameters)
{
    uint8_t btn_read = 0;
    uint8_t prev_read = 0;
    
    while(1)
    {
        btn_read = HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0);
        
        if(btn_read)  // Button pressed
        {
            if(!prev_read)  // Detect edge (not held)
            {
                // Notify the current LED task
                xTaskNotify(next_task_handle, 0, eNoAction);
            }
        }
        prev_read = btn_read;
        
        vTaskDelay(pdMS_TO_TICKS(10));  // Debounce delay
    }
}

// LED task waits for button notification
static void led_green_handler(void* parameters)
{
    BaseType_t status;
    
    while(1)
    {
        HAL_GPIO_TogglePin(GPIOD, LED_GREEN_PIN);
        
        // Wait for notification with 1 second timeout
        status = xTaskNotifyWait(
            0,                      // Clear no bits on entry
            0,                      // Clear no bits on exit
            NULL,                   // Don't need notification value
            pdMS_TO_TICKS(1000)     // 1 second timeout
        );
        
        if(status == pdTRUE)  // Notification received!
        {
            // Switch to next LED task
            vTaskSuspendAll();
            next_task_handle = ledo_task_handle;
            xTaskResumeAll();
            
            HAL_GPIO_WritePin(GPIOD, LED_GREEN_PIN, GPIO_PIN_SET);
            vTaskDelete(NULL);  // Delete this task
        }
    }
}
```

## 12.3 Notification API

| Function | Description | Context |
|----------|-------------|---------|
| `xTaskNotify(task, value, action)` | Send notification | Task |
| `xTaskNotifyFromISR(task, value, action, &woken)` | Send from ISR | ISR |
| `xTaskNotifyWait(clearEntry, clearExit, &value, timeout)` | Wait for notification | Task |
| `xTaskNotifyGive(task)` | Increment notification (semaphore-like) | Task |
| `ulTaskNotifyTake(clearOnExit, timeout)` | Wait and clear (semaphore-like) | Task |

---

# 13. Memory Management

## 13.1 FreeRTOS Heap

FreeRTOS provides several heap implementations:

| Heap | Allocation | Free | Use Case |
|------|------------|------|----------|
| `heap_1.c` | Yes | No | Static allocation only |
| `heap_2.c` | Yes | Yes | Simple, may fragment |
| `heap_3.c` | Wraps malloc/free | Yes | Uses standard library |
| `heap_4.c` | Yes | Yes | Best general purpose! |
| `heap_5.c` | Yes | Yes | Multiple memory regions |

### Configure Heap Size:

```c
// In FreeRTOSConfig.h
#define configTOTAL_HEAP_SIZE    ((size_t)(10 * 1024))  // 10KB heap
```

## 13.2 Stack Size Tips

```c
// Each task needs stack for:
// 1. Local variables
// 2. Function call frames
// 3. Context save (registers)

// Minimum stack: ~128 words for simple tasks
// Typical stack: 200-500 words for moderate tasks
// Large stack: 1000+ words for complex/recursive tasks

// Stack size is in WORDS, not bytes!
// 32-bit MCU: 200 words = 800 bytes
xTaskCreate(my_task, "Task", 200, NULL, 1, NULL);
```

## 13.3 Memory Debugging

```c
// Get free heap
size_t free_heap = xPortGetFreeHeapSize();

// Get minimum ever free heap (high water mark)
size_t min_ever_free = xPortGetMinimumEverFreeHeapSize();

// Get task stack high water mark (minimum remaining)
UBaseType_t stack_remaining = uxTaskGetStackHighWaterMark(task_handle);
// If this gets close to 0, task may overflow!
```

---

# 14. Practical exercises

## Exercise 1: Simple task creation

**Objective**: Create two tasks that print messages alternately.

**Key Concepts**:
- Task creation with `xTaskCreate()`
- Task function structure
- `taskYIELD()` for cooperative multitasking
- Passing parameters to tasks

**Code Summary**:
```c
// Two tasks, same priority, alternating execution
status = xTaskCreate(task1_handler, "Task-1", 200, "Hello from Task-1", 2, &task1_handle);
status = xTaskCreate(task2_handler, "Task-2", 200, "Hello from Task-2", 2, &task2_handle);
vTaskStartScheduler();
```

---

## Exercise 2: LED tasks

**Objective**: Blink multiple LEDs at different rates using separate tasks.

**Key Concepts**:
- Multiple tasks controlling hardware
- HAL_Delay (blocking - not recommended)
- Independent task execution

**Code Summary**:
```c
// Three LED tasks with different delays
// Each task toggles its LED at different rate
static void led_green_handler(void* parameters)
{
    while(1)
    {
        HAL_GPIO_TogglePin(GPIOD, LED_GREEN_PIN);
        HAL_Delay(1000);  // 1 second
    }
}

static void led_orange_handler(void* parameters)
{
    while(1)
    {
        HAL_GPIO_TogglePin(GPIOD, LED_ORANGE_PIN);
        HAL_Delay(800);   // 800ms
    }
}

static void led_red_handler(void* parameters)
{
    while(1)
    {
        HAL_GPIO_TogglePin(GPIOD, LED_RED_PIN);
        HAL_Delay(400);   // 400ms
    }
}
```

---

## Exercise 3: LED tasks with blocking delays

**Objective**: Proper RTOS delays with `vTaskDelay()` and idle hook for power saving.

**Key Concepts**:
- `vTaskDelay()` vs `HAL_Delay()`
- `pdMS_TO_TICKS()` macro
- Idle hook for power saving
- Task blocking states

**Improvements over exercise 2**:
```c
// Using proper RTOS delay
vTaskDelay(pdMS_TO_TICKS(1000));  // Task blocks, other tasks can run

// Power saving when idle
void vApplicationIdleHook(void)
{
    HAL_PWR_EnterSLEEPMode(PWR_MAINREGULATOR_ON, PWR_SLEEPENTRY_WFI);
}
```

---

## Exercise 4: Periodic LED tasks

**Objective**: Precise periodic execution using `vTaskDelayUntil()`.

**Key Concepts**:
- `vTaskDelayUntil()` for exact periodic timing
- `xTaskGetTickCount()`
- Jitter-free periodic tasks

**Code Summary**:
```c
static void led_green_handler(void* parameters)
{
    TickType_t last_wakeup_time;
    
    // Initialize with current time
    last_wakeup_time = xTaskGetTickCount();
    
    while(1)
    {
        HAL_GPIO_TogglePin(GPIOD, LED_GREEN_PIN);
        
        // Delay UNTIL exactly 1000ms from last wake
        vTaskDelayUntil(&last_wakeup_time, pdMS_TO_TICKS(1000));
    }
}
```

---

## Exercise 5: Task notifications

**Objective**: Use task notifications for inter-task communication.

**Key Concepts**:
- `xTaskNotify()` and `xTaskNotifyWait()`
- Button polling
- Task deletion
- Dynamic task switching

**Code Summary**:
```c
// Button handler sends notifications
if(btn_pressed)
    xTaskNotify(next_task_handle, 0, eNoAction);

// LED task waits for notification or timeout
status = xTaskNotifyWait(0, 0, NULL, pdMS_TO_TICKS(1000));
if(status == pdTRUE)
{
    // Button pressed - switch to next LED
    next_task_handle = next_led_task;
    vTaskDelete(NULL);
}
```

---

## Exercise 6: ISR-based notifications

**Objective**: Send notifications from interrupt handler to tasks.

**Key Concepts**:
- `xTaskNotifyFromISR()`
- `portYIELD_FROM_ISR()`
- ISR to task communication
- Critical sections

**Code Summary**:
```c
void button_interrupt_handler(void)
{
    BaseType_t pxHigherPriorityTaskWoken = pdFALSE;
    
    // Notify from ISR
    xTaskNotifyFromISR(next_task_handle, 0, eNoAction, &pxHigherPriorityTaskWoken);
    
    // Request context switch if needed
    portYIELD_FROM_ISR(pxHigherPriorityTaskWoken);
}
```

---

## Exercise 7: Dynamic priority

**Objective**: Change task priorities at runtime.

**Key Concepts**:
- `uxTaskPriorityGet()` and `vTaskPrioritySet()`
- `xTaskGetHandle()` to find task by name
- Priority-based preemption
- Critical sections for atomic operations

**Code Summary**:
```c
void switch_priority(void)
{
    TaskHandle_t t1 = xTaskGetHandle("Task-1");
    TaskHandle_t t2 = xTaskGetHandle("Task-2");
    
    UBaseType_t p1 = uxTaskPriorityGet(t1);
    UBaseType_t p2 = uxTaskPriorityGet(t2);
    
    // Swap priorities
    vTaskPrioritySet(t1, p2);
    vTaskPrioritySet(t2, p1);
}
```

---

## Exercise 8: Queues and software timers

**Objective**: Complete application using queues, timers, and multiple tasks.

**Key Concepts**:
- Queue creation and usage
- Software timers with callbacks
- UART interrupt handling
- State machine design
- Menu-driven interface

**Features**:
- LED effect control via UART commands
- RTC time display
- Multiple software timers
- Queue-based command processing

---

## Exercise 9: Binary semaphore

**Objective**: Manager-Employee synchronization using binary semaphore.

**Key Concepts**:
- `vSemaphoreCreateBinary()`
- `xSemaphoreGive()` and `xSemaphoreTake()`
- Producer-consumer pattern
- Task synchronization

---

## Exercise 10: Mutex

**Objective**: Protect shared UART resource using mutex.

**Key Concepts**:
- `xSemaphoreCreateMutex()`
- Mutual exclusion
- Priority inheritance
- Race condition prevention

---

# 📚 Quick Reference Card

## Essential FreeRTOS Functions

### Task Management
```c
xTaskCreate(func, name, stack, params, priority, &handle)
vTaskDelete(handle)
vTaskDelay(ticks)
vTaskDelayUntil(&lastWake, ticks)
vTaskSuspend(handle)
vTaskResume(handle)
taskYIELD()
```

### Queues
```c
xQueueCreate(length, itemSize)
xQueueSend(queue, &item, timeout)
xQueueReceive(queue, &item, timeout)
xQueueSendFromISR(queue, &item, &woken)
```

### Semaphores/Mutexes
```c
xSemaphoreCreateBinary()
xSemaphoreCreateMutex()
xSemaphoreCreateCounting(max, initial)
xSemaphoreGive(sem)
xSemaphoreTake(sem, timeout)
xSemaphoreGiveFromISR(sem, &woken)
```

### Task Notifications
```c
xTaskNotify(task, value, action)
xTaskNotifyWait(clearEntry, clearExit, &value, timeout)
xTaskNotifyFromISR(task, value, action, &woken)
```

### Software Timers
```c
xTimerCreate(name, period, autoReload, id, callback)
xTimerStart(timer, timeout)
xTimerStop(timer, timeout)
xTimerReset(timer, timeout)
```

### Critical Sections
```c
taskENTER_CRITICAL()
taskEXIT_CRITICAL()
vTaskSuspendAll()
xTaskResumeAll()
portYIELD_FROM_ISR(woken)
```

---

# 🎯 Suggested learning path

1. **Weeks 1–2:** Tasks, `xTaskCreate`, task handles, `vTaskStartScheduler`, delays, and tick time.
2. **Week 3:** Periodic timing (`vTaskDelayUntil`), scheduling intuition, and priorities.
3. **Week 4:** Signaling with binary semaphores; data with queues; short ISRs with `FromISR` APIs.
4. **Week 5:** Mutexes, priority inversion, and counting semaphores for resource pools.
5. **Weeks 6–8:** Software timers, task notifications, heap/stack tuning, and integration testing.

Repeat each topic with a small program on your hardware or simulator until the behavior matches what you expect.

---

**Happy Learning! 🚀**

*Aligned with [FreeRTOS.org](https://www.freertos.org/) documentation and common STM32 + FreeRTOS workflows.*

