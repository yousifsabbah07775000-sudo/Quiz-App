// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit");
let bullets = document.querySelector(".bullets");
let bulletsSpans = document.querySelector(".bullets .spans");
let countDownElement = document.querySelector(".bullets .count-down");
let results = document.querySelector(".results");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
const QUESTION_TIME = 20;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      createBullets(qCount);
      addQuestionsData(questionsObject[currentIndex], qCount);
      countDown(QUESTION_TIME, qCount);

      submit.onclick = () => {
        clearInterval(countDownInterval);

        let rightAnswer = questionsObject[currentIndex].right_answer;
        checkAnswer(rightAnswer);
        currentIndex++;

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        if (currentIndex < qCount) {
          addQuestionsData(questionsObject[currentIndex], qCount);
          handleBullets();
          countDown(QUESTION_TIME, qCount);
        } else {
          ShowResults(qCount);
        }
      };
    }
  };
  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(qCount) {
  countSpan.innerHTML = qCount;
  for (let i = 0; i < qCount; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.className = "on";
    }
    bulletsSpans.appendChild(bullet);
  }
}

function addQuestionsData(obj, qCount) {
  if (currentIndex < qCount) {
    let questionTitle = document.createElement("h2");
    questionTitle.appendChild(document.createTextNode(obj["title"]));
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");

      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.name = "question";
      radioInput.dataset.answer = obj[`answer_${i}`];

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.appendChild(document.createTextNode(obj[`answer_${i}`]));

      answerDiv.appendChild(radioInput);
      answerDiv.appendChild(label);

      answersArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rightAnswer) {
  let chosen = document.querySelector('input[name="question"]:checked');
  let myAnswer = chosen ? chosen.dataset.answer : null;

  console.log("correct:", rightAnswer, "| mine:", myAnswer);

  if (myAnswer !== null && myAnswer.trim() === rightAnswer.trim()) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].className = i === currentIndex ? "on" : "";
  }
}

function ShowResults(qCount) {
  let theResult;
  if (currentIndex === qCount) {
    quizArea.remove();
    answersArea.remove();
    submit.remove();
    bullets.remove();

    if (rightAnswers === qCount)
      theResult = `<span class="perfect">Perfect</span> All Answers Is True`;
    else if (rightAnswers > qCount / 2 && rightAnswers < qCount)
      theResult = `<span class="good">Good</span> ${rightAnswers} From ${qCount}`;
    else
      theResult = `<span class="bad">Bad</span> ${rightAnswers} From ${qCount}`;
  }
  results.innerHTML = theResult;
}

function countDown(duration, qCount) {
  if (currentIndex < qCount) {
    clearInterval(countDownInterval);
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submit.click();
      }
    }, 1000);
  }
}
