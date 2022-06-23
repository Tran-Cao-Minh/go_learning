import { ToastCreator } from './toast-creator.js';
const toastCreator = new ToastCreator(
  'bottom',
  16,
  'right',
  16
);

export default class InputQuantityController {
  static getInstance() {
    if (!(this.InputQuantityController instanceof InputQuantityController)) {
      this.InputQuantityController = new InputQuantityController();
    }

    return this.InputQuantityController;
  }

  createController(
    input = HTMLInputElement(),
    qty = {
      min: Number(),
      max: Number()
    },
    step = Number(),
    handleBtn = {
      decrease: HTMLElement(),
      increase: HTMLElement()
    }
  ) {
    this.qty = qty;

    input.setAttribute('step', String(step));

    const checkValue = () => {
      const inputValue = Number(input.value);
      if (isNaN(inputValue)) {
        input.value = this.qty.min;
        toastCreator.createToast(
          'warning',
          `Your input value must be a number`,
          2
        );

      }else if (inputValue < this.qty.min) {
        input.value = this.qty.min;
        toastCreator.createToast(
          'warning',
          `Your input value must greater than ${this.qty.min}`,
          2
        );

      } else if (inputValue > this.qty.max) {
        input.value = this.qty.max;
        toastCreator.createToast(
          'warning',
          `Your input value must lesser than ${this.qty.max}`,
          2
        );

      } else if ((inputValue / step) % 1 !== 0) {
        let newValue = step * Math.round(inputValue / step);
        if (newValue < this.qty.min) {
          newValue = this.qty.min;
        } else if (newValue > this.qty.max) {
          newValue = this.qty.max;
        }

        input.value = newValue;
        toastCreator.createToast(
          'warning',
          `Your input step must be ${step}`,
          2
        );
      };
    };

    input.addEventListener('input', () => {
      checkValue();
    });

    handleBtn.decrease.addEventListener('click', () => {
      input.value = Number(input.value) - step;
      checkValue();
    });
    handleBtn.increase.addEventListener('click', () => {
      input.value = Number(input.value) + step;
      checkValue();
    });
  }
}