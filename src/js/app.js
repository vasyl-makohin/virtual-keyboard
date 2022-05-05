const { body } = document;

const createNode = (element, innerHTML, ...classes) => {
  const node = document.createElement(element);
  node.classList.add(...classes);
  node.innerHTML = innerHTML;
  return node;
};

const HeaderBlock = () => {
  const header = createNode("header", "", "header");
  header.append(createNode("div", "header", "container"));
  body.append(header);
};

const MainBlock = () => {
  const main = createNode("main", "", "main");
  main.append(createNode("div", "main", "container"));
  body.append(main);
};

const FooterBlock = () => {
  const footer = createNode("footer", "", "footer");
  footer.append(createNode("div", "footer", "container"));
  body.append(footer);
};

window.onload = () => {
  console.log("window onload");

  HeaderBlock();
  MainBlock();
  FooterBlock();
};
