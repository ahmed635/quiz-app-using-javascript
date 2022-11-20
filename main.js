// select elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsContainer = document.querySelector(".spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
let theTimeForEachQuestion = 30;

// get the questions from json
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = 15;
            // let questionsCount = questionsObject.length;

            // shuffle the questions
            shuffleQuestions(questionsObject);

            createBullets(questionsCount);

            // add question data
            addQuestion(questionsObject[currentIndex], questionsCount);

            // start countdown timer
            timer(theTimeForEachQuestion, questionsCount);

            // click on submit button
            submitButton.onclick = () => {
                // get the right answer
                let theRightAnswer = questionsObject[currentIndex]["right_answer"];

                // increase the index to get the next question
                currentIndex++;

                // check the right answer
                checkAnswer(theRightAnswer, questionsCount);

                // remove the previous question
                answersArea.innerHTML = "";
                quizArea.innerHTML = "";

                // add question data
                addQuestion(questionsObject[currentIndex], questionsCount);

                // handel bullets class
                handleBullets();

                // first clear the countdown time
                clearInterval(countdownInterval);

                // start countdown timer
                timer(theTimeForEachQuestion, questionsCount);

                // showing the results
                showResults(questionsCount);

            }
        }
    }
    myRequest.open("GET", "data.json");
    myRequest.send();
}

// create bullets 
function createBullets(numberOfBullets) {
    // add questions numbers
    countSpan.innerHTML = numberOfBullets;
    // create bullets
    for (let i = 0; i < numberOfBullets; i++) {
        let bullet = document.createElement("span");
        if (i === 0) {
            bullet.className = "on";
        }
        bulletsContainer.appendChild(bullet);
    }
}

// add question function
function addQuestion(obj, count) {
    if (currentIndex < count) {
        // create question
        let questionTitle = document.createElement("h2");

        questionTitle.appendChild(document.createTextNode(obj["title"]));
        quizArea.appendChild(questionTitle);

        // shuffle the answers
        let allAnswers = [obj['answer_1'], obj['answer_2'], obj['answer_3'], obj['answer_4']];
        shuffleQuestions(allAnswers);

        // create answers 
        for (let i = 1; i <= 4; i++) {
            // create answer div
            let myAnswer = document.createElement("div")
            myAnswer.className = "answer";

            let myInput = document.createElement("input");
            
            // add type + name + id to myInput
            myInput.id = `answer_${i}`;
            myInput.name = "question";
            myInput.type = "radio";

            // add answers to myInput
            myInput.dataset.answer = allAnswers[i - 1];
            
            if (i === 1) {
                myInput.checked = true;
            }
            // create label
            let myLabel = document.createElement("label");

            // add for attribute
            // myLabel.setAttribute("for", `answer_${i}`);
            myLabel.htmlFor = `answer_${i}`;
            myLabel.appendChild(document.createTextNode(allAnswers[i - 1]));

            // append elements into myAnswer
            myAnswer.appendChild(myInput);
            myAnswer.appendChild(myLabel);

            // append myAsnwer into answersArea
            answersArea.appendChild(myAnswer);
        }
    }

}

// check the correct answer
function checkAnswer(rightAnswer, count) {
    // get all answers
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rightAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bullets = document.querySelectorAll(".spans span");
    let arrayOfSpans = Array.from(bullets);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

// show result of the test
function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > Math.floor(count / 2) && rightAnswers < count) {
            theResults = `<span class="good"> Good:</span> You have got ${rightAnswers} from ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect"> Perfect:</span> You have got ${rightAnswers} from ${count}`;
        } else {
            theResults = `<span class="bad"> Bad:</span> You have got ${rightAnswers} from ${count}`;
        }
        resultsContainer.innerHTML = theResults;

    }
}

// timer for the question
function timer(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `<span class="minutes"> ${minutes}</span>:<span class="seconds">${seconds} </span>`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
        
    }
}

// randomze questions and answers
function shuffleQuestions(questions) {
    for (let i = questions.length - 1; i > 0; i--) {
        // get random element from the array
        const j = Math.floor(Math.random() * (i + 1));

        // swap the random element with i
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

// trager the getQuestions frunction
getQuestions();