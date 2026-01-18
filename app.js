/**
 * Cognitive Research Tool - SPA Application
 * With Hash-Based Routing & 3D Particle Background
 */

// ================================================
// 3D Interactive Background
// ================================================

class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1,
                baseRadius: Math.random() * 3 + 1,
                color: this.getParticleColor(),
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }

    getParticleColor() {
        const colors = this.isDark
            ? ['rgba(129, 140, 248, 0.6)', 'rgba(167, 139, 250, 0.5)', 'rgba(236, 72, 153, 0.4)', 'rgba(6, 182, 212, 0.4)']
            : ['rgba(99, 102, 241, 0.4)', 'rgba(139, 92, 246, 0.35)', 'rgba(236, 72, 153, 0.3)', 'rgba(6, 182, 212, 0.3)'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    updateTheme(isDark) {
        this.isDark = isDark;
        this.particles.forEach(p => {
            p.color = this.getParticleColor();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((p, i) => {
            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x -= dx * force * 0.03;
                    p.y -= dy * force * 0.03;
                    p.radius = p.baseRadius + force * 2;
                } else {
                    p.radius = p.baseRadius;
                }
            }

            // Update position with subtle wave motion
            p.angle += p.rotationSpeed;
            p.x += p.vx + Math.sin(p.angle) * 0.3;
            p.y += p.vy + Math.cos(p.angle) * 0.3;

            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = this.isDark
                        ? `rgba(129, 140, 248, ${opacity})`
                        : `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ================================================
// SPA Router
// ================================================

class Router {
    constructor() {
        this.routes = {
            '/': 'landing',
            '/study': 'memory-study',
            '/recall': 'memory-recall',
            '/reaction': 'response-time',
            '/results': 'results'
        };
        this.currentRoute = '/';

        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        this.navigate(hash, false);
    }

    navigate(route, updateHash = true) {
        if (!this.routes[route]) return;

        this.currentRoute = route;

        if (updateHash) {
            window.location.hash = route === '/' ? '' : route;
        }

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetId = this.routes[route];
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation dots
        this.updateNavigation(targetId);
    }

    updateNavigation(activePageId) {
        const dots = document.querySelectorAll('.nav-dot');
        const routeOrder = ['landing', 'memory-study', 'memory-recall', 'response-time', 'results'];
        const activeIndex = routeOrder.indexOf(activePageId);

        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');

            if (index < activeIndex) {
                dot.classList.add('completed');
            } else if (index === activeIndex) {
                dot.classList.add('active');
            }
        });
    }
}

// ================================================
// Application State
// ================================================

const state = {
    participantId: '',
    stimuliWords: [],
    recalledWords: [],
    studyStartTime: null,
    timerInterval: null,
    currentTrial: 1,
    totalTrials: 5,
    responseTimes: [],
    stimulusAppearTime: null,
    rtTimeout: null,
    memoryScore: 0,
    memoryPercentage: 0,
    averageRT: 0,

    wordPool: [
        'Apple', 'Clock', 'River', 'Mountain', 'Garden',
        'Bridge', 'Castle', 'Ocean', 'Forest', 'Window',
        'Thunder', 'Candle', 'Marble', 'Sunset', 'Anchor',
        'Feather', 'Diamond', 'Lantern', 'Compass', 'Velvet',
        'Pyramid', 'Crystal', 'Shadow', 'Meadow', 'Whisper',
        'Dragon', 'Trophy', 'Blanket', 'Bottle', 'Camera'
    ]
};

// ================================================
// DOM Elements
// ================================================

const elements = {
    // Landing
    participantForm: document.getElementById('participant-form'),
    participantId: document.getElementById('participant-id'),

    // Memory Study
    wordGrid: document.getElementById('word-grid'),
    studyTimer: document.getElementById('study-timer'),
    timerProgress: document.getElementById('timer-progress'),
    timerCircle: document.getElementById('timer-circle'),

    // Memory Recall
    recallInput: document.getElementById('recall-input'),
    addWordBtn: document.getElementById('add-word-btn'),
    recalledList: document.getElementById('recalled-list'),
    recallCount: document.getElementById('recall-count'),
    finishRecallBtn: document.getElementById('finish-recall-btn'),

    // Response Time
    rtInstructions: document.getElementById('rt-instructions'),
    rtWaiting: document.getElementById('rt-waiting'),
    rtStimulus: document.getElementById('rt-stimulus'),
    rtFeedback: document.getElementById('rt-feedback'),
    currentTrial: document.getElementById('current-trial'),
    readyBtn: document.getElementById('ready-btn'),
    stimulusCircle: document.getElementById('stimulus-circle'),
    feedbackTime: document.getElementById('feedback-time'),
    nextTrialBtn: document.getElementById('next-trial-btn'),

    // Results
    memoryScore: document.getElementById('memory-score'),
    memoryBar: document.getElementById('memory-bar'),
    memoryPercentage: document.getElementById('memory-percentage'),
    rtAverage: document.getElementById('rt-average'),
    rtBar: document.getElementById('rt-bar'),
    rtTrialsList: document.getElementById('rt-trials-list'),
    exportBtn: document.getElementById('export-btn'),
    restartBtn: document.getElementById('restart-btn')
};

// Global instances
let router;
let particleBg;

// ================================================
// Utility Functions
// ================================================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ================================================
// Theme Toggle
// ================================================

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-toggle-icon');

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
    }

    themeToggle.addEventListener('click', toggleTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const isDark = e.matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            themeIcon.textContent = isDark ? '☀️' : '🌙';
            if (particleBg) particleBg.updateTheme(isDark);
        }
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme !== 'dark';

    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIcon.textContent = isDark ? '☀️' : '🌙';

    if (particleBg) particleBg.updateTheme(isDark);
}

// ================================================
// Landing Page
// ================================================

function initLandingPage() {
    elements.participantForm.addEventListener('submit', handleStartExperiment);
}

function handleStartExperiment(event) {
    event.preventDefault();

    const participantId = elements.participantId.value.trim();
    if (!participantId) {
        elements.participantId.focus();
        return;
    }

    state.participantId = participantId;
    startMemoryStudyPhase();
}

// ================================================
// Memory Study Phase
// ================================================

function startMemoryStudyPhase() {
    const shuffledWords = shuffleArray(state.wordPool);
    state.stimuliWords = shuffledWords.slice(0, 10);

    renderWordGrid();
    router.navigate('/study');

    // Small delay to allow page transition
    setTimeout(() => {
        startStudyTimer(30);
    }, 300);
}

function renderWordGrid() {
    elements.wordGrid.innerHTML = '';

    state.stimuliWords.forEach(word => {
        const wordCard = document.createElement('div');
        wordCard.className = 'word-card';
        wordCard.textContent = word;
        elements.wordGrid.appendChild(wordCard);
    });
}

function startStudyTimer(duration) {
    let timeRemaining = duration;
    state.studyStartTime = Date.now();

    elements.studyTimer.textContent = timeRemaining;
    elements.timerProgress.style.width = '100%';

    // SVG circle animation
    const circumference = 2 * Math.PI * 45; // r=45
    if (elements.timerCircle) {
        elements.timerCircle.style.strokeDasharray = circumference;
        elements.timerCircle.style.strokeDashoffset = 0;
    }

    state.timerInterval = setInterval(() => {
        timeRemaining--;
        elements.studyTimer.textContent = timeRemaining;

        // Update progress bar
        const progress = (timeRemaining / duration) * 100;
        elements.timerProgress.style.width = `${progress}%`;

        // Update SVG circle
        if (elements.timerCircle) {
            const offset = circumference * (1 - timeRemaining / duration);
            elements.timerCircle.style.strokeDashoffset = offset;
        }

        // Warning states
        elements.studyTimer.classList.remove('warning', 'danger');
        if (timeRemaining <= 10 && timeRemaining > 5) {
            elements.studyTimer.classList.add('warning');
        } else if (timeRemaining <= 5) {
            elements.studyTimer.classList.add('danger');
        }

        if (timeRemaining <= 0) {
            clearInterval(state.timerInterval);
            elements.studyTimer.classList.remove('warning', 'danger');
            startMemoryRecallPhase();
        }
    }, 1000);
}

// ================================================
// Memory Recall Phase
// ================================================

function startMemoryRecallPhase() {
    state.recalledWords = [];
    updateRecalledList();
    router.navigate('/recall');

    setTimeout(() => {
        elements.recallInput.focus();
    }, 300);
}

function initMemoryRecall() {
    elements.addWordBtn.addEventListener('click', handleAddWord);
    elements.recallInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddWord();
        }
    });
    elements.finishRecallBtn.addEventListener('click', startResponseTimePhase);
}

function handleAddWord() {
    const word = elements.recallInput.value.trim();

    if (!word) return;

    const alreadyAdded = state.recalledWords.some(
        w => w.toLowerCase() === word.toLowerCase()
    );

    if (alreadyAdded) {
        elements.recallInput.value = '';
        elements.recallInput.focus();
        return;
    }

    state.recalledWords.push(word);
    updateRecalledList();

    elements.recallInput.value = '';
    elements.recallInput.focus();
}

function handleRemoveWord(index) {
    state.recalledWords.splice(index, 1);
    updateRecalledList();
}

// Make it globally accessible for onclick
window.handleRemoveWord = handleRemoveWord;

function updateRecalledList() {
    elements.recalledList.innerHTML = '';

    state.recalledWords.forEach((word, index) => {
        const div = document.createElement('div');
        div.className = 'recalled-word';
        div.innerHTML = `
            <span>${word}</span>
            <button type="button" onclick="handleRemoveWord(${index})" aria-label="Remove">×</button>
        `;
        elements.recalledList.appendChild(div);
    });

    elements.recallCount.textContent = state.recalledWords.length;
}

// ================================================
// Response Time Phase - Seamless Trials
// ================================================

function startResponseTimePhase() {
    state.currentTrial = 1;
    state.responseTimes = [];
    state.isTrialActive = false;

    updateTrialCounter();
    showRTInstructions();
    router.navigate('/reaction');
}

function initResponseTime() {
    elements.readyBtn.addEventListener('click', startFirstTrial);

    // Use mousedown for faster response detection
    elements.stimulusCircle.addEventListener('mousedown', handleStimulusClick);
    elements.stimulusCircle.addEventListener('touchstart', handleStimulusClick, { passive: true });
}

function updateTrialCounter() {
    elements.currentTrial.textContent = state.currentTrial;
}

function showRTInstructions() {
    elements.rtInstructions.classList.remove('hidden');
    elements.rtWaiting.classList.add('hidden');
    elements.rtStimulus.classList.add('hidden');
    elements.rtFeedback.classList.add('hidden');
}

function startFirstTrial() {
    // Start the first trial
    startTrial();
}

function startTrial() {
    state.isTrialActive = true;

    // Hide all screens, show waiting
    elements.rtInstructions.classList.add('hidden');
    elements.rtFeedback.classList.add('hidden');
    elements.rtStimulus.classList.add('hidden');
    elements.rtWaiting.classList.remove('hidden');

    // Update trial counter
    updateTrialCounter();

    // Random delay between 1.5-4 seconds (slightly shorter for better UX)
    const delay = getRandomDelay(1500, 4000);

    state.rtTimeout = setTimeout(() => {
        showStimulus();
    }, delay);
}

function showStimulus() {
    elements.rtWaiting.classList.add('hidden');
    elements.rtStimulus.classList.remove('hidden');

    // Record time immediately when stimulus appears - use performance.now() for precision
    state.stimulusAppearTime = performance.now();
}

function handleStimulusClick(e) {
    // Prevent double-firing and ensure trial is active
    if (!state.isTrialActive || !state.stimulusAppearTime) return;

    e.preventDefault();

    // Calculate response time immediately
    const clickTime = performance.now();
    const responseTime = Math.round(clickTime - state.stimulusAppearTime);

    // Mark trial as inactive to prevent double clicks
    state.isTrialActive = false;
    state.stimulusAppearTime = null;

    // Store the response time
    state.responseTimes.push(responseTime);

    // Show brief feedback then auto-continue
    showFeedbackAndContinue(responseTime);
}

function showFeedbackAndContinue(responseTime) {
    elements.rtStimulus.classList.add('hidden');
    elements.rtFeedback.classList.remove('hidden');

    // Display the response time
    elements.feedbackTime.textContent = responseTime;

    // Update trial display in feedback section
    const feedbackTrialEl = document.getElementById('feedback-trial');
    if (feedbackTrialEl) {
        feedbackTrialEl.textContent = state.currentTrial;
    }

    // Update hint text
    const hintEl = document.querySelector('.feedback-hint');
    if (hintEl) {
        if (state.currentTrial >= state.totalTrials) {
            hintEl.textContent = 'Calculating results...';
        } else {
            hintEl.textContent = `Trial ${state.currentTrial + 1} coming up...`;
        }
    }

    // Auto-continue after brief delay
    setTimeout(() => {
        if (state.currentTrial >= state.totalTrials) {
            // All trials complete, show results
            showResults();
        } else {
            // Move to next trial automatically
            state.currentTrial++;
            startTrial();
        }
    }, 1000); // 1 second feedback display
}

// ================================================
// Results Phase
// ================================================

function showResults() {
    calculateResults();
    renderResults();
    router.navigate('/results');
}

function calculateResults() {
    const correctWords = state.recalledWords.filter(recalled =>
        state.stimuliWords.some(
            original => original.toLowerCase() === recalled.toLowerCase()
        )
    );

    state.memoryScore = correctWords.length;
    state.memoryPercentage = Math.round((correctWords.length / 10) * 100);

    const totalRT = state.responseTimes.reduce((sum, rt) => sum + rt, 0);
    state.averageRT = Math.round(totalRT / state.responseTimes.length);
}

function renderResults() {
    // Memory score
    elements.memoryScore.textContent = state.memoryScore;
    elements.memoryPercentage.textContent = `${state.memoryPercentage}% accuracy`;

    // Animate memory bar
    setTimeout(() => {
        elements.memoryBar.style.width = `${state.memoryPercentage}%`;
    }, 300);

    // Response time
    elements.rtAverage.textContent = state.averageRT;

    // RT bar (inverse - faster is better, max 1000ms for 0%, 0ms for 100%)
    const rtPercent = Math.max(0, Math.min(100, 100 - (state.averageRT / 10)));
    setTimeout(() => {
        elements.rtBar.style.width = `${rtPercent}%`;
    }, 500);

    // Individual trials
    elements.rtTrialsList.innerHTML = '';
    state.responseTimes.forEach((rt, index) => {
        const div = document.createElement('div');
        div.className = 'trial-item';
        div.innerHTML = `
            <span class="trial-num">Trial ${index + 1}</span>
            <span class="trial-time">${rt}ms</span>
        `;
        elements.rtTrialsList.appendChild(div);
    });
}

function initResults() {
    elements.exportBtn.addEventListener('click', exportData);
    elements.restartBtn.addEventListener('click', restartExperiment);
}

function exportData() {
    const data = {
        participantId: state.participantId,
        timestamp: new Date().toISOString(),
        memoryRecall: {
            stimuliWords: state.stimuliWords,
            recalledWords: state.recalledWords,
            correctCount: state.memoryScore,
            totalWords: 10,
            accuracy: state.memoryPercentage
        },
        responseTime: {
            trials: state.responseTimes.map((rt, index) => ({
                trial: index + 1,
                responseTimeMs: rt
            })),
            averageMs: state.averageRT
        }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognitive-research-${state.participantId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function restartExperiment() {
    // Clear any running timers
    if (state.timerInterval) clearInterval(state.timerInterval);
    if (state.rtTimeout) clearTimeout(state.rtTimeout);

    // Reset state
    state.participantId = '';
    state.stimuliWords = [];
    state.recalledWords = [];
    state.currentTrial = 1;
    state.responseTimes = [];

    // Reset UI
    elements.participantId.value = '';
    elements.recallInput.value = '';
    elements.nextTrialBtn.textContent = 'Next Trial';
    elements.memoryBar.style.width = '0%';
    elements.rtBar.style.width = '0%';

    // Navigate home
    router.navigate('/');
}

// ================================================
// Initialize Application
// ================================================

function init() {
    initTheme();

    // Initialize 3D background
    particleBg = new ParticleBackground();

    // Initialize router
    router = new Router();

    // Initialize all page handlers
    initLandingPage();
    initMemoryRecall();
    initResponseTime();
    initResults();

    // Add SVG gradient for timer (inline since we can't use external)
    const svg = document.querySelector('.timer-ring svg');
    if (svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#6366f1"/>
                <stop offset="50%" style="stop-color:#8b5cf6"/>
                <stop offset="100%" style="stop-color:#a855f7"/>
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
