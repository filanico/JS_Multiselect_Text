function Pills(cssSelector, config) {
  this.rowIndex=1;
  this.selection = [];
  // utils
  this.hide = function (list) {
    list.classList.remove("show");
    list.classList.add("hidden");
  };
  this.show = function (list) {
    list.classList.remove("hidden");
    list.classList.add("show");
  };
  this.setAttributes = (node, attrs) => {
    Object.keys(attrs).forEach((k) => {
      node.setAttribute(k, attrs[k]);
    });
  };
  // events
  this.onItemClick = function (node, input) {
    const list = node.parentNode;
    this.hide(list);
    input.value = "";
    const pill = document.createElement("span");
    pill.innerText = node.textContent.trim();
    const times = document.createElement('span');
    times.innerHTML = '&times;';
    setAttributes(times,{class:'times'})
    pill.append(times);
    pill.classList.add("pill");
    node.parentNode.parentNode.append(pill);
  }.bind(this);

  this.setEntries = function (entries, list, input) {
    list.innerHTML = "";
    entries.forEach(
      function (entry) {
        const node = document.createElement("li");
        node.addEventListener(
          "click",
          function () {
            this.onItemClick(node, input);
          }.bind(this)
        );
        node.innerText = entry;
        list.append(node);
      }.bind(this)
    );
  }.bind(this);
  const entries = config.entries || [];
  const nodes = [...document.querySelectorAll(cssSelector)].forEach((root) => {
    const input = document.createElement("input");
    this.setAttributes(input, {
      type: 'text',
      // contenteditable:'plaintext-only',
    });
    let timer = null;
    const showResultsAfterMsecs = config.showResultsAfterMsecs || 1000;
    input.addEventListener(
      "input",
      function (e) {
        e.preventDefault();
        clearTimeout(timer);
        if (e.target.value.trim() !== "") {
          timer = setTimeout(
            function () {
              this.setEntries(
                entries.filter((entry) => entry.includes(e.target.value)),
                list,
                input
              );
              list.classList.remove("hidden");
              list.classList.add("show");
            }.bind(this),
            showResultsAfterMsecs
          );
        } else {
          this.setEntries([], list);
        }
      }.bind(this)
    );
    // input.style.width = "100%";
    input.style.height = "100%";
    const list = document.createElement("ul");
    this.setAttributes(list, { class: "list hidden" });

    root.append(input);
    root.append(list);
  });
}

