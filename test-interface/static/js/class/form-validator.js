export class FormValidator {
  constructor (
    submitButton = Node(),
    hideMessageContainerClass = String(),
    inputInvalidClass = String(),
    inputValidClass = String(),
  ) {
    this.submitButton = submitButton;
    this.hideMessageContainerClass = hideMessageContainerClass;
    this.inputInvalidClass = inputInvalidClass;
    this.inputValidClass = inputValidClass;
    this.inputList = [];
    this.checkValidate = false;
  }

  changeInputStatus (
    input = Node(),
    messageContainer = Node(),
    check = Boolean()
  ) {
    if (check === true) {
      messageContainer.classList.add(this.hideMessageContainerClass);
      input.classList.remove(this.inputInvalidClass);
      input.classList.add(this.inputValidClass);

    } else if (check === false) {
      messageContainer.classList.remove(this.hideMessageContainerClass);
      input.classList.remove(this.inputValidClass);
      input.classList.add(this.inputInvalidClass);
    };
  }

  changeButtonStatus () {
    this.checkValidate = true;
    this.inputList.forEach((input) => {
      if (input.classList.contains(this.inputValidClass) === false) {
        this.checkValidate = false;
      };
    });

    if (this.checkValidate === true) {
      this.submitButton.removeAttribute('disabled');

    } else {
      this.submitButton.setAttribute('disabled', '');
    };
  }

  addTextInputValidator (
    input = Node(),
    inputName = String(),
    messageContainer = Node(),
    minLength = Number(),
    maxLength = Number(),
    pattern = RegExp(),
    patternErrorMessage = String()
  ) {
    this.inputList.push(input);

    input.addEventListener('change', () => {
      input.value = input.value.trim();
      const inputValue = input.value;
      let check = false;

      if (inputValue.length < minLength) {
        messageContainer.innerHTML =
          `The ${inputName} must have more than ${minLength} `;
        if (minLength === 1) {
          messageContainer.innerHTML += 'character';
        } else {
          messageContainer.innerHTML += 'characters';
        };

      } else if (inputValue.length > maxLength) {
        messageContainer.innerHTML =
          `The ${inputName} must have less than ${maxLength} `;
        if (maxLength === 1) {
          messageContainer.innerHTML += 'character';
        } else {
          messageContainer.innerHTML += 'characters';
        };

      } else if (pattern.test(inputValue) === false) {
        messageContainer.innerHTML = patternErrorMessage;

      } else {
        check = true;
      };

      this.changeInputStatus(
        input,
        messageContainer,
        check,
      );
      this.changeButtonStatus();
    });
  }

  addNumberInputValidator (
    input = Node(),
    inputName = String(),
    messageContainer = Node(),
    min = Number(),
    max = Number(),
    step = Number()
  ) {
    this.inputList.push(input);

    input.addEventListener('input', () => {
      const inputValue = input.value;
      let check = false;

      if (isNaN(inputValue) || inputValue === '') {
        messageContainer.innerHTML = `The ${inputName} must be a number`;

      } else if (inputValue < min) {
        messageContainer.innerHTML =
          `The ${inputName} must greater than ${min}`;

      } else if (inputValue > max) {
        messageContainer.innerHTML =
          `The ${inputName} must lesser than ${max}`;

      } else if ((inputValue / step) % 1 !== 0) {
        messageContainer.innerHTML =
          `The ${inputName} step must be ${step}`;

      } else {
        check = true;
      };

      this.changeInputStatus(
        input,
        messageContainer,
        check,
      );
      this.changeButtonStatus();
    });
  }

  addFileInputValidator (
    input = Node(),
    inputName = String(),
    messageContainer = Node(),
    fileMIMETypeList = [String()],
    minMbSize = Number(),
    maxMbSize = Number()
  ) {
    this.inputList.push(input);
    const bytesPerMegabyte = 1048576;

    input.addEventListener('change', (event) => {
      let check = false;
      const file = event.target.files[0];
      const fileType = file.type;
      // console.log(file);

      let checkFileType = false;
      fileMIMETypeList.forEach(MIMEType => {
        if (fileType === MIMEType) {
          checkFileType = true;
        };
      });

      if (checkFileType === false) {
        let errMessage =
          `The ${inputName} file extension must be a value in the list:`;
        fileMIMETypeList.forEach(MIMEType => {
          errMessage += ` ${MIMEType.split('/').pop().toUpperCase()},`;
        });

        messageContainer.innerHTML = errMessage.slice(0, -2);

      } else if (file.size < (minMbSize * bytesPerMegabyte)) {
        messageContainer.innerHTML =
          `The ${inputName} file size must greater than ${minMbSize} MB`;

      } else if (file.size > (maxMbSize * bytesPerMegabyte)) {
        messageContainer.innerHTML =
          `The ${inputName} file size must lesser than ${maxMbSize} MB`;

      } else {
        check = true;
      };

      this.changeInputStatus(
        input,
        messageContainer,
        check
      );
      this.changeButtonStatus();
    });
  }

  addDateInputValidator (
    input = Node(),
    inputName = String(),
    messageContainer = Node(),
    min = {
      day: Number(),
      month: Number(),
      year: Number(), // >= 100 - recommend
    },
    max = {
      day: Number(),
      month: Number(),
      year: Number(),
    },
  ) { 
    this.inputList.push(input);

    const minDateTime = new Date(min.year, (min.month - 1), min.day).getTime();
    const maxDateTime = new Date(max.year, (max.month - 1), max.day).getTime();

    const validateDate = () => {
      const inputValue = input.value;
      let check = false;

      if (inputValue === '') {
        messageContainer.innerHTML = `The ${inputName} must be a valid date`;

      } else {
        const inputDate = inputValue.split(/\D/);
        const inputYear = Number(inputDate[0]);
        const inputMonth = Number(inputDate[1]) - 1;
        const inputDay = Number(inputDate[2]);

        const inputDateTime = new Date(inputYear, inputMonth, inputDay).getTime();

        if (inputDateTime < minDateTime || (inputYear < 100 && min.year >= 100)) {
          const minDate = `${min.day}/${min.month}/${min.year}`;
          messageContainer.innerHTML = `The ${inputName} must greater than ${minDate}`;

        } else if (inputDateTime > maxDateTime) {
          const maxDate = `${max.day}/${max.month}/${max.year}`;
          messageContainer.innerHTML = `The ${inputName} must lesser than ${maxDate}`;

        } else {
          check = true;
        };
      };

      this.changeInputStatus(
        input,
        messageContainer,
        check
      );
      this.changeButtonStatus();
    }

    input.addEventListener('blur', validateDate);
    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        validateDate();
      };
    });
  }

  addRetypeInputValidator (
    modelInput = Node(),
    modelInputName = String(),
    input = Node(),
    inputName = String(),
    messageContainer = Node()
  ) {
    this.inputList.push(input);
    let startCheck = false;

    let check;

    const checkRetype = () => {
      check = (input.value === modelInput.value);

      if (check === false) {
        messageContainer.innerHTML =
          `The ${inputName} must be like the ${modelInputName}`;
      };

      this.changeInputStatus(
        input,
        messageContainer,
        check,
      );
      this.changeButtonStatus();
    }

    modelInput.addEventListener('change', () => {
      if (startCheck === true) {
        checkRetype();
      };
    });

    input.addEventListener('change', () => {
      startCheck = true;
      checkRetype();
    });
  }

  checkDuplicateValidator (
    input = Node(),
    inputName = String(),
    messageContainer = Node(),
    dataList = [String()],
    expectedResult = Boolean(),
    ignoreCase = Boolean(),
    validateOverride = Boolean()
  ) {
    input.setAttribute(
      'data-duplicate',
      JSON.stringify(dataList)
    );

    const checkDuplicate = (inputValue = String()) => {
      const data = JSON.parse(input.dataset.duplicate);

      if (ignoreCase === true) {
        inputValue = inputValue.toLowerCase();
        data.forEach((value, index, data) => {
          data[index] = value.toLowerCase();
        });
      };

      let check;
      if (expectedResult === true) {
        check = false;
        data.forEach(value => {
          if (inputValue === value) {
            check = true;
          };
        });

      } else if (expectedResult === false) {
        check = true;
        data.forEach(value => {
          if (inputValue === value) {
            check = false;
          };
        });
      };

      if (check === false && expectedResult === false) {
        messageContainer.innerHTML = `The ${inputName} is exist`;

      } else if (check === false && expectedResult === true) {
        messageContainer.innerHTML = `The ${inputName} is not exist`;
      };

      this.changeInputStatus(
        input,
        messageContainer,
        check
      );
      this.changeButtonStatus();
    }

    if (validateOverride === false) {
      this.inputList.push(input);
      input.addEventListener('change', () => {
        checkDuplicate(input.value);
      });

    } else {
      input.addEventListener('change', () => {
        if (input.classList.contains(this.inputValidClass)) {
          checkDuplicate(input.value);
        };
      });
    };
  }
  changeDuplicateValue (
    input = Node(),
    value = String(),
    exist = Boolean()
  ) {
    const dataList = JSON.parse(input.dataset.duplicate);

    if (exist === true) {
      dataList.push(value);

    } else {
      dataList.splice(dataList.indexOf(value), 1);
    };

    input.setAttribute(
      'data-duplicate',
      JSON.stringify(dataList)
    );
  }

  createSubmitButtonEvent (
    passedEvent = Function(),
    lockSubmitBtn = Boolean()
  ) {
    if (lockSubmitBtn === true) {
      this.submitButton.setAttribute('disabled', 'true');
    } else {
      this.checkValidate = true;

      this.inputList.forEach((input) => {
        input.classList.add(this.inputValidClass);
      });
    };

    this.submitButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (this.checkValidate === true) {
        passedEvent();
      };
    });
  }

  resetForm (form = Node()) {
    form.reset();

    this.inputList.forEach((input) => {
      input.classList.remove(this.inputValidClass);
    });

    this.changeButtonStatus();
  }
}