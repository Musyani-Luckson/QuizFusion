import { hp } from "../helper/lib.js";
import { container } from "./htmlElements.js";
import { Stack } from "./DS.js";

export class Quiz {
  constructor(data) {
    this.session = {};
    this.recentDefaulty = {
      size: 10,
      name: "general knowledge",
      difficulty: this.returnDifficulty(),
    };
    this.bonusTime = 0;
    this.whenToBonus = 100;
    this.initialTimeCount = 0;
    this.rowCount = 0;
    this.records = {
      values: [],
      maxHit: 0,
      maxMiss: 0,
      maxOfNoResponse: 0,
      maxPoints: 0,
      rank: 0,
    };
    this.runtimeData = {
      hit: 0,
      miss: 0,
      noResponse: 0,
      yesResponse: 0,
      currentIndex: 0,
      interval: 0,
      rowCount: 0,
      initialTimeCount: 0,
      isCorrect: false,
      response: false,
      isToQuiz: false,
    };
    this.myQuiz = {
      categories: data,
      toQuiz: {},
      maxSize: 5,
      currNum: 0,
      soundEffect: true,
      categoryName: "all",
      item: {},
    };
    this.interval = hp.customInterval(() => {
      this.quizInterval();
    }, 1000);
    this.categoryIconDiv = hp.setDom("div", {
      class: `categoryIconDiv bi-patch-question`,
    });
    this.categoryTextDiv = hp.setDom("div", {
      class: "categoryTextDiv",
    });
    this.audio = hp.setDom("AUDIO", {
      id: "audio",
    });
    this.timeToAdd = 0;
    this.readingTime = 0;
  }
}

Quiz.prototype.addTimeToAQuestion = function () {
  const element = hp.getDom("#timerShow");
  element.addEventListener("click", () => {
    const user = this.getUserRecords();
    if (user.isUserRecorded && user.userRecords) {
      const userRecords = user.userRecords;
      const timeElement = hp.getDom("#storedTime");
      if (userRecords.records.time >= 5) {
        if (this.runtimeData.interval < this.readingTime - 5) {
          userRecords.records.time -= 5;
          this.timeToAdd = 5;
          let userRecordDB = hp.browserStorageUse(
            "get",
            "userRecords",
            localStorage
          );
          userRecordDB[0][userRecords.user.name] = userRecords;
          sortUsersByRank(userRecordDB[0]);
          this.updateUserRankAndPoints(container);
          sortUsersByRank(userRecordDB[0]);
          hp.browserStorageUse("delete", "userRecords", localStorage);
          hp.browserStorageUse(
            "post",
            "userRecords",
            localStorage,
            userRecordDB[0]
          );
        }
        this.updateUserRankAndPoints(container);
        hp.setInnerText(timeElement, userRecords.records.time);
      }
    }
  });
};

Quiz.prototype.quizInterval = function () {
  if (this.myQuiz.item !== undefined && this.myQuiz.item !== null) {
    this.readingTime = this.myQuiz.item.readingTime + this.bonusTime;
    this.runtimeData.interval = hp.minMax(
      0,
      this.readingTime,
      (this.runtimeData.interval -= 1)
    );

    this.timeToAdd = 0;
    hp.setInnerText(container.access(`timerShow`), this.runtimeData.interval);
    this.whenToBonus = returnPercentage(
      [this.readingTime],
      this.runtimeData.interval
    );

    if (this.runtimeData.interval === 0) {
      this.getQuestion(this.bonusTime);
    } else if (this.runtimeData.interval === 1) {
      const response = this.runtimeData.response;
      const isCorrect = this.runtimeData.isCorrect;
      this.soundEffects(isCorrect);
      if (response) {
        if (isCorrect) {
          this.runtimeData.hit += 1;
        } else {
          this.runtimeData.miss += 1;
        }
        this.runtimeData.yesResponse += 1;
      } else {
        this.runtimeData.miss += 1;
        this.runtimeData.noResponse += 1;
      }
      const runtimeDataScores = {
        hit: this.runtimeData.hit,
        miss: this.runtimeData.miss,
        noResponse: this.runtimeData.noResponse,
        yesResponse: this.runtimeData.yesResponse,
      };
      this.quizScores(response, isCorrect);
      hp.setInnerText(container.access(`hit`), `HIT ${runtimeDataScores.hit}`);
      hp.setInnerText(
        container.access(`miss`),
        `MISS ${runtimeDataScores.miss}`
      );
      this.updateUserRankAndPoints(container);
    } else if (this.runtimeData.interval > 1) {
    }
  }
};

