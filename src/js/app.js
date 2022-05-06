const createElement = (element, innerHTML, ...classes) => {
  const node = document.createElement(element);
  node.classList.add(...classes);
  node.innerHTML = innerHTML;
  return node;
};

const { body } = document;
const terminal = createElement('textarea', '', 'terminal');

const HeaderBlock = () => {
  const header = createElement("header", "", "header");
  const container = createElement("div", "", "container");
  header.append(container);
  container.append(createElement('h1', "Virtual Keyboard", 'b-h1'));
  body.append(header);
};

const MainBlock = () => {
  const main = createElement("main", "", "main");
  const container = createElement("div", "", "container");
  const keyboard = createElement('div', '', 'keyboard');
  const keyboardSection = createElement('div', 'keyboard', 'keyboard__section');
  main.append(container);
  container.append(terminal);
  container.append(keyboard);
  keyboard.append(keyboardSection);
  body.append(main);
};

const FooterBlock = () => {
  const footer = createElement("footer", "", "footer");
  const container = createElement("div", "", "container");
  footer.append(container);
  container.append(createElement('p', "Vasyl Makohin, &copy; 2022", 'copyright'));
  body.append(footer);
};

window.onload = () => {
  console.log("window onload");

  HeaderBlock();
  MainBlock();
  FooterBlock();
};
