class PopupCreator {
  createPopup(nodeList = [Node()]) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.top = '-100vh';
    popup.style.opacity = 0;

    const popupWrapper = document.createElement('div');
    popupWrapper.classList.add('popup-wrapper');
    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');
    nodeList.forEach(node => {
      popupContent.appendChild(node);
    });

    popupWrapper.appendChild(popupContent);
    popup.appendChild(popupWrapper);

    document.body.appendChild(popup);

    setTimeout(() => {
      popup.style.top = '0';
      popup.style.opacity = 1;
    }, 1);

    popup.addEventListener('click', (event) => {
      if (
        event.target.classList.contains('popup') ||
        event.target.classList.contains('popup-wrapper')
      ) {
        this.removePopup(popup);
      };
    });
  };

  removePopup = (popup = Node()) => {
    popup.style.top = '-100vh';
    popup.style.opacity = 0;
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 675);
  };
}

export class ConfirmDangerActionPopupCreator extends PopupCreator {
  constructor(
    dangerActionContent = String()
  ) {
    super();
    this.dangerActionContent = dangerActionContent;
  }

  initialConfirmDangerActionPopup() {
    this.popupBody = document.createElement('div');
    this.popupBody.classList.add('popup-body');
    this.icon = `
      <div class="popup-icon-wrapper--danger">
        <i class="fa-solid fa-exclamation popup-icon"></i>
      </div>
    `;

    this.popupBody.innerHTML += this.icon;

    this.popupActions = document.createElement('div');
    this.popupActions.classList.add('popup-actions');

    const removeLastPopup = () => {
      let popupList = document.querySelectorAll('.popup');
      let lastPopup = popupList[popupList.length - 1];
      this.removePopup(lastPopup);
    }

    this.dangerActionBtn = document.createElement('button');
    this.dangerActionBtn
      .setAttribute('class', 'btn-danger col-5 mt-4 text-uppercase');
    this.dangerActionBtn.innerHTML = this.dangerActionContent;
    this.dangerActionBtn.addEventListener('click', removeLastPopup);

    this.cancelBtn = document.createElement('button');
    this.cancelBtn
      .setAttribute('class', 'btn-cancel col-5 mt-4 text-uppercase');
    this.cancelBtn.innerHTML = 'Cancel';
    this.cancelBtn.addEventListener('click', removeLastPopup);

    this.popupActions.appendChild(this.dangerActionBtn);
    this.popupActions.appendChild(this.cancelBtn);
  }

  createConfirmDangerActionPopup (
    notification = String(),
    dangerAction = Function()
  ) {
    this.initialConfirmDangerActionPopup();

    this.popupBody.innerHTML += `
      <div class="text text-center mt-2 mb-2 w-full">
        ${notification}
      </div>
    `;

    this.dangerActionBtn.addEventListener('click', dangerAction);

    this.createPopup([
      this.popupBody,
      this.popupActions
    ]);
  };
}