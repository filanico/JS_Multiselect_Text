function Pills(cssSelector, JSconfig={}) {
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
  this.setEntries = function (entries, list, input,root) {
    list.innerHTML = "";
    entries = ['chiudi',...entries]
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
        this.trigger('Pill_onBeforeAppendListItem',{entry,node,root});
        list.append(node);
      }.bind(this)
    );
  }.bind(this);
  
  // events
  this.onItemClick = function (node, input, root) {
    const list = node.parentNode;
    this.hide(list);
    if(node.textContent!=='chiudi'){
      input.value = "";
      const pill = document.createElement("span");
      pill.innerText = node.textContent.trim();
      const times = document.createElement('span');
      times.innerHTML = '&times;';
      setAttributes(times,{class:'times'})
      pill.append(times);
      pill.classList.add("pill");
      pill.addEventListener('click',function(){
        this.trigger('Pill_onSelectedItemClick',{listItem:node, pill,root})
      }.bind(this))
      this.trigger('Pill_onBeforeAppendSelectedItem',{listItem:node, pill,root});
      node.parentNode.parentNode.append(pill);
      this.trigger('Pill_onListItemClick',{pill,root})
    }
  }.bind(this);

  [...document.querySelectorAll(cssSelector)].forEach((root) => {
    const config = {
      ...JSconfig,
      ...JSON.parse(root.getAttribute('data-config'))
    }
    const entries = config.entries;
    const showMaxResults = config.showMaxResults || 10;
    const allowEmptySearch = config.allowEmptySearch || false;
    const showListOnFocus = entries.length <= showMaxResults;
    const input = document.createElement("input");
    const list = document.createElement("ul");

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
        if (e.target.value.trim() !== "" || allowEmptySearch) {
          timer = setTimeout(
            function () {
              this.trigger('Pill_onSearch',{root})
              this.setEntries(
                entries.filter((entry) => entry.toLowerCase().startsWith(e.target.value.toLowerCase())),
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
    input.addEventListener("focus", function (e) {
      if (showListOnFocus) {
        let ce = new CustomEvent("input", { value: "" });
        input.dispatchEvent(ce);
      }
    });
    input.addEventListener("blur", function (e) {
      if (showListOnFocus) {
        let box = list.getBoundingClientRect();
        if(box.left<= x && x <=box.left+box.width && box.top<= box.top+y && box.top+y <=box.top+box.height){
          // click on list: let it visible in order to pick list-item
        } else {
          this.hide(list);
        }
      }
    }.bind(this));
    if(!Pills.isMouseUpListening){
      document.addEventListener('mouseup',function(e){
          this.x = e.pageX;
          this.y = e.pageY;
          this.eClick=e;
          if(!(e.target.tagName === 'LI' && e.target.parentNode.parentNode.hasAttribute('pills'))){
            this.hide(list);
          }
          // document.querySelector('#coords').textContent = JSON.stringify({x:this.x,y:this.y, oX: e.offsetX, oY: e.offsetY, cX: e.clientX, cY: e.clientY, lX: e.layerX, lY: e.layerY, target: e.target.tagName})
      }.bind(this))
      Pills.isMouseUpListening = true;
    }
    this.setAttributes(list, { class: "list hidden" });
    if(!root.querySelector('input')){
      root.append(input);
    }
    if(!root.querySelector('.list.hidden')){
      root.append(list);
    }
  });
}

