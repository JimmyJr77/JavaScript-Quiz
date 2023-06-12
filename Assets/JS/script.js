// Get section elements
var questionsEl = document.getElementById("questions");
var startEl = document.getElementById("start-challenge");
var doneEl = document.getElementById("all-done");
var highscoresEl = document.getElementById("highscores");

// Get child elements
var responseLiSpanEl = document.getElementById("questions").querySelectorAll("li span");
var countdownSpanEl = document.getElementById("timer").querySelector("span");
var startBtnEl = document.getElementById("start-challenge").querySelector("button");
var questionH2El = document.getElementById("questions").querySelector("h2");
var instaGradeEl = document.getElementById("instant-grading");
var scoreSpanEl = document.getElementById("final-score").querySelector("span");
var viewHighscoresEl = document.getElementById("view-highscores");
var highScoresLiEl = document.getElementById("highscores").querySelector("li");
var goBackEl = document.getElementById("go-back");
var clearEl = document.getElementById("clear");
var saveScoreEl = document.getElementById("all-done").querySelector("button");
var highscoresListEl = document.getElementById("highscores").querySelector("ul");
var playAgainEl = document.getElementById("play-again")


// Variables
var countdownTime;
var timerInterval;
var currentQuestionIndex;
var selectedAnswers;
var score;
var highscores;
var sectionDisplayStates;

// Initialize variables
score = 0; // Record the score
currentQuestionIndex = 0; // Record which question is being cybcled through
selectedAnswers = []; // Record user answers
highscores = []; // Record high scores
sectionDisplayStates = {}; // Record the section display types

// Default countdown display
countdownSpanEl.textContent = "Ready!";

// Start the quiz and timer
startBtnEl.addEventListener("click", startGame);

// Function to start and play the game
function startGame() {
    // Set the countdown time in seconds
    countdownTime = 60;

    // Update the countdown immediately. There is a delay without this.
    gameStatus();

    // Update the countdown every second
    timerInterval = setInterval(gameStatus, 1000);

    // Function to update the countdown and end game at zero seconds or when all questions are completed.
    function gameStatus() {
        // Check if the countdown has reached zero or if all questions have been answered
        if (countdownTime <= 0 || currentQuestionIndex >= jsquestions.length) {
            clearInterval(timerInterval); // Stop the timer
            countdownSpanEl.textContent = "Time's up!";
            handleQuizCompletion(); // Call the function to handle quiz completion
            return;
        }

        // Display the countdown
        countdownSpanEl.textContent = countdownTime;

        // Decrease the countdown time by 1 second
        countdownTime--;
    }

    // Change screen display from start to questions
    startEl.style.display = "none";
    questionsEl.style.display = "flex";

    // Function to display the current question
    function displayQuestion() {
        var question = jsquestions[currentQuestionIndex];

        questionH2El.textContent = question.jsquestion;

        // Display the jsqResponses
        for (var i = 0; i < responseLiSpanEl.length; i++) {
            responseLiSpanEl[i].textContent = question.jsqResponses[i];
        }
    }

    // Function to handle user's response
    function handleResponse(event) {
        var selectedResponse = event.target.textContent;
        console.log("Selected Response:", selectedResponse);

        // Store the selected answer
        selectedAnswers[currentQuestionIndex] = selectedResponse;

        // Check if the response is correct
        var question = jsquestions[currentQuestionIndex];
        var correctResponse = question.jsqResponses[question.answer];
        var isCorrect = selectedResponse === correctResponse;
        console.log("Is Correct:", isCorrect);

        //Give instant grade response and score answers
        if (isCorrect) {
            instaGradeEl.textContent = "I think you cheated!";
            score++
            } else {
            instaGradeEl.textContent = "Not even close!";
            countdownTime -=10;
            }

        // Move to the next question
        currentQuestionIndex++;

        // Check if all questions have been answered or time expires
        if (currentQuestionIndex >= jsquestions.length || countdownTime == 0) {
        handleQuizCompletion(); // Call the function to handle quiz completion
        return;
        }

        // Display the next question
        displayQuestion();
    }

    // Add click event listeners to the response options
    for (var i = 0; i < responseLiSpanEl.length; i++) {
        responseLiSpanEl[i].addEventListener("click", handleResponse);
    }

    // Display the first question
    displayQuestion();
}

