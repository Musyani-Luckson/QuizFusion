import { hp } from "../helper/lib.js";

class Container {
  constructor() {
    this.maxOfX = hp.getDom("#maxOfX");
    this.paragraphValue = hp.getDom("#paragraphValue");
    this.answers = hp.getDom(".answers");
    this.startAnchor = hp.getDom("#startAnchor");
    this.categoriesContainer = hp.getDom("#categoriesContainer");
    this.section = hp.getDom(".sectionClass");
    this.sectionCategoryDiv = hp.getDom("#sectionCategoryDiv");
    this.navLink = hp.getDom(".nav-link");
    this.rangeBtn = hp.getDom(".rangeBtn");
    this.range = hp.getDom("#range");
    this.maxShow = hp.getDom("#maxShow");
    this.modalName = hp.getDom("#modalName");
    this.playQuiz = hp.getDom("#playQuiz");
    this.startStopBtn = hp.getDom("#startStopBtn");
    this.timerShow = hp.getDom("#timerShow");
    this.hit = hp.getDom("#hit");
    this.miss = hp.getDom("#miss");
    this.rank = hp.getDom("#rank");
    this.points = hp.getDom("#points");
    this.loginOrLogout = hp.getDom("#loginOrLogout");
    this.leadersboardBody = hp.getDom("#leadersboardBody");
    this.userNameText = hp.getDom("#userNameText");
    this.answersBox = hp.getDom("#answersBox");
    this.logingOut = hp.getDom("#logingOut");
  }
}
Container.prototype.access = function (name) {
  return this[name];
};
export let container = new Container();