Quiz.prototype.getQuestion = function () {
  this.myQuiz.item = {};
  this.bonusTime = 0;
  this.bonusNumber = 0;
  this.myQuiz.item = this.myQuiz.category.pop();
  if (this.myQuiz.item && this.myQuiz.item.answers) {
    this.myQuiz.item.answers = hp.shuffle(this.myQuiz.item.answers);
  }
  if (this.myQuiz.item !== undefined && this.myQuiz.item !== null) {
    this.renderQuiz();
  } else {
    hp.getDom("#startStopBtn").value = hp.switchItems(
      hp.getDom("#startStopBtn").value,
      {
        0: "stop",
        1: "start",
      }
    );
    this.stopQuiz();
  }
};

Quiz.prototype.handleAnswers = function (elements) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(`click`, () => {
      if (
        this.myQuiz.item.answers !== undefined &&
        this.myQuiz.item.answers !== null
      ) {
        let answers = this.myQuiz.item.answers;
        this.runtimeData.isCorrect = answers[i].isCorrect;
        let isCorrect = this.runtimeData.isCorrect;
        this.bonusNumber = this.whenToBonus;
        this.indicator(elements[i], this.runtimeData.isCorrect);

        switch (this.runtimeData.isCorrect) {
          case false:
            for (let j = 0; j < elements.length; j++) {
              isCorrect = this.myQuiz.item.answers[j].isCorrect;
              switch (isCorrect) {
                case true:
                  this.indicator(elements[j], isCorrect);
                  break;
              }
            }
            break;
        }
        this.deactivateAnswers(elements, true);
        this.runtimeData.interval = 2;
        this.runtimeData.response = true;
      }
    });
  }
};

Quiz.prototype.deactivateAnswers = function (elements, key) {
  for (let j = 0; j < elements.length; j++) {
    elements[j].disabled = key;
  }
};

Quiz.prototype.renderQuiz = function () {
  let answersBox = container.access(`answersBox`);
  answersBox.innerHTML = ``;
  let answers = container.access(`answers`);
  if (answers !== undefined && answers !== null) {
    this.myQuiz.currNum += 1;
    hp.setInnerText(hp.getDom("#questionId"), this.myQuiz.item.question);
    hp.setInnerText(
      container.access(`maxOfX`),
      `Question ${this.myQuiz.currNum} of ${this.recentDefaulty.size}`
    );
    for (let i = 0; i < this.myQuiz.item.answers.length; i++) {
      let eachAnswerBtn = hp.setDom("button", {
        class: `answers m-3`,
      });
      hp.setInnerText(eachAnswerBtn, this.myQuiz.item.answers[i].answer);
      answersBox.appendChild(eachAnswerBtn);
    }
    this.handleAnswers(answersBox.children);
    this.runtimeData.response = false;
    this.runtimeData.isCorrect = false;
  }
};

Quiz.prototype.startQuiz = function () {
  this.stopQuiz();
  this.interval.start();
  this.getQuestion();
};

Quiz.prototype.stopQuiz = function () {
  this.interval.clear();
  this.resetQuiz();
};

Quiz.prototype.resetQuiz = function () {
  this.runtimeData = {
    hit: 0,
    miss: 0,
    noResponse: 0,
    yesResponse: 0,
    currentIndex: 0,
    interval: 0,
    isCorrect: false,
    response: false,
    isToQuiz: false,
  };
  this.myQuiz.currNum = 0;
};

Quiz.prototype.renderCategories = function (receiver) {
  const keys = Object.keys(this.myQuiz.categories);
  let category;
  for (let key of keys) {
    category = hp.setDom("button", {
      class: `category`,
      value: key,
      "data-bs-toggle": "modal",
      "data-bs-target": "#myModal",
    });
    category.appendChild(this.categoryIconDiv.cloneNode(" "));
    category.appendChild(this.categoryTextDiv.cloneNode());
    hp.setInnerText(category.lastChild, key);
    receiver.appendChild(category);
    this.handleCategory(category, key);
  }

  this.handleRange(
    container.access("rangeBtn"),
    container.access("range"),
    container.access("maxShow"),
    container.access("playQuiz")
  );
};

