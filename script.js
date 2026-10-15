const webQuestions = [
    {
        text: "HTML ka full form kya hai?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Multi Language",
            "Home Text Markup Language"
        ],
        correctAnswer: "Hyper Text Markup Language"
    },
    {
        text: "CSS ka use kis liye hota hai?",
        options: [
            "Database banane ke liye",
            "Webpage ko style karne ke liye",
            "Server chalane ke liye",
            "Files delete karne ke liye"
        ],
        cconstorrectAnswer: "Webpage ko style karne ke liye"
    },
    {
        text: "JavaScript ka main use kya hai?",
        options: [
            "Webpage ko interactive banana",
            "Sirf images store karna",
            "Sirf text likhna",
            "Computer ko band karna"
        ],
        correctAnswer: "Webpage ko interactive banana"
    }
];

const aiQuestions = [
    {
        text: "AI ka full form kya hai?",
        options: [
            "Artificial Intelligence",
            "Automatic Internet",
            "Advanced Information",
            "Applied Interface"
        ],
        correctAnswer: "Artificial Intelligence"
    },
    {
        text: "Machine Learning kya hai?",
        options: [
            "Computer hardware",
            "AI ka ek subset",
            "Web browser",
            "Programming language"
        ],
        correctAnswer: "AI ka ek subset"
    }
];

const gkQuestions = [
    {
        text: "India ki capital kya hai?",
        options: ["Mumbai", "New Delhi", "Lucknow", "Jaipur"],
        correctAnswer: "New Delhi"
    },
    {
        text: "India ka national animal kaun hai?",
        options: ["Lion", "Elephant", "Tiger", "Leopard"],
        correctAnswer: "Tiger"
    }
];

const csQuestions = [
    {
        text: "CPU ka full form kya hai?",
        options: [
            "Central Processing Unit",
            "Computer Personal Unit",
            "Central Program Utility",
            "Control Processing User"
        ],
        correctAnswer: "Central Processing Unit"
    },
    {
        text: "Computer ka brain kise kaha jata hai?",
        options: ["Monitor", "Keyboard", "CPU", "Mouse"],
        correctAnswer: "CPU"
    }
];

let questions = webQuestions;

let selectedCategory = "Web"

let currentQuestionIndex = 0;
let selectedAnswer = null;
let userAnswers = [];
let timeLeft = 300;
let timerInterval = null;

const questionText = document.getElementById("questionText");
const questionCounter = document.getElementById("questionCounter");
const optionsContainer = document.getElementById("optionsContainer");
const nextButton = document.getElementById("nextButton");

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    questionText.textContent = currentQuestion.text;
    questionCounter.textContent =
        "Question " + (currentQuestionIndex + 1) +
        " of " + questions.length;

    optionsContainer.innerHTML = "";
    selectedAnswer = null;
    nextButton.disabled = true;
    nextButton.textContent = "Next Question";

    currentQuestion.options.forEach(function (option) {
        const optionButton = document.createElement("button");

        optionButton.textContent = option;
        optionButton.classList.add("option-btn");

        optionButton.addEventListener("click", function () {
            const allButtons =
                document.querySelectorAll(".option-btn");

            allButtons.forEach(function (button) {
                button.classList.remove("selected");
            });

            optionButton.classList.add("selected");
            selectedAnswer = option;
            nextButton.disabled = false;
        });

        optionsContainer.appendChild(optionButton);
    });
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    document.getElementById("timer").textContent =
        formattedMinutes + ":" + formattedSeconds;
}

function startTimer() {
    clearInterval(timerInterval);

    updateTimerDisplay();

    timerInterval = setInterval(function () {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            userAnswers[currentQuestionIndex] = selectedAnswer;
            finishQuiz();
        }
    }, 1000);
}

function finishQuiz() {
    clearInterval(timerInterval);

    let score = 0;

    questions.forEach(function (question, index) {
        if (userAnswers[index] === question.correctAnswer) {
            score++;
        }
    });

    const percentage = Math.round(
        (score / questions.length) * 100
    );

    document.getElementById("finalScore").textContent =
        "Your Score: " + score + " / " + questions.length;

    document.getElementById("finalPercentage").textContent =
        "Percentage: " + percentage + "%";

    if (percentage >= 80) {
        document.getElementById("resultMessage").textContent =
            "Excellent work!";
    } else if (percentage >= 50) {
        document.getElementById("resultMessage").textContent =
            "Good effort! Keep practising.";
    } else {
        document.getElementById("resultMessage").textContent =
            "Keep learning and try again!";
    }

    const attempt = {
        score: score,
        total: questions.length,
        percentage: percentage,
        date: new Date().toLocaleString()
    };

    let history = JSON.parse(
        localStorage.getItem("quizHistory")
    ) || [];

    history.push(attempt);

    localStorage.setItem(
        "quizHistory",
        JSON.stringify(history)
    );

    questionText.textContent = "Quiz Completed!";
    questionCounter.textContent =
        "Your Score: " + score + " / " + questions.length;

    optionsContainer.innerHTML = "";

    questions.forEach(function (question, index) {
        const reviewItem = document.createElement("div");
        const selected = userAnswers[index];

        if (selected === question.correctAnswer) {
            reviewItem.textContent =
                "Question " + (index + 1) +
                ": Correct! Your answer: " + selected;
        } else {
            reviewItem.textContent =
                "Question " + (index + 1) +
                ": Incorrect. Your answer: " +
                (selected || "Not answered") +
                ". Correct answer: " +
                question.correctAnswer;
        }

        optionsContainer.appendChild(reviewItem);
    });

    nextButton.textContent = "Quiz Completed";
    nextButton.disabled = true;

    document.getElementById("quizSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";

    displayHistory();
}

function displayHistory() {
    const historyList = document.getElementById("historyList");

    let history = JSON.parse(
        localStorage.getItem("quizHistory")
    ) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.textContent = "No quiz attempts yet.";
        return;
    }

    history.slice().reverse().forEach(function (attempt) {
        const historyItem = document.createElement("p");

        historyItem.textContent =
            "Score: " + attempt.score + " / " + attempt.total +
            " | Percentage: " + attempt.percentage + "%" +
            " | Date: " + attempt.date;

        historyList.appendChild(historyItem);
    });
}

nextButton.addEventListener("click", function () {
    userAnswers[currentQuestionIndex] = selectedAnswer;

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        finishQuiz();
    }
});


document.querySelectorAll(".start-category-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        const card = button.closest(".category-card");
        selectedCategory = card.dataset.category;

        if (selectedCategory === "web") {
            questions = webQuestions;
        } else if (selectedCategory === "ai") {
            questions = aiQuestions;
        } else if (selectedCategory === "gk") {
            questions = gkQuestions;
        } else if (selectedCategory === "cs") {
            questions = csQuestions;
        }

        document.getElementById("resultSection").style.display = "none";
        document.getElementById("quizSection").style.display = "block";

        currentQuestionIndex = 0;
        selectedAnswer = null;
        userAnswers = [];
        timeLeft = 300;

        clearInterval(timerInterval);

        nextButton.textContent = "Next Question";
        nextButton.disabled = true;

        displayQuestion();
        startTimer();

        document.getElementById("quizSection").scrollIntoView({
            behavior: "smooth"
        });
    });
});

