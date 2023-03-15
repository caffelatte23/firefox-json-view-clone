const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 14 14">
  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
</svg>
`;

class TableRow {
  propType;
  level = 1;
  name = null;
  indent = 16;

  constructor(propType, level = 1, name = null, indent = 16) {
    this.propType = propType;
    this.level = level;
    this.name = name;
    this.indent = indent;
  }

  make(key, value) {
    // tr
    const tr = document.createElement("tr");
    tr.classList.add("treeRow", `${this.propType}Row`, `${key}`);
    tr.setAttribute("aria-level", this.level);
    tr.setAttribute("name", this.name);
    tr.addEventListener("click", this.#toggleSelected);
    tr.classList.add(this.name.split("/").at(-1));
    if (this.level > 1) tr.classList.add(this.name.split("/").at(0), "hidden");

    // key
    const keyRecord = document.createElement("td");
    keyRecord.classList.add("obj-key");
    keyRecord.style = `--tree-cell-indent: ${this.indent * (this.level - 1)}px`;
    keyRecord.innerHTML = `
    <span class="caret">${
      this.propType !== "object" ? "" : svg
    }</span><span class="label">${key}</span>`;
    if (this.propType === "object")
      keyRecord.addEventListener("click", this.#toggleVisible);

    // value
    const valueRecord = document.createElement("td");
    valueRecord.classList.add(`obj-value`, `${this.propType}`);
    if (this.propType !== "object") valueRecord.innerHTML = value;

    tr.append(keyRecord, valueRecord);
    return tr;
  }

  #toggleSelected(e) {
    const currentSelect = document.querySelector(".selected");
    if (currentSelect) currentSelect.classList.remove("selected");
    const parent = e.target.closest(".treeRow");
    parent.classList.add("selected");
  }

  #toggleVisible(e) {
    const parent = e.target.closest(".objectRow");
    const index = parent.getAttribute("name");
    const level = Number(parent.getAttribute("aria-level"));

    const isOpened = TableRow.isOpen(parent);
    const attributes = TableRow.findElementsbyIndex(
      index.split("/").at(0),
      index
    );
    const filteredAttrs = isOpened
      ? attributes.splice(1)
      : attributes.filter(
          (d) => Number(d.getAttribute("aria-level")) === level + 1
        );

    filteredAttrs.forEach((d) => {
      if (isOpened) d.classList.add("hidden");
      else d.classList.remove("hidden");

      if (TableRow.isOpen(d)) d.classList.remove("opened");
    });
    parent.classList.toggle("opened");
  }

  static findElementsbyIndex(key, index) {
    const attributes = document.getElementsByClassName(key);
    return Array.from(attributes).filter((d) => {
      return d.getAttribute("name").startsWith(index);
    });
  }

  static isOpen(element) {
    return Object.values(element.classList).includes("opened");
  }
}