Quiz.prototype.handleCategory = function (category, key) {
  if (hp.safeExistElement(category)) {
    category.addEventListener("click", () => {
      if (category.value === key) {
        let rangeBtn = hp.safeExistElement(container.access("rangeBtn"));
        let range = hp.safeExistElement(container.access("range"));
        let sub = this.myQuiz.categories[key][this.recentDefaulty.difficulty];
        range.value = 10;
        range.min = 10;
        range.max = sub.length;
        hp.setInnerText(hp.safeExistElement(rangeBtn[0]), 10);
        hp.setInnerText(hp.safeExistElement(rangeBtn[1]), range.max);
        hp.setInnerText(
          hp.safeExistElement(container.access("maxShow")),
          range.value
        );
        hp.setInnerText(
          hp.safeExistElement(container.access("modalName")),
          key
        );
        this.myQuiz.categoryName = key;
      }
    });
  }
};

Quiz.prototype.handleRange = function (rangeBtns, range, maxShow, playQuiz) {
  for (let i = 0; i < rangeBtns.length; i++) {
    hp.safeExistElement(rangeBtns[i]).addEventListener("click", () => {
      let number = parseInt(range.value);
      let value = rangeBtns[i].value;
      if (value === "prev") {
        range.value = hp.minMax(10, range.max, (number -= 1));
      } else if (value === "next") {
        range.value = hp.minMax(10, range.max, (number += 1));
      }
    });
  }

  range.addEventListener("input", () => {
    hp.setInnerText(hp.safeExistElement(maxShow), range.value);
  });

  playQuiz.addEventListener("click", () => {
    let stack = new Stack();
    this.runtimeData.isToQuiz = true;
    let user = this.getUserRecords();
    hp.setInnerText(
      container.access(`maxOfX`),
      `${this.myQuiz.currNum} of ${range.value}`
    );
    this.recentDefaulty = {
      size: range.value,
      name: this.myQuiz.categoryName,
      difficulty: this.returnDifficulty(),
    };
  });

  range.addEventListener("input", () => {
    hp.setInnerText(maxShow, range.value);
  });

  rangeBtns.forEach((btn) => {
    hp.safeExistElement(btn).addEventListener("click", () => {
      hp.setInnerText(
        hp.safeExistElement(maxShow),
        hp.safeExistElement(range).value
      );
    });
  });
};

Quiz.prototype.returnDifficulty = function () {
  let difficulty;
  let user = this.getUserRecords();
  if (!user.isUserRecorded) {
    difficulty = `easy`;
  } else {
    let userRecords = user.userRecords;
    difficulty = userRecords.position.difficulty;
  }
  return difficulty;
};

Quiz.prototype.indicator = function (element, value = undefined) {
  let color = "";
  switch (value) {
    case true:
    case "true":
    case "start":
      color = `rgba(152, 251, 152, .4)`;
      break;
    case false:
    case "false":
    case "stop":
      color = `rgba(220, 20, 60, .7)`;
      break;
    default:
      color = `transparent`;
      break;
  }
  hp.cssRules(element, {
    background: color,
  });
};

Quiz.prototype.deleteAccount = function () {
  const deleteAccount = hp.getDom("#deleteAccount");
  deleteAccount.addEventListener(`click`, () => {
    const records = this.getUserRecords();
    if (records.isUserRecorded && records.userRecords) {
      const userRecords = records.userRecords;
      const name = userRecords.user.name;
      const id = userRecords.user.id;
      const userRecordDB = hp.browserStorageUse(
        "get",
        "userRecords",
        localStorage
      )[0];
      const usersDB = hp.browserStorageUse("get", "USERS", localStorage);
      if (confirm("OK to delete you account")) {
        let users = {};
        usersDB.map((user) => {
          users[user.username] = user;
        });
        delete users[name];
        delete userRecordDB[name];
        const newArr = [];
        for (let name in users) {
          newArr.push(users[name]);
        }
        users = newArr;
        hp.browserStorageUse("delete", "userRecords", localStorage);
        hp.browserStorageUse("delete", "USERS", localStorage);
        hp.browserStorageUse("post", "userRecords", localStorage, userRecordDB);
        hp.browserStorageUse("post", "USERS", localStorage, users);
        hp.browserStorageUse("delete", "QF_Logger", sessionStorage);
        window.location.href = "../forms/login.html";
      }
    }
  });
};

