import { hp } from "../helper/lib.js";
import { container } from "./htmlElements.js";
import { Quiz } from "./quiz.js";
import { Stack } from "./DS.js";

const essentials = [
  `🎮 How to Play:
    1. Click the 'Start' button to begin.
    2. Read each question carefully and select your answer.
    3. The game ends when all questions have been answered, or the 'Stop' button is clicked.`,

  `📜 Rules:
    1. Each question has a ⏲️ countdown timer. Answer before the timer runs out to score points and progress.
    2. 🤫 Silence is not allowed. Failure to respond to a question results in a 3-point penalty.
    3. ✅ Correctly answering a question grants a 5-point benefit.
    4. ❌ Answering a question incorrectly incurs a 2-point penalty.
    5. ⏰ Correctly answering a question within the initial 25% of the allotted time grants a 5-second bonus for the next question and 2 points.
    6. ⭐ Correctly answering two questions within each initial 25% of the allotted time grants a 1-star reward and a 10-second reward.
    7. 🔥 Also, correctly answering eight consecutive questions or eight questions without any wrong answers grants a 1-star reward and a 10-second reward.`,

  `🎖️ Indicators:
    🏆 The Trophy shows your current rank.
    🐽 The Piggy Bank is a bank of points that you earn or owe.
    🌟 The Star indicates the number of stars you have earned.
    ⏳ The Hourglass shows how much time you have been rewarded and is available for use.
    📊 The Chart shows your current level.`,

  `🎓 Levels:
    - There are multiple levels in the game, each with a different number of questions and difficulty.
    - Players must achieve a certain score to unlock the next level.
    - Higher levels have tougher questions and greater rewards.`,
];

renderEssentials(essentials, hp.getDom("#rulesDiv"));
autoDisplayInfo();

let myapi = `QuizFusion_Item.json`;

hp.getJSON(myapi).then((items) => {
  const stack = new Stack();

  for (let item of items) {
    const hasAnswers = item.answers;
    if (hasAnswers !== undefined) {
      stack.push(item);
    } else {
      stack.push(formatRequired(item));
    }
  }
  const toArray = stack.toArray();
  const quiz = new Quiz(categories(toArray, "category"));

  quiz.addTimeToAQuestion();
  quiz.renderCategories(container.access(`sectionCategoryDiv`));
  startTheClock(quiz);
  quiz.updateUserRankAndPoints(container);
  profileLiClick(quiz.session, quiz);
  quiz.logOut();
  quiz.deleteAccount();
  const max = 6;
  quiz.musicEffects(hp.shuffle(hp.pathNums(1, 1, max))[0], max);
});

function startTheClock(quiz) {
  const element = hp.getDom("#startStopBtn");
  element.addEventListener(`click`, () => {
    let recentDefaulty = quiz.recentDefaulty;
    switch (element.value) {
      case "start":
        const stack = new Stack();
        const category =
          quiz.myQuiz.categories[recentDefaulty.name][
          recentDefaulty.difficulty
          ];
        const items = hp.shuffle(category).slice(0, recentDefaulty.size);
        stack.push(...items);
        quiz.myQuiz.category = stack;
        quiz.startQuiz();
        element.className = `btn btn-outline-danger`;
        break;
      default:
        quiz.stopQuiz();
        element.className = `btn btn-outline-success`;
        break;
    }
    element.value = hp.switchItems(element.value, {
      0: "stop",
      1: "start",
    });
    hp.setInnerText(element, element.value);
    quiz.updateUserRankAndPoints(container);
  });
  quiz.soundEffectHandlee();
}

function profileLiClick(session, quiz) {
  let profileLi = hp.getDom("#profileLi");
  profileLi.addEventListener(`click`, () => {
    quiz.updateUserRankAndPoints(container);
    const records = quiz.getUserRecords();
    if (records.isUserRecorded && records.userRecords) {
      quiz.profileRates(records.userRecords);
    }
  });
}

function categories(questionsData, categoryName) {
  const pooOfQuestions = questions(questionsData);
  const categoryNames = namesOfCategories(pooOfQuestions, categoryName);
  const groupedQuestions = grouper(pooOfQuestions, categoryNames, categoryName);
  return groupedQuestions;
}

function extractQuestionAndAnswers(obj) {
  const question = obj.question;
  const answers = obj.answers.map((answer) => answer.answer);
  return `${question} ${answers.join(" ")}`;
}

function removeHtmlEntities(str) {
  return str.replace(/&[^\s]*;/g, " ");
}

function questions(data) {
  let questions = [];
  data.forEach((question) => {
    let text = extractQuestionAndAnswers(question);
    questions.push({
      readingTime: hp.calculateReadingTime(text, 90, true),
      question: question.question,
      category: question.category.toLowerCase().trim(),
      answers: question.answers,
      difficulty: question.difficulty,
      type: question.type,
    });
  });
  return questions;
}

function grouper(arr, names, type) {
  const grouped = {};
  for (const name of names) {
    grouped["all"] = {};
    grouped[name] = {};
    for (const difficulty of ["easy", "medium", "hard"]) {
      grouped[name][difficulty] = [];
      grouped["all"][difficulty] = [];
    }
  }
  for (const item of arr) {
    if (!(item[type] in grouped)) {
      throw new Error(`Invalid ${type}: ${item[type]}`);
    }
    const difficulty = item.difficulty.toLowerCase();
    if (!(difficulty in grouped[item[type]])) {
      throw new Error(`Invalid difficulty: ${item.difficulty}`);
    }
    grouped[item[type]][difficulty].push(item);
    grouped["all"][difficulty].push(item);
  }
  return grouped;
}

function namesOfCategories(arr, name) {
  const names = arr.map((item) => item[name].trim().toLowerCase());
  return hp.sortArr(names);
}

function formatRequired({
  question,
  correct_answer,
  incorrect_answers,
  category,
  difficulty,
  type,
}) {
  if (
    !question ||
    !correct_answer ||
    !incorrect_answers ||
    !category ||
    !difficulty ||
    !type
  ) {
    throw new Error("Invalid input object");
  }

  question = removeHtmlEntities(question);
  return {
    question,
    answers: [
      { answer: removeHtmlEntities(correct_answer), isCorrect: true },
      { answer: removeHtmlEntities(incorrect_answers[0]), isCorrect: false },
      { answer: removeHtmlEntities(incorrect_answers[1]), isCorrect: false },
      { answer: removeHtmlEntities(incorrect_answers[2]), isCorrect: false },
    ],
    type: removeHtmlEntities(type),
    difficulty: difficulty,
    category: removeHtmlEntities(category),
  };
}

function renderEssentials(rules, receiver) {
  const ol = document.createElement("ol");
  for (let i = 0; i < rules.length; i++) {
    const li = hp.setDom("li", {});
    li.innerText = rules[i];
    ol.appendChild(li);
  }
  receiver.appendChild(ol);
}

function autoDisplayInfo() {
  const rulesDiv = hp.getDom("#essentialsCanvas");
  const trigger = hp.getDom("#info");
  window.addEventListener("load", function () {
    const cookie = hp.browserStorageUse("get", "essentials", "cookie");

    if (cookie === null) {
      hp.browserStorageUse("post", "essentials", "cookie", {
        days: 30,
        value: { isActive: false },
      });
    } else {
      if (cookie.isActive === false) {
        trigger.click();
        hp.browserStorageUse("post", "essentials", "cookie", {
          days: 30,
          value: { isActive: true },
        });
      }
    }
  });
}