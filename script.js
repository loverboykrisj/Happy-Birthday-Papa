document.addEventListener('DOMContentLoaded', () => {

    // Initialize Animate on Scroll
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 50,
    });

    // --- PARTICLE BACKGROUND ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];

    const particleConfig = {
        count: 50,
        speed: 2,
        colors: ['#e94560', '#0f3460', '#f0f0f0', '#ffffff'],
        size: { min: 2, max: 5 }
    };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (particleConfig.size.max - particleConfig.size.min) + particleConfig.size.min;
            this.speedX = (Math.random() * 2 - 1) * particleConfig.speed * 0.5;
            this.speedY = (Math.random() * 2 - 1) * particleConfig.speed * 0.5;
            this.color = particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)];
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            this.x += this.speedX;
            this.y += this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < particleConfig.count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        initParticles();
    });


    // --- ENVELOPE OPENING ---
    const envelope = document.querySelector('.envelope-wrapper');
    if (envelope) {
        envelope.addEventListener('click', () => {
            envelope.classList.toggle('open');
        });
    }

    // --- DYNAMIC AGE COUNTER ---
    const birthDate = new Date('1980-07-21T00:00:00');
    const yearsSpan = document.getElementById('years');
    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minsSpan = document.getElementById('mins');
    const secsSpan = document.getElementById('secs');

    function updateAgeCounter() {
        const now = new Date();
        
        let years = now.getFullYear() - birthDate.getFullYear();
        let lastBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (now < lastBirthday) {
            years--;
            lastBirthday.setFullYear(lastBirthday.getFullYear() - 1);
        }

        let diff = now - lastBirthday;
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);
        let hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        let mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);
        let secs = Math.floor(diff / 1000);

        yearsSpan.textContent = years.toString().padStart(2, '0');
        daysSpan.textContent = days.toString().padStart(3, '0');
        hoursSpan.textContent = hours.toString().padStart(2, '0');
        minsSpan.textContent = mins.toString().padStart(2, '0');
        secsSpan.textContent = secs.toString().padStart(2, '0');
    }

    setInterval(updateAgeCounter, 1000);
    updateAgeCounter(); // Initial call

    // --- QUIZ LOGIC ---
    // CUSTOMIZE YOUR QUIZ QUESTIONS HERE
    const quizData = [
        {
            question: "What's Dad's most-used phrase?",
            options: ["Because I said so", "Ask your mother", "It builds character", "We'll see"],
            answer: "Ask your mother"
        },
        {
            question: "What is Dad's secret talent?",
            options: ["Juggling", "Singing opera", "Wiggling his ears", "Magic tricks"],
            answer: "Wiggling his ears"
        },
        {
            question: "If Dad were a superhero, who would he be?",
            options: ["Superman", "Batman", "Hulk", "Captain America"],
            answer: "Captain America"
        }
    ];

    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    const questionText = document.getElementById('question-text');
    const quizOptions = document.querySelector('.quiz-options');
    const scoreSpan = document.getElementById('score');
    const totalSpan = document.getElementById('total-questions');
    const retryBtn = document.getElementById('retry-quiz-btn');

    let currentQuestionIndex = 0;
    let score = 0;

    function loadQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        quizOptions.innerHTML = '';
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('quiz-btn');
            button.addEventListener('click', () => selectAnswer(button, option, currentQuestion.answer));
            quizOptions.appendChild(button);
        });
    }

    function selectAnswer(button, selected, correct) {
        const buttons = quizOptions.querySelectorAll('.quiz-btn');
        buttons.forEach(btn => btn.disabled = true); // Disable all buttons

        if (selected === correct) {
            button.classList.add('correct');
            score++;
        } else {
            button.classList.add('incorrect');
            // Highlight the correct answer
            buttons.forEach(btn => {
                if(btn.textContent === correct) {
                    btn.classList.add('correct');
                }
            });
        }

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }, 1500); // Wait 1.5 seconds before next question
    }
    
    function showResults() {
        quizContent.style.display = 'none';
        quizResults.style.display = 'block';
        scoreSpan.textContent = score;
        totalSpan.textContent = quizData.length;
    }

    retryBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        quizContent.style.display = 'block';
        quizResults.style.display = 'none';
        loadQuestion();
    });

    loadQuestion(); // Start the quiz

    // --- GUESS THE MEMORY GAME ---
    const memoryForm = document.getElementById('memory-form');
    const memoryPhoto = document.getElementById('memory-photo');
    const memoryGuessInput = document.getElementById('memory-guess');
    const memoryFeedback = document.getElementById('memory-feedback');
    
    // CUSTOMIZE MEMORY ANSWER HERE
    const memoryAnswer = "ski trip 2018";

    memoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userGuess = memoryGuessInput.value.trim().toLowerCase();
        
        if (userGuess === memoryAnswer) {
            memoryPhoto.classList.add('revealed');
            memoryFeedback.textContent = "You got it! What a day that was!";
            memoryFeedback.style.color = '#2ecc71';
        } else {
            memoryFeedback.textContent = "Not quite! Try another guess.";
            memoryFeedback.style.color = '#e74c3c';
            memoryGuessInput.value = '';
        }
    });
});
                                    
