class Helper {
  constructor() {
    this.domEle = undefined;
  }
}
Helper.prototype.eventListener = function(target, event, fn, arrOfArg) {
  target.addEventListener(event, () => {
    return fn(...arrOfArg);
  });
};
Helper.prototype.holdEvent = function(target, fn, arrOfArg) {
  let timeOut;
  target.addEventListener(`touchstart`, () => {
    timeOut = setTimeout(timeOutFunc, 2000);

    function timeOutFunc() {
      return fn(...arrOfArg);
    }
    this.eventListener(target, `touchend`, clearTimeout, timeOut);
  });
};
Helper.prototype.print = function(value) {
  console.log(value);
  return value;
};

Helper.prototype.getProps = function(object, propType) {
  if (!Object.prototype.hasOwnProperty.call(Object, propType)) {
    const errorMessage = `${propType} is not a valid Object method name`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return Object[propType](object);
};
Helper.prototype.cssRules = function(element, rules) {
  if (!element || !rules) {
    throw new Error("Both 'element' and 'rules' arguments are required.");
  }
  if (!Array.isArray(element)) {
    setCss(this, element, rules);
  } else {
    element.forEach((el) => setCss(this, el, rules));
  }
};

function setCss(imit, element, rules) {
  Object.keys(rules).forEach((prop) => {
    if (typeof rules[prop] !== "string") {
      throw new Error(`Invalid value for property '${prop}'.`);
    }
    element.style[prop] = rules[prop];
  });
}

Helper.prototype.getDom = function(attrValue) {
  let attrType = attrValue.slice(0, 1);
  if (attrType === `.`) {
    this.domEle = document.querySelectorAll(attrValue);
  } else {
    this.domEle = document.querySelector(attrValue);
  }
  return this.domEle;
};
Helper.prototype.setDom = function(tagName, attrObject) {
  this.domEle = document.createElement(tagName);
  for (let key of this.getProps(attrObject, "keys")) {
    this.domEle.setAttribute(key, attrObject[key]);
  }
  return this.domEle;
};
Helper.prototype.shuffle = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
Helper.prototype.ifHas = function(arr, value) {
  let has = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == value) {
      has = true;
      break;
    }
  }
  return has;
};
Helper.prototype.getDomAttrValue = function(dom, attrName) {
  return dom[attrName];
};
Helper.prototype.setDomAttrValue = function(dom, attrName, value) {
  return (dom[attrName] = value);
};
Helper.prototype.setInnerText = function(dom, text) {
  dom.innerText = text;
};

Helper.prototype.switchItems = function(old, obj) {
  let keys = this.getProps(obj, "keys");
  if (old !== obj[keys[0]]) {
    old = obj[keys[0]];
  } else {
    old = obj[keys[1]];
  }
  return old;
};
Helper.prototype.isArr = function(arr, aSet) {
  for (const i in arr) {
    if (typeof arr[i] == "object") {
      this.notAnArray(arr[i], aSet);
    } else if (typeof arr[i] == "number") {
      aSet.add(arr[i]);
    }
  }
  return aSet;
};

Helper.prototype.empter = function(target) {
  if (target.length > 1) {
    target[0].remove();
  }
};
Helper.prototype.elementSize = function(element) {
  element = element.getBoundingClientRect();
  let height,
    width,
    size = 0;
  height = Math.ceil(element.height);
  width = Math.ceil(element.width);
  if (height > width) {
    size = width;
  } else if (width > height) {
    size = height;
  } else {
    size = (width + height) / 2;
  }
  size = Math.floor(size / 2) * 2;
  return size;
};

Helper.prototype.matrix = function(row, column) {
  let matrix = [],
    makeRow,
    product = row * column,
    bal = 0;
  for (let i = 0; i < row; i++) {
    makeRow = [];
    for (let j = 0; j < column; j++) {
      bal += 1;
      makeRow.push(bal - 1);
    }
    matrix.push(makeRow);
  }
  return matrix;
};

Helper.prototype.minMax = function(min, max, value) {
  if (value > max) {
    value = min;
  } else if (value < min) {
    value = max;
  } else {
    value = value;
  }
  return value;
};

Helper.prototype.pathNums = function(gap, start, size) {
  let arr = [start];
  for (let i = 0; i < size - 1; i++) {
    arr.push(parseInt(arr[i]) + gap);
  }
  return arr;
};

Helper.prototype.hideShowPassword = function(form, hideShowEle) {
  hideShowEle.addEventListener(`click`, () => {
    let value = hideShowEle.value;
    form.type = value;
    if (value === "password") {
      hideShowEle.value = "text";
    } else {
      hideShowEle.value = "password";
    }
    if (value == "password") {
      this.setInnerText(hideShowEle, "Show");
    } else {
      this.setInnerText(hideShowEle, "Hide");
    }
  });
};