// Function to end the game
function handleQuizCompletion() {
    // Change section view from "Question" to "Done"
    questionsEl.style.display = "none";
    doneEl.style.display = "flex";
    
    //Show user the final score
    scoreSpanEl.textContent = score;
    
    //Save the score in the console log
    console.log("Player Initials:", "UNK")
    console.log("Total Score:", score);

}

// View Highscores
viewHighscoresEl.addEventListener("click", viewHighscores)

function viewHighscores() {
    // Record current page
    sectionDisplayStates.questionsEl = questionsEl.style.display;
    sectionDisplayStates.startEl = startEl.style.display;
    sectionDisplayStates.doneEl = doneEl.style.display;
    
    questionsEl.style.display = "none";
    startEl.style.display = "none";
    doneEl.style.display = "none";
    highscoresEl.style.display = "flex";

    // Load highscores on page load
    updateHighscores();

};

// Retrieve and update score list from local storage
// Retrieve all initials and scores from local storage
function retrieveScores() {
    var scores = [];
    for (var i = 0; i < localStorage.length; i++) {
    var initials = localStorage.key(i);
    var score = localStorage.getItem(initials);
    scores.push({ initials: initials, score: score });
    }
    return scores;
}

// Update highscores list with retrieved scores
function updateHighscores() {
    highscoresListEl.innerHTML = ""; // Clears the existing list (clears the list items)

    // Retrieve scores
    var scores = retrieveScores();

    // Sort scores by highest score first. *** Review this function for clarity. ***
    scores.sort(function(a, b) {
        return b.score - a.score;
    });

    // Create and append list items for each score
    scores.forEach(function(scoreObj) {
        var listItem = document.createElement("li");
        listItem.textContent = scoreObj.initials + ": " + scoreObj.score;
        highscoresListEl.appendChild(listItem);
    });
}

 // Go back to previous section from "View Highscores"
 goBackEl.addEventListener("click", function() {
    if (sectionDisplayStates.questionsEl === "flex") {
        questionsEl.style.display = "flex";
        startEl.style.display = "none";
        doneEl.style.display = "none";
        highscoresEl.style.display = "none";
    } else if (sectionDisplayStates.doneEl === "flex") {
        questionsEl.style.display = "none"
        startEl.style.display = "none";
        doneEl.style.display = "flex";
        highscoresEl.style.display = "none";
    } else {
        questionsEl.style.display = "none"
        startEl.style.display = "flex";
        doneEl.style.display = "none";
        highscoresEl.style.display = "none";
    }
});

// Clear Highscores button
clearEl.addEventListener("click", function() {
    // Clear all scores from local storage
    localStorage.clear();
    
    // Clear highscores list
    highscoresListEl.innerHTML = "";
});

// Activate save score button functionality

// Activate save score button functionality
saveScoreEl.addEventListener("click", saveScore);

// Log scores function
function saveScore(event) {
    event.preventDefault();

    var initialsInput = document.getElementById("initials");
    var initials = initialsInput.value.trim();

    // Validate initials input
    if (initials === "") {
        initials = "UNK";
    }

    // Save initials and score to local storage
    localStorage.setItem(initials, score);

    viewHighscores();

}

// Restart Game
playAgainEl.addEventListener("click", playAgain)

function playAgain() {
    location.reload();
}


// I tried using the below code to reset the timer and variables, but the timer kept getting messed up. I'm not sure why.
    // // Reseting all score and question/answer variables
    // countdownTime = 60;
    // score = 0; 
    // currentQuestionIndex = 0;
    // selectedAnswers = []; 

    // // Reset timer interval and update countdown immediately
    // clearInterval(timerInterval);
    // countdownSpanEl.textContent = countdownTime;

    // // Go back to start screen
    // questionsEl.style.display = "none";
    // startEl.style.display = "flex";
    // doneEl.style.display = "none";
    // highscoresEl.style.display = "none";