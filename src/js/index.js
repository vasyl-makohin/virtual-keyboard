import keyboardKeys from "./keyboardKeys.js";

const elementHtml = (element, innerHTML, ...classes) => {
  const node = document.createElement(element);
  node.classList.add(...classes);
  node.innerHTML = innerHTML;
  return node;
};

export default class Keyboard {
  constructor() {
    this.theme = "dark";
    this.lang = "en";
    this.caps = "off";
    this.shift = false;
  }

  getTheme() {
    if (localStorage.getItem("theme")) {
      this.theme = localStorage.getItem("theme");
    } else {
      localStorage.setItem("theme", this.theme);
    }
  }

  changeTheme(event) {
    if (this.theme === "dark") {
      this.theme = "light";
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      this.theme = "dark";
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("theme", this.theme);
  }

  getLanguage() {
    if (localStorage.getItem("lang")) {
      this.lang = localStorage.getItem("lang");
    } else {
      localStorage.setItem("lang", this.lang);
    }
  }

  changeLanguage(event) {
    if (this.lang === "en") {
      this.lang = "ru";
    } else {
      this.lang = "en";
    }
    localStorage.setItem("lang", this.lang);
    this.updateKeyboard(event);
  }

  changeCapsLock(event) {
    if (this.caps === "on") {
      this.caps = "off";
    } else {
      this.caps = "on";
    }
    this.updateKeyboard(event);
  }

  updateKeyboard(event) {
    const { lang } = this;

    if (event.shiftKey || this.shift) {
      document.querySelectorAll(".key").forEach((e) => {
        if (e.dataset[`${lang}Shift`]) {
          if (this.caps === "on") {
            e.innerHTML = e.dataset[`${lang}Shift`].toLowerCase();
          } else e.innerHTML = e.dataset[`${lang}Shift`];
        } else if (e.dataset[lang]) e.innerHTML = e.dataset[lang];
      });
    } else {
      document.querySelectorAll(".key").forEach((e) => {
        if (e.dataset[lang]) {
          if (this.caps === "on" && !(event.shiftKey || this.shift)) {
            e.innerHTML = e.dataset[lang].toUpperCase();
          } else e.innerHTML = e.dataset[lang];
        }
      });
    }
  }

  deleteShift(event) {
    if (this.shift) {
      this.shift = !this.shift;
      document.querySelector(".key_leftshift").classList.remove("active");
      document.querySelector(".key_rightshift").classList.remove("active");
      this.updateKeyboard(event);
    }
  }

  generateKeyboard() {
    const container = elementHtml("div", "", "keyboard__container");
    const keyboard = elementHtml("div", "", "keyboard");
    this.getLanguage();

    for (let i = 0; i < keyboardKeys.length; i += 1) {
      const row = elementHtml("div", "", "row");
      keyboardKeys[i].forEach((e) => {
        const keyLabel = e.key.ru && e.key.en ? e.key[this.lang] : e.key;
        const key = elementHtml("div", keyLabel, "key");

        if (e.class) key.classList.add(e.class);

        key.dataset.code = e.code;

        if (e.key.ru && e.key.en) {
          key.dataset.ru = e.key.ru;
          key.dataset.en = e.key.en;
        }

        if (e.shift) {
          key.dataset.ruShift = e.shift.ru;
          key.dataset.enShift = e.shift.en;
        }

        if (e.noType) {
          key.dataset.noType = true;
        }

        row.append(key);
      });

      keyboard.append(row);
    }
    container.append(keyboard);

    return container;
  }
}

const { body } = document;
const terminal = elementHtml("textarea", "", "terminal");
const keyboardInit = new Keyboard();

const HeaderBlock = () => {
  const header = elementHtml("header", "", "header");
  const container = elementHtml("div", "", "container");
  header.append(container);
  container.append(elementHtml("h1", "Virtual Keyboard", "b-h1"));
  body.append(header);
};

const MainBlock = () => {
  const main = elementHtml("main", "", "main");
  const container = elementHtml("div", "", "container");
  main.append(container);
  container.append(createHead());
  container.append(terminal);
  container.append(keyboardInit.generateKeyboard());
  body.append(main);
};

const FooterBlock = () => {
  const footer = elementHtml("footer", "", "footer");
  const container = elementHtml("div", "", "container");
  footer.append(container);
  container.append(elementHtml("p", "Vasyl Makohin, &copy; 2022", "copyright"));
  body.append(footer);
};


const createHead = () => {
  const div = document.createElement("div");
  div.classList.add("keyboard__head");

  div.innerHTML = `
    <div class="key key_theme btn-theme" data-code="Theme" data-light="light" data-dark="dark" data-no-type="true">dark</div>
    <div class="key key_lang btn-key" data-code="Language" data-ru="ru" data-en="en" data-no-type="true">en</div>
  `;

  return div;
};

const keyPress = (event, button, code) => {
  let text = "";
  let cursor = terminal.selectionStart;
  event.preventDefault();
  terminal.focus();

  if (code === "CapsLock") keyboardInit.changeCapsLock(event);

  if (code === "Theme") keyboardInit.changeTheme(event);

  if (
    (code === "AltLeft" && (event.shiftKey || keyboardInit.shift)) ||
    (code === "AltRight" && (event.shiftKey || keyboardInit.shift)) ||
    (code === "ShiftLeft" && event.altKey) ||
    (code === "ShiftRight" && event.altKey) ||
    code === "Language"
  ) {
    keyboardInit.changeLanguage(event);
    keyboardInit.deleteShift(event);
  }

  if (code === "ShiftLeft" || code === "ShiftRight") {
    keyboardInit.updateKeyboard(event);
  }

  if (code === "ArrowLeft" && cursor > 0) {
    terminal.setSelectionRange(cursor - 1, cursor - 1);
  }

  if (code === "ArrowRight") {
    cursor = terminal.selectionEnd;
    terminal.setSelectionRange(cursor + 1, cursor + 1);
  }

  if (code === "ArrowUp") {
    const textBeforeCursor = terminal.value.substring(0, cursor).split("\n");

    if (
      textBeforeCursor.length === 1 ||
      textBeforeCursor[textBeforeCursor.length - 1].length >= 57
    ) {
      cursor -= 57;
    } else if (
      textBeforeCursor[textBeforeCursor.length - 1].length <=
      textBeforeCursor[textBeforeCursor.length - 2].length % 57
    ) {
      cursor -= (textBeforeCursor[textBeforeCursor.length - 2].length % 57) + 1;
    } else {
      cursor -= textBeforeCursor[textBeforeCursor.length - 1].length + 1;
    }
    if (cursor < 0) cursor = 0;
    terminal.setSelectionRange(cursor, cursor);
  }

  if (code === "ArrowDown") {
    cursor = terminal.selectionEnd;
    const textBeforeCursor = terminal.value.substring(0, cursor).split("\n");
    const textAfterCursor = terminal.value
      .substring(terminal.selectionEnd)
      .split("\n");

    if (textAfterCursor.length === 1 || textAfterCursor[0].length >= 57) {
      cursor += 57;
    } else if (
      textBeforeCursor[textBeforeCursor.length - 1].length % 57 >
      textAfterCursor[1].length
    ) {
      cursor += textAfterCursor[0].length + textAfterCursor[1].length + 1;
    } else if (
      textBeforeCursor[textBeforeCursor.length - 1].length +
      textAfterCursor[0].length >
      57
    ) {
      cursor += textAfterCursor[0].length;
    } else {
      cursor +=
        (textBeforeCursor[textBeforeCursor.length - 1].length % 57) +
        textAfterCursor[0].length +
        1;
    }
    terminal.setSelectionRange(cursor, cursor);
  }

  if (code === "Tab") text = "    ";
  if (code === "Enter") text = "\n";
  if (code === "Backspace") text = "-1";
  if (code === "Delete") text = "+1";

  if (!button.dataset.noType) {
    text = button.textContent;
    keyboardInit.deleteShift(event);
  }

  if (text) {
    let textBeforeCursor = terminal.value.substring(0, cursor);
    let textAfterCursor = terminal.value.substring(terminal.selectionEnd);
    if (text === "-1") {
      text = "";
      if (cursor === terminal.selectionEnd) {
        textBeforeCursor = textBeforeCursor.slice(0, -1);
        cursor -= cursor > 0 ? 2 : 1;
      } else cursor -= 1;
    }
    if (text === "+1") {
      text = "";
      if (cursor === terminal.selectionEnd) {
        textAfterCursor = textAfterCursor.slice(1);
      }
      cursor -= 1;
    }

    terminal.value = textBeforeCursor + text + textAfterCursor;
    terminal.setSelectionRange(cursor + 1, cursor + 1);

    if (text === "    ") terminal.setSelectionRange(cursor + 4, cursor + 4);
  }
};

window.onload = () => {
  // document.documentElement.classList.add('light-theme');

  HeaderBlock();
  MainBlock();
  FooterBlock();

  keyboardInit.getTheme();
  keyboardInit.getLanguage();

  if (localStorage.getItem("lang")) {
    let lang = localStorage.getItem("lang");
    document.querySelector(".btn-key").innerHTML = lang;
  }

  document.addEventListener("keydown", (event) => {
    const button = document.querySelector(`[data-code=${event.code}]`);
    if (button) {
      button.classList.add("active");
      keyPress(event, button, event.code);
    }
  });

  document.addEventListener("keyup", (event) => {
    const button = document.querySelector(`[data-code=${event.code}]`);
    if (button) {
      button.classList.remove("active");
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        keyboardInit.deleteShift(event);
        keyboardInit.updateKeyboard(event);
      }
    }
  });

  document.querySelector(".keyboard").addEventListener("click", (event) => {
    if (event.target.closest(".key")) {
      const button = event.target.closest(".key");
      if (
        button.dataset.code === "ShiftLeft" ||
        button.dataset.code === "ShiftRight"
      ) {
        keyboardInit.shift = !keyboardInit.shift;
        button.classList.toggle("active");
      }
      keyPress(event, button, button.dataset.code);
    }
  });

  document.querySelector(".keyboard__head").addEventListener("click", (event) => {
    if (event.target.closest(".key")) {
      const button = event.target.closest(".key");
      keyPress(event, button, button.dataset.code);
    }
  });
};
