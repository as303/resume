"use strict";

const languageButton = document.querySelector("#language");
const copyButton = document.querySelector("#copy");
const printButton = document.querySelector("#print");
const feedback = document.querySelector("#feedback");
const heading = document.querySelector("#intro-title");
const translations = Array.from(document.querySelectorAll("[data-en]"), element => ({
  element, chinese: element.textContent, english: element.dataset.en
}));
const labels = Array.from(document.querySelectorAll("[data-label-en]"), element => ({
  element, chinese: element.getAttribute("aria-label"), english: element.dataset.labelEn
}));
const chineseTitle = document.title;
let english = false;

languageButton.hidden = copyButton.hidden = printButton.hidden = false;
languageButton.addEventListener("click", () => {
  english = !english;
  const key = english ? "english" : "chinese";
  document.documentElement.lang = english ? "en" : "zh-CN";
  document.title = english ? "Xiaoli · AI practice notes" : chineseTitle;
  languageButton.textContent = english ? "中文" : "English";
  languageButton.lang = english ? "zh-CN" : "en";
  for (const item of translations) item.element.textContent = item[key];
  for (const item of labels) item.element.setAttribute("aria-label", item[key]);
  feedback.textContent = "";
});

copyButton.addEventListener("click", async () => {
  const greeting = Array.from(heading.children, part => part.textContent).join(english ? " " : "");
  const introduction = [greeting, document.querySelector(".lead").textContent, document.querySelector("#bio").textContent].join(english ? " " : "");
  try {
    await navigator.clipboard.writeText(introduction);
    feedback.textContent = english ? "Introduction copied." : "已复制，可以粘贴到群聊。";
  } catch {
    feedback.textContent = introduction;
    const range = document.createRange();
    range.selectNodeContents(feedback);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

printButton.addEventListener("click", () => window.print());

const themeButton = document.querySelector("#theme");
const root = document.documentElement;
try {
  const savedTheme = localStorage.getItem("notebook-theme");
  if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;
} catch { /* The system preference works when storage is unavailable. */ }
themeButton.hidden = false;
themeButton.addEventListener("click", () => {
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("notebook-theme", root.dataset.theme); } catch { /* Optional preference. */ }
});
