function Pills(cssSelector, config) {
  this.rowIndex=1;
  this.selection = [];
  // utils
  this.hide = function (list) {
    list.classList.remove("show");
    list.classList.add("hidden");
    this.trigger('Pill_onListHide',{list})
  };
  this.show = function (list) {
    list.classList.remove("hidden");
    list.classList.add("show");
    this.trigger('Pill_onListShow',{list})
  };
  this.setAttributes = (node, attrs) => {
    Object.keys(attrs).forEach((k) => {
      node.setAttribute(k, attrs[k]);
    });
  };
  this.trigger = (eventName,data) => {
    const ce = new CustomEvent(eventName,{detail:data});
    document.dispatchEvent(ce);
  }
  // events
  this.onItemClick = function (node, input, root) {
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
    pill.addEventListener('click',function(){
      this.trigger('Pill_onSelectedItemClick',{pill,root})
    }.bind(this))
    node.parentNode.parentNode.append(pill);
    this.trigger('Pill_onListItemClick',{pill,root})
  }.bind(this);

  this.setEntries = function (entries, list, input,root) {
    list.innerHTML = "";
    entries.forEach(
      function (entry) {
        const node = document.createElement("li");
        node.addEventListener(
          "click",
          function () {
            this.onItemClick(node, input, root);
          }.bind(this)
        );
        node.innerText = entry;
        list.append(node);
      }.bind(this)
    );
  }.bind(this);
  const entries = config.entries || [];
  [...document.querySelectorAll(cssSelector)].forEach((root) => {
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
              this.trigger('Pill_onSearch',{root})
              this.setEntries(
                entries.filter((entry) => entry.includes(e.target.value)),
                list,
                input,
                root
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