Quiz.prototype.logOut = function () {
  const logoutEle = hp.getDom("#logoutEle");
  logoutEle.addEventListener(`click`, () => {
    const records = this.getUserRecords();
    if (records.isUserRecorded && records.userRecords) {
      hp.browserStorageUse("delete", "QF_Logger", sessionStorage);
      window.location.href = "../forms/login.html";
    }
  });
};

Quiz.prototype.profileRates = function (profile) {
  let receiver = hp.getDom("#chartBody");
  let profileName = hp.getDom("#profileName");
  receiver.innerHTML = "";
  hp.setInnerText(profileName, profile.user.name);
  let successRate = {
    HIT: {
      label: "HIT",
      percentage: profile.records.maxHit,
      color: "palegreen",
    },
    MISS: {
      label: "MISS",
      percentage: profile.records.maxMiss,
      color: "crimson",
    },
  };
  ratioChartFunc(receiver, "Success Rate", "successRate");
  hp.chartJS("successRate", "doughnut", successRate);
  let responseRate = {
    right: {
      label: "Correct response!",
      percentage: profile.records.maxHit,
      color: "palegreen",
    },
    wrong: {
      label: "Incorrect response!",
      percentage: profile.records.maxMiss - profile.records.maxNoResponse,
      color: "crimson",
    },
    no: {
      label: "No response!",
      percentage: profile.records.maxNoResponse,
      color: "gray",
    },
  };
  ratioChartFunc(receiver, "Response Rate", "responseRate");
  hp.chartJS("responseRate", "doughnut", responseRate);
};

Quiz.prototype.handleLeader = function (element, leader) {
  element.addEventListener(`click`, () => {
    this.profileRates(leader);
  });
};

Quiz.prototype.renderLeadersBoard = function (leaders) {
  const you = this.session;
  const leaderboardContainer = container.access("leadersboardBody");
  leaderboardContainer.innerHTML = "";
  const leaderboardList = hp.setDom("ul", { class: "list-group" });
  const leaderboardItems = leaders.map((leader) => {
    const listItem = hp.setDom("li", {
      class:
        "list-group-item d-flex justify-content-between align-items-center listItem border-0",
      "data-bs-toggle": `offcanvas`,
      "data-bs-target": `#profileCanvas`,
    });

    const listItemLeft = hp.setDom("div", { class: "btn-group liLeft" });
    const rankSpan = hp.setDom("span", {
      class: "badge text-dark",
    });
    leaderYou(rankSpan, listItem, leader, you);
    listItemLeft.appendChild(rankSpan);
    const userIcon = hp.setDom("i", {
      class: "bi-person-circle liLeftIcon text-dark",
    });
    listItemLeft.appendChild(userIcon);
    const userName = hp.setDom("div", { class: "userNameTxt" });
    hp.setInnerText(userName, leader.user.name);
    listItemLeft.appendChild(userName);
    listItem.appendChild(listItemLeft);
    const recPosSpan = hp.setDom("span", {
      class: "",
    });
    listItem.appendChild(recPosSpan);
    const starSpan = hp.setDom("span", {
      class: "badge bg-primaryn text-dark rounded-pill",
    });
    const starIcon = hp.setDom("i", { class: "bi-star-fill text-dark" });
    const starText = hp.setDom("span", {
      class: "",
    });
    hp.setInnerText(starText, ` ${leader.records.stars}  `);
    starSpan.appendChild(starIcon);
    starSpan.appendChild(starText);
    recPosSpan.appendChild(starSpan);
    const pointsSpan = hp.setDom("span", {
      class: "badge bg-primary rounded-pill",
    });
    hp.setInnerText(pointsSpan, ` ${leader.position.points} `);
    recPosSpan.appendChild(pointsSpan);
    this.handleLeader(listItem, leader);
    return listItem;
  });
  leaderboardList.append(...leaderboardItems);
  leaderboardContainer.appendChild(leaderboardList);
};