Helper.prototype.duplicatesCounter = function(arr) {
  let count = {};
  arr.forEach((element) => {
    element = element.trim();
    count[element] = (count[element] || 0) + 1;
  });
  return count;
};

Helper.prototype.getJSON = function(resorce) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.addEventListener(`readystatechange`, () => {
      if ((request, request.readyState === 4 && request.status === 200)) {
        let data = JSON.parse(request.responseText);
        resolve(data);
      } else if ((request, request.readyState === 4)) {
        reject(`404! An Error`);
      }
    });
    request.open(`GET`, resorce);
    request.send();
  });
};


Helper.prototype.localStorageUse = function(method, key, input = {}) {
  method = method.toLowerCase();
  switch (method) {
    case "get":
      return getLocalStorageValue(key);
    case "post":
      setLocalStorageValue(key, input);
      break;
    case "delete":
    case "remove":
    case "clear":
      removeLocalStorageValue(method, key);
      break;
    default:
      console.error(`Invalid method "${method}"`);
  }

  function getLocalStorageValue(key) {
    let value = localStorage.getItem(key);
    if (typeof value === "string") {
      value = JSON.parse(value);
    } else {
      value = [];
      localStorage.setItem(key, JSON.stringify(value));
    }
    return value;
  }

  function setLocalStorageValue(key, input) {
    let value = getLocalStorageValue(key);
    value.push(input);
    localStorage.setItem(key, JSON.stringify(value));
  }

  function removeLocalStorageValue(method, key) {
    switch (method) {
      case "delete":
      case "remove":
        localStorage.removeItem(key);
        break;
      case "clear":
        localStorage.clear();
        break;
    }
  }
};
Helper.prototype.browserStorageUse = function(
  method,
  key,
  storageName,
  input = {}
) {
  method = method.toLowerCase();
  switch (method) {
    case "get":
      return getStorageValue(key, storageName);
    case "post":
      setStorageValue(key, input, storageName);
      break;
    case "delete":
    case "remove":
    case "clear":
      removeStorageValue(method, key, storageName);
      break;
    default:
      console.error(`Invalid method "${method}"`);
  }
};

function getCookieValue(cookieName, storage) {
  // Get all the cookies for the current domain
  const cookies = document[storage].split(";");
  // Loop through the cookies to find the one with the specified name
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      // Extract the value from the key-value pair
      const value = cookie.substring(cookieName.length + 1);
      return decodeURIComponent(value);
    }
  }
  // If the cookie is not found, return null
  return null;
}

function getStorageValue(key, storage) {
  if (storage === `cookie`) {
    let cookie = getCookieValue(key, storage);
    cookie = JSON.parse(cookie);
    return cookie
  } else {
    let value = storage.getItem(key);
    if (typeof value === "string") {
      value = JSON.parse(value);
    } else {
      value = [];
      storage.setItem(key, JSON.stringify(value));
    }
    return value;
  }
}

function returnDuration(days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `username=John Doe; expires=${expires}`;
  return expires;
}

function setStorageValue(key, input, storage) {
  if (storage === `cookie`) {
    const expires = returnDuration(input.days)
    document[storage] = `${key}=${JSON.stringify(input.value)}; expires=${expires}`;
  } else {
    let value = getStorageValue(key, storage);
    value.push(input);
    storage.setItem(key, JSON.stringify(value));
  }
}

function deleteCookie(cookieName, storage) {
  document[storage] = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  let cookie = getCookieValue(cookieName, storage);

  if (cookie === null) {
    console.log("Cookie '" + cookieName + "' has been deleted.");
  } else {
    console.log("Failed to delete cookie '" + cookieName + "'.");
  }
}

function removeStorageValue(method, key, storage) {
  switch (method) {
    case "delete":
    case "remove":
      if (storage === 'cookie') {
        deleteCookie(key, storage)
      } else {
        storage.removeItem(key);
      }
      break;
    case "clear":
      storage.clear();
      break;
  }
}

Helper.prototype.sortArr = function(arr) {
  const sorted = arr.slice().sort((a, b) => {
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA === typeB) {
      return typeA === "string" ? a.localeCompare(b) : a - b;
    } else {
      return typeA < typeB ? -1 : 1;
    }
  });
  return sorted;
};

