export class Suggester {
  constructor (
    suggestData = [Object()],
    keyList = Array(),
  ) {
    this.suggestData = suggestData;
    this.keyList = keyList;
  }

  createSuggester (
    input = Node(),
    selectOptionContainer = Node(),
    optionActiveAttribute = String(),
    activeClass = String(),
    highlightClass = String()
  ) {
    let currentOptionIndex = 0;
    let optionList = selectOptionContainer.querySelectorAll('li:not([not-access])');

    const changeCustomSelectStatus = (status = Boolean()) => {
      if (status) {
        selectOptionContainer.classList.add(activeClass);

      } else {
        selectOptionContainer.classList.remove(activeClass);
      }
    };

    input.addEventListener('focusout', () => {
      changeCustomSelectStatus(false);
    });

    const escapeRegExp = (str = String()) => {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    const inputEvent = () => {
      changeCustomSelectStatus(true);

      let suggestResultQuantity = 0;
      let hidedSuggestQuantity = 0;
      const maxSuggestResult = 5;

      currentOptionIndex = -1;

      selectOptionContainer.innerHTML = '';
      const searchValue = input.value.trim();

      if (searchValue !== '') {
        const searchValueList = escapeRegExp(searchValue).toLowerCase().split(/\s+/);

        searchValueList.forEach((value, index) => {
          const currentValue = value;
          const currentIndex = index;

          searchValueList.forEach((value, index) => {
            if (
              currentValue.length > value.length &&
              currentValue.includes(value) &&
              currentIndex !== index
            ) {
              searchValueList.splice(index, 1);

            } else if (
              value.includes(currentValue) &&
              currentIndex !== index
            ) {
              searchValueList.splice(currentIndex, 1);
            }
          });
        });

        this.suggestData.forEach((dataObject) => {
          const checkContain = this.keyList.some((key) => {
            dataObject[key] = String(dataObject[key]);

            return searchValueList.some((value) => {
              return dataObject[key].toLowerCase().match(value);
            });
          });

          if (
            checkContain === true &&
            suggestResultQuantity < maxSuggestResult
          ) {
            let listItemContent = '';
            this.keyList.forEach((key, index) => {
              if (index > 0) {
                listItemContent += ' - ';
              }
              listItemContent += `${dataObject[key]}`;
            });
            const listItem = document.createElement('li');
            listItem.setAttribute('value', listItemContent);
            listItem.setAttribute('index', suggestResultQuantity);

            let index, startIndex;
            const replacePositionList = [];

            searchValueList.forEach(value => {
              startIndex = 0;

              while ((index = listItemContent.toLowerCase().indexOf(value, startIndex)) > -1) {
                startIndex = index + value.length;

                replacePositionList.push({
                  index: index,
                  length: value.length,
                });
              };
            });

            const openHightlightTag = `<span class="${highlightClass}">`;
            const closeHightlightTag = '</span>';
            let tagLength = 0;

            replacePositionList.sort((a, b) => {
              return a.index - b.index;
            })
            replacePositionList.forEach((replacePosition) => {
              const index = replacePosition.index + tagLength;
              const length = replacePosition.length;

              listItemContent =
                listItemContent.substring(0, index) +
                openHightlightTag + listItemContent.substring(index, index + length) + closeHightlightTag +
                listItemContent.substring(index + length);

              tagLength = tagLength + openHightlightTag.length + closeHightlightTag.length;
            });

            listItem.innerHTML = listItemContent;
            selectOptionContainer.appendChild(listItem);
            suggestResultQuantity++;

          } else if (checkContain === true) {
            hidedSuggestQuantity++;
          };
        });

      } else if (searchValue === '') {
        this.suggestData.forEach((dataObject) => {
          if (suggestResultQuantity < maxSuggestResult) {
            let listItemContent = '';
            this.keyList.forEach((key, index) => {
              if (index > 0) {
                listItemContent += ' - ';
              }
              listItemContent += `${dataObject[key]}`;
            });
            const listItem = document.createElement('li');
            listItem.setAttribute('value', listItemContent);
            listItem.setAttribute('index', suggestResultQuantity);

            listItem.innerHTML = listItemContent;
            selectOptionContainer.appendChild(listItem);
            suggestResultQuantity++;

          } else {
            hidedSuggestQuantity++;
          };
        });
      }

      if (hidedSuggestQuantity > 0) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `+ ${hidedSuggestQuantity} More`;
        listItem.classList.add('text-center');
        listItem.setAttribute('not-access', '');
        selectOptionContainer.appendChild(listItem);
      };

      optionList = selectOptionContainer.querySelectorAll('li:not([not-access])');
      optionList.forEach((option) => {
        createOptionEvent(option);
      });
    };

    input.addEventListener('input', inputEvent);
    input.addEventListener('focus', inputEvent);

    const changeOptionStatus = (option = Node()) => {
      optionList.forEach(option => {
        option.removeAttribute(optionActiveAttribute);
      });
      option.setAttribute(optionActiveAttribute, '');
    };

    const changeInputValue = (option = Node()) => {
      input.value = option.getAttribute('value');
    };

    const createOptionEvent = (option = Node()) => {
      option.addEventListener('mouseenter', () => {
        currentOptionIndex = option.getAttribute('index');
        changeOptionStatus(option);
      });

      option.addEventListener('click', () => {
        changeInputValue(option);
      });
    };

    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        if (currentOptionIndex < (optionList.length - 1)) {
          currentOptionIndex++;
        } else {
          currentOptionIndex = 0;
        }
        changeOptionStatus(optionList[currentOptionIndex]);

      } else if (event.key === 'ArrowUp') {
        if (currentOptionIndex > 0) {
          currentOptionIndex--;
        } else {
          currentOptionIndex = optionList.length - 1;
        }
        changeOptionStatus(optionList[currentOptionIndex]);

      } else if (event.key === 'Enter') {
        if (
          currentOptionIndex >= 0 &&
          currentOptionIndex < (optionList.length - 1)
        ) {
          changeInputValue(optionList[currentOptionIndex]);
          changeCustomSelectStatus(false);
        };
      };
    });
  }
}