Quiz.prototype.soundEffectHandlee = function () {
  const soundEffect = hp.getDom("#soundEffect");
  let iconSound = "";
  soundEffect.addEventListener(`click`, () => {
    this.myQuiz.soundEffect = hp.switchItems(this.myQuiz.soundEffect, {
      0: true,
      1: false,
    });
    if (this.myQuiz.soundEffect) {
      iconSound = `bi-volume-up-fill`;
    } else {
      iconSound = `bi-volume-mute-fill`;
    }
    soundEffect.children[0].className = iconSound;
  });
};

Quiz.prototype.musicEffects = function (index, max = 6) {
  const music = hp.getDom("#musicEffects");
  const num = hp.minMax(1, max, (index += 1));
  const thisClass = this;
  const src = [`../musicEffects/${num}.mp3`];
  let stopPlaying = true;
  if (stopPlaying) {
    const audio = new Howl({
      src: src,
      autoplay: true,
      onend: function () {
        thisClass.musicEffects(num, max);
      },
    });
    music.addEventListener(`click`, () => {
      stopPlaying = hp.switchItems(stopPlaying, {
        0: true,
        1: false,
      });
      if (stopPlaying) {
        audio.volume(0.1);
        audio.fade(0, 1, 5000);
        setTimeout(function () {
          audio.play();
        }, 1000);
      } else {
        audio.fade(1, 0, 5000);
        setTimeout(function () {
          audio.stop();
        }, 4500);
      }
    });
    audio.volume(0.1);
    audio.fade(0, 1, 5000);
  }
};

Quiz.prototype.soundEffects = function (isCorrect) {
  if (this.myQuiz.soundEffect) {
    const src = [`../soundEffects/${isCorrect}.mp3`];
    const audio = new Howl({
      src: src,
      autoplay: true,
    });
  }
};

Quiz.prototype.getUserRecords = function () {
  const session = hp.browserStorageUse("get", "QF_Logger", sessionStorage);
  if (!session || !session[0] || !session[0].isLoggedIn) {
    return { isUserRecorded: false, userRecords: null };
  }
  const userRecordDB = hp.browserStorageUse(
    "get",
    "userRecords",
    localStorage
  )[0];
  sortUsersByRank(userRecordDB);
  if (!userRecordDB) {
    return { isUserRecorded: false, userRecords: null };
  }
  const sessionUsername = session[0].userName;
  const userRecords = userRecordDB[sessionUsername];
  this.session = {
    name: session[0].userName,
    id: session[0].userId,
  };
  this.renderLeadersBoard(sortUsersByRank(userRecordDB));
  return { isUserRecorded: true, userRecords: userRecords }; // return true if user is logged in and user record database is defined
};

Quiz.prototype.updateUserRankAndPoints = function (container) {
  const user = this.getUserRecords();
  if (user.isUserRecorded && user.userRecords !== null) {
    const userRecords = user.userRecords;
    const rankElement = container.access("rank");
    const pointsElement = container.access("points");
    const starsElement = hp.getDom("#stars");
    const timeElement = hp.getDom("#storedTime");
    const level = hp.getDom("#level");
    hp.setInnerText(rankElement, userRecords.position.rank);
    hp.setInnerText(pointsElement, userRecords.position.points);
    hp.setInnerText(starsElement, userRecords.records.stars);
    hp.setInnerText(timeElement, userRecords.records.time);
    hp.setInnerText(level, userRecords.position.level);
  }
};

