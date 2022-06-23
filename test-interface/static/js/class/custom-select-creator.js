export class CustomSelectCreator {
  constructor(
    selectElement = Node(),
    activeClass = String(),
    selectOptionContainer = Node(),
    attributeList = [String()]
  ) {
    this.selectElement = selectElement;
    this.activeClass = activeClass;
    this.selectOptionContainer = selectOptionContainer;
    this.attributeList = attributeList;
  }

  addOptionItem(
    displayValue = String(),
    attributeObjects = [{
      key: String(),
      data: String(),
    }]
  ) {
    const optionItem = document.createElement('li');
    attributeObjects.forEach(attribute => {
      optionItem.setAttribute(attribute.key, attribute.data);
    });
    optionItem.innerText = displayValue;

    this.selectOptionContainer.appendChild(optionItem);
  }

  createLabelPointer(element = Node()) {
    element.addEventListener('click', () => {
      this.selectElement.focus();
    });
  }

  createCustomSelect(
    defaultOptionValue = String(),
    selectTextContainer = Node(),
    optionActiveAttribute = String()
  ) {
    this.selectElement.setAttribute('tabindex', '0');

    const changeCustomSelectStatus = (status = Boolean()) => {
      if (status) {
        this.selectElement.classList.add(this.activeClass);

      } else {
        this.selectElement.classList.remove(this.activeClass);
      };
    };

    const changeOptionStatus = (option) => {
      optionList.forEach(option => {
        option.removeAttribute(optionActiveAttribute);
      });
      option.setAttribute(optionActiveAttribute, '');
    };

    const optionList = this.selectElement.querySelectorAll('li');
    let currentOptionIndex = 0;
    let showCustomSelect;

    (() => { // addSelectEvent
      this.selectElement.addEventListener('focus', () => {
        changeCustomSelectStatus(true);
        changeOptionStatus(optionList[currentOptionIndex]);
      });
      this.selectElement.addEventListener('focusout', () => {
        changeCustomSelectStatus(false);
      });
      this.selectElement.addEventListener('mouseenter', () => {
        changeCustomSelectStatus(true);
        changeOptionStatus(optionList[currentOptionIndex]);
      });
      this.selectElement.addEventListener('mouseleave', () => {
        changeCustomSelectStatus(false);
      });
      this.selectElement.addEventListener('click', () => {
        changeCustomSelectStatus(showCustomSelect);
        showCustomSelect = true;
      });

      this.selectElement.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
          if (currentOptionIndex < (optionList.length - 1)) {
            currentOptionIndex++;
          } else {
            currentOptionIndex = 0;
          };
          changeOptionStatus(optionList[currentOptionIndex]);

        } else if (event.key === 'ArrowUp') {
          if (currentOptionIndex > 0) {
            currentOptionIndex--;
          } else {
            currentOptionIndex = optionList.length - 1;
          };
          changeOptionStatus(optionList[currentOptionIndex]);

        } else if (event.key === 'Enter') {
          if (this.selectElement.classList.contains(this.activeClass)) {
            optionList[currentOptionIndex].click();
          } else {
            changeCustomSelectStatus(true);
          };
        };
      });
    })();

    (() => { // addOptionEvent
      const setSelectElementAttr = (option) => {
        this.attributeList.forEach(attribute => {
          this.selectElement.setAttribute(attribute, option.getAttribute(attribute))
        });
        selectTextContainer.innerHTML = option.innerHTML;

        showCustomSelect = false;
      };

      optionList.forEach((option, index) => {
        if (option.getAttribute('value') === defaultOptionValue) {
          setSelectElementAttr(option);
          showCustomSelect = true;
          currentOptionIndex = index;
          changeOptionStatus(option);
        }

        option.addEventListener('click', () => {
          setSelectElementAttr(option);
          currentOptionIndex = index;
          changeOptionStatus(option);
          changeCustomSelectStatus(false);
        });

        option.addEventListener('mouseenter', () => {
          changeOptionStatus(option);
        });
      });
    })();
  }
};