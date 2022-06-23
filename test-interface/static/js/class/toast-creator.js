export class ToastCreator { 
  constructor (
    verticalAlign = 'top' || 'bottom',
    verticalOffset = Number(), // px
    horizontalAlign = 'left' || 'right',
    horizontalOffset = Number(), // px
  ) {
    this.verticalAlign = verticalAlign;
    this.verticalOffset = verticalOffset;
    this.horizontalAlign = horizontalAlign;
    this.horizontalOffset = horizontalOffset;
  }

  createToast (
    type = 'success' || 'danger' || 'warning' || 'info',
    message = String(),
    displayTime = Number() // seconds
  ) {
    const documentBody = document.body;
    const colorClass = `toast-${type}`;

    let icon;
    switch (type) {
      case 'success':
        icon = '<i class="fa-solid fa-check"></i>';
        break;
      case 'danger':
        icon = '<i class="fa-solid fa-xmark"></i>';
        break;
      case 'warning':
        icon = '<i class="fa-solid fa-exclamation"></i>';
        break;
      case 'info':
        icon = '<i class="fa-solid fa-question"></i>';
        break;
    };

    const toast = document.createElement('div');
    toast.setAttribute('class', `toast ${colorClass} js-toastify`);
    toast.innerHTML = `
      <div class="toast-icon">
        ${icon}
      </div>
      <div class="toast-message">
        ${message}
      </div>
      <div class="toast-close">
        <i class="fa-solid fa-xmark"></i>
      </div>
    `;

    const currentToastList = document.querySelectorAll('.js-toastify');
    let toastVerticalOffset = this.verticalOffset;
    if (currentToastList.length > 0) {
      currentToastList.forEach(currentToast => {
        toastVerticalOffset += (this.verticalOffset + currentToast.offsetHeight);
      });
    };

    toast.setAttribute('style', `
      ${this.horizontalAlign}: ${this.horizontalOffset}px;
      ${this.verticalAlign}: ${toastVerticalOffset}px;
    `);
    documentBody.appendChild(toast);

    const removeToast = () => {
      toast.style[this.horizontalAlign] = `-${toast.offsetWidth}px`;
      toast.style.opacity = 0.2;

      setTimeout(() => {
        let nextToast = toast.nextElementSibling;
        while (nextToast) {
          // console.log(nextToast.style[toastVerticalAlign]);

          const nextToastVerticalOffset = Number(nextToast.style[this.verticalAlign].slice(0, -2));
          nextToast.style[this.verticalAlign] =
            `${nextToastVerticalOffset - toast.offsetHeight - this.verticalOffset}px`;

          nextToast = nextToast.nextElementSibling;
        };
        documentBody.removeChild(toast);
      }, 200);
    };

    const removeToastTimeout = setTimeout(() => {
      removeToast();
    }, (displayTime * 1000));

    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(removeToastTimeout);
      removeToast();
    });
  }
}