Quiz.prototype.quizScores = function (response, isCorrect) {
  const user = this.getUserRecords();
  let numPoints = 5;
  if (response && isCorrect) {
    this.rowCount += 1;
    if (this.bonusNumber >= 75 && this.bonusNumber <= 100) {
      this.bonusTime = 5;
      numPoints += 2;
      this.initialTimeCount += 1;
    } else {
      this.bonusTime = 0;
      this.initialTimeCount = 0;
    }
  } else {
    this.bonusTime = 0;
    this.rowCount = 0;
    this.initialTimeCount = 0;
  }
  const itc = this.initialTimeCount;
  const rc = this.rowCount;
  if (user.isUserRecorded && user.userRecords !== null) {
    const userRecords = user.userRecords;
    const star = 1;
    const time = 10;
    if (response) {
      if (isCorrect) {
        userRecords.records.maxHit += 1;
        userRecords.position.points += numPoints;
        if (itc >= 2 && rc >= 2) {
          userRecords.records.stars += star;
          userRecords.records.time += time;
          this.rowCount = 0;
          this.initialTimeCount = 0;
        } else if (rc === 8) {
          userRecords.records.stars += star;
          userRecords.records.time += time;
          this.rowCount = 0;
          this.initialTimeCount = 0;
        }
      } else {
        userRecords.records.maxMiss += 1;
        userRecords.position.points -= 2;
      }
      userRecords.records.maxResponse += 1;
    } else {
      userRecords.records.maxMiss += 1;
      userRecords.records.maxNoResponse += 1;
      userRecords.position.points -= 3;
    }
    this.records.maxPoints = userRecords.position.points;
    this.records.rank = userRecords.position.rank;
    let userRecordDB = hp.browserStorageUse("get", "userRecords", localStorage);
    userRecordDB[0][userRecords.user.name] = userRecords;
    sortUsersByRank(userRecordDB[0]);
    this.updateUserRankAndPoints(container);
    sortUsersByRank(userRecordDB[0]);
    hp.browserStorageUse("delete", "userRecords", localStorage);
    hp.browserStorageUse("post", "userRecords", localStorage, userRecordDB[0]);
  }
};

function sortUsersByRank(usersObj) {
  const sortedUsers = Object.values(usersObj).sort(
    (a, b) => b.position.points - a.position.points
  );
  sortedUsers.forEach((user, index) => {
    user.position.rank = index + 1;
    let level = calculateUserLevel(user.position.points);
    user.position.level = level.level;
    user.position.difficulty = level.difficulty;
  });
  return sortedUsers;
}

function calculateUserLevel(userPoints) {
  const levelTable = [
    {
      minPoints: -Infinity,
      maxPoints: 299,
      level: 0,
      difficulty: "easy",
    },
    {
      minPoints: 300,
      maxPoints: 699,
      level: 1,
      difficulty: "easy",
    },
    {
      minPoints: 700,
      maxPoints: 1299,
      level: 2,
      difficulty: "medium",
    },
    {
      minPoints: 1300,
      maxPoints: 1999,
      level: 3,
      difficulty: "medium",
    },
    {
      minPoints: 2000,
      maxPoints: 2899,
      level: 4,
      difficulty: "medium",
    },
    {
      minPoints: 2900,
      maxPoints: 3899,
      level: 5,
      difficulty: "hard",
    },
    {
      minPoints: 3900,
      maxPoints: Infinity,
      level: 6,
      difficulty: "hard",
    },
  ];
  const userLevel = levelTable.find((level) => {
    if (
      userPoints < 0 &&
      level.minPoints === -Infinity &&
      level.maxPoints === -1
    ) {
      return true;
    }
    return userPoints >= level.minPoints && userPoints <= level.maxPoints;
  });
  return userLevel ? userLevel : { level: 1, difficulty: "easy" };
}

function returnPercentage(arr, percentageOf) {
  let sum = 0;
  for (let i of arr) {
    sum += i;
  }
  return Math.round((percentageOf * 100) / sum);
}

function ratioChartFunc(receiver, chartName, id) {
  const ratioChart = hp.setDom("div", {
    class: `card p-2 ratioChart m-2 border-1 text-dark`,
  });
  const p = hp.setDom("p", {});
  hp.setInnerText(p, chartName);
  const canvas = hp.setDom("canvas", {
    id: `${id}`,
  });
  ratioChart.appendChild(p);
  ratioChart.appendChild(canvas);
  receiver.appendChild(ratioChart);
}

function leaderYou(element, listItem, leader, you) {
  if (leader.user.name === you.name && leader.user.id === you.id) {
    let string = `list-group-item d-flex justify-content-between align-items-center listItem border-0 active rounded text-light`;
    listItem.className = string;
    hp.setInnerText(element, `You`);
  } else {
    hp.setInnerText(element, leader.position.rank);
  }
}