Helper.prototype.delay = function(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
Helper.prototype.customInterval = function(fn, delay) {
  let intervalId;
  const clear = () => {
    clearInterval(intervalId);
  };
  const start = () => {
    intervalId = setInterval(() => {
      fn();
    }, delay);
  };
  return {
    start,
    clear,
  };
};

Helper.prototype.calculateReadingTime = function(
  text,
  wordsPerMinute = 200,
  round = true
) {
  // Ensure that text is not empty or undefined
  if (!text || text.trim().length === 0) {
    return 0;
  }
  // Split text into an array of words and count them
  const words = text.trim().split(/\s+/).length;
  // Calculate reading time in minutes
  const readingTimeMinutes = words / wordsPerMinute;
  // Round reading time to nearest whole number if round parameter is true (default)
  const readingTimeSeconds = round ?
    Math.round(readingTimeMinutes * 60) :
    readingTimeMinutes * 60;
  // Return reading time in seconds
  return readingTimeSeconds;
};

Helper.prototype.generateRandomColorScheme = function() {
  // Define arrays of possible color values
  const sciFiColors = [
    "#0B0E31",
    "#1F2943",
    "#324B6D",
    "#3C5E8D",
    "#4C7294",
    "#6686A0",
    "#7B9DB9",
    "#8BA8C6",
  ];
  const aiColors = [
    "#00BFFF",
    "#1E90FF",
    "#00CED1",
    "#20B2AA",
    "#32CD32",
    "#FFD700",
    "#FFA500",
    "#FF6347",
  ];
  // Generate random index values to select colors from each array
  const sciFiIndex = Math.floor(Math.random() * sciFiColors.length);
  const aiIndex = Math.floor(Math.random() * aiColors.length);
  // Return an object containing the selected colors
  return {
    sciFiColor: sciFiColors[sciFiIndex],
    aiColor: aiColors[aiIndex],
  };
};

Helper.prototype.safeExistElement = function(element) {
  if (element !== null && element !== undefined) {
    // element.innerHTML = value;
    return element;
  } else {
    //  console.error(`Element not found.`);
    return false;
  }
};

Helper.prototype.filterValue = function(value, allowedTags = "") {
  if (value === null || value === "") {
    return null;
  }
  // Trim leading/trailing whitespace
  value = value.trim();

  // Convert special characters to HTML entities
  value = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
  // Remove any disallowed HTML tags and attributes
  if (allowedTags !== "") {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = value;
    const disallowedTags = tempElement.querySelectorAll(
      `*:not(${allowedTags})`
    );
    for (let i = 0; i < disallowedTags.length; i++) {
      disallowedTags[i].parentNode.removeChild(disallowedTags[i]);
    }
    value = tempElement.innerHTML;
  }

  return value;
};

Helper.prototype.idGenerator = function() {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";
  // Generate the first two characters
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * uppercaseLetters.length);
    id += uppercaseLetters[randomIndex];
  }
  // Generate the remaining six characters
  const oddNumbers = [1, 3, 5, 7, 9];
  const evenNumbers = [0, 2, 4, 6, 8];
  let oddSum = 0;
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * oddNumbers.length);
    id += oddNumbers[randomIndex];
    oddSum += oddNumbers[randomIndex];
  }
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * evenNumbers.length);
    id += evenNumbers[randomIndex];
  }
  return id;
};

// Check if user is logged in
Helper.prototype.isUserLoggedIn = function(item) {
  let session = this.browserStorageUse("get", item, sessionStorage);
  let exist = this.isNotEmpty(session);

  if (exist || exist === "true") {
    if (session[0].isLoggedIn) {
      return true;
    } else {
      false;
    }
  } else {
    return false;
  }
};

Helper.prototype.isNotEmpty = function(obj) {
  if (Array.isArray(obj)) {
    return obj.length > 0;
  } else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return true;
      }
    }
    return false;
  }
};

Helper.prototype.generateSpaceColors = function() {
  // Generate a random color
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

  // Generate two random gradients with cool, dark space colors
  const linearGradient = `linear-gradient(to bottom, #141e30, #243b55)`;
  const radialGradient = `radial-gradient(circle at 50% 50%, #0f2027, #203a43, #2c5364)`;

  // Return the random color and gradients
  return {
    color: randomColor,
    linearGradient: linearGradient,
    radialGradient: radialGradient,
  };
};
Helper.prototype.chartJS = function(canvaId, type, data) {
  const labels = [];
  const datas = [];
  const colors = [];
  for (let item in data) {
    labels.push(data[item].label);
    datas.push(data[item].percentage);
    colors.push(data[item].color);
  }
  new Chart(`${canvaId}`, {
    type: `${type}`,
    data: {
      labels: labels,
      datasets: [
        {
          data: datas,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: false,
    },
  });
};

export let hp = new Helper();