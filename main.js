// Import modules
import { hp } from "./helper/lib.js";
import { forms } from "./forms/forms.js";
import { container } from "./src/htmlElements.js";

function navigateToQuiz(startAnchor) {
  if (hp.safeExistElement(startAnchor)) {
    startAnchor.addEventListener("click", () => {
      switch (hp.isUserLoggedIn("QF_Logger")) {
        case true:
          window.location.href = "./src/QuizFusion.html";
          break;
        default:
          window.location.href = "./forms/login.html";
          break;
      }
    });
  }
}

navigateToQuiz(container.access("startAnchor"));
forms();
