import { hp } from '../helper/lib.js';
import { Users } from '../users/users.js';

export function forms() {
  const form = hp.getDom(`form`)
  if (hp.safeExistElement(form)) {
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      const fullNameInput = hp.getDom('#fullname')
      const usernameInput = hp.getDom('#username')
      const passwordInput = hp.getDom('#password')

      let fullnameMsg, usernameMsg, passwordMsg
      if (hp.safeExistElement(fullNameInput)) {
        fullnameMsg = fullNameInput.parentElement.children[2]
      }
      if (hp.safeExistElement(usernameInput)) {
        usernameMsg = usernameInput.parentElement.children[2]
      }
      if (hp.safeExistElement(passwordInput)) {
        passwordMsg = passwordInput.parentElement.children[2]
      }

      if (fullNameInput && usernameInput && passwordInput) {
        const fullName = fullNameInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!validateFullName(fullName)) {
          hp.setInnerText(
            fullnameMsg,
            `Fullname must have 2 or 3 names`
          )
          addInputEventListeners()
          return;
        }

        if (!validateUsername(username)) {
          return;
        }

        if (!validatePassword(password)) {
          return;
        }

        const accountData = {
          fullname: hp.filterValue(fullName),
          username: hp.filterValue(username),
          password: hp.filterValue(password),
        };

        let isCreated = createAccount(
          accountData,
          new Users()
        );
        if (isCreated) {
          hp.setInnerText(
            usernameMsg,
            `Username already in use`
          )
          hp.setInnerText(
            passwordMsg,
            ``
          )
        }
        addInputEventListeners()

        function addInputEventListeners() {
          fullnameMsg.previousElementSibling.addEventListener('input', clearMessages);
          usernameMsg.previousElementSibling.addEventListener('input', clearMessages);
        }

        function clearMessages() {
          hp.setInnerText(
            usernameMsg,
            ``
          )
          hp.setInnerText(
            fullnameMsg,
            ``
          )
        }
      } else {
        let userName = username.value.trim()
        let passWord = password.value.trim()
        if (!validateUsername(userName)) {
          return;
        }
        if (!validatePassword(passWord)) {
          return;
        }

        const userData = {
          username: hp.filterValue(userName),
          password: hp.filterValue(passWord),
        };
        let isLoggedIn = loginUser(
          userData,
          new Users()
        );

        if (!isLoggedIn) {
          hp.setInnerText(
            usernameMsg,
            `Incorrect username`
          )
          hp.setInnerText(
            passwordMsg,
            `Incorrect password`
          )
        }
        addInputEventListeners()

        function addInputEventListeners() {
          passwordMsg.previousElementSibling.addEventListener('input', clearMessages);
          usernameMsg.previousElementSibling.addEventListener('input', clearMessages);
        }

        function clearMessages() {
          hp.setInnerText(
            usernameMsg,
            ``
          )
          hp.setInnerText(
            passwordMsg,
            ``
          )
        }
      }

    });
  }
}


function createAccount(newAccount, users) {
  // Send an AJAX request to create the account
  let msg = false
  users.stack(
    hp.browserStorageUse(
      "get",
      "USERS",
      localStorage
    )
  )
  let exist = users.findUser(
    newAccount,
    "create"
  );

  users.stack(
    hp.browserStorageUse(
      "get",
      "USERS",
      localStorage
    )
  )

  switch (exist.isExist) {
    case true:
      msg = exist.isExist
      break;
    case false:
      msg = exist.isExist
      newAccount["userId"] = users.userId();
      users.addUser(newAccount);
      window.location.href = "login.html";
      break;
  }
  return msg;
}


function loginUser(userData, users) {
  let msg = false
  users.stack(
    hp.browserStorageUse(
      "get",
      "USERS",
      localStorage
    )
  )
  let exist = users.findUser(userData, "login");
  users.stack(
    hp.browserStorageUse(
      "get",
      "USERS",
      localStorage
    )
  )
  switch (exist.isExist) {
    case true:
      let sessionItem = {
        userName: userData.username,
        userId: exist.userId,
        isLoggedIn: true,
        timeLoggedIn: null,
      }
      window.location.href = "../src/QuizFusion.html";
      hp.browserStorageUse(
        'post',
        'QF_Logger',
        sessionStorage,
        sessionItem
      )
      break;
    case false:
      break;
  }
  return exist.isExist;
}

hideShowElements(
  hp.getDom("#password"),
  hp.getDom("#hideShowBtn")
)

function hideShowElements(form, handler) {
  if (
    hp.safeExistElement(form) && hp.safeExistElement(handler)
  ) {
    hp.hideShowPassword(
      form,
      handler
    );
  }
}

function validateFullName(fullName) {
  const fullNameRegex = /^\w+(\s\w+){1,2}$/;
  return fullNameRegex.test(fullName);
}

function validateUsername(username) {
  return username.length >= 5;
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[A-Za-z]).{8,}$/;
  return passwordRegex.test(password);
}