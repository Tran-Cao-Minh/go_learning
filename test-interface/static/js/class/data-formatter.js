export class CurrencyFormatter {
  constructor(
    locales = String(),
    currency = String()
  ) {
    this.locales = locales;
    this.currency = currency;
  }

  formatCurrency(number = Number()) {
    return number.toLocaleString(this.locales, {
      style: 'currency',
      currency: this.currency
    });
  }
};

export class DateFormatter {
  constructor(
    locales = String(),
    options = {
      year: String(),
      month: String(),
      day: String(),
    }
  ) {
    this.locales = locales;
    this.options = options;
  }

  formatDate(date = String()) {
    date = new Date(date);
    return date.toLocaleDateString(this.locales, {
      year: this.options.year,
      month: this.options.month,
      day: this.options.day,
    });
  }
}

export class ImageFormatter {
  constructor(
    classList = Array()
  ) {
    this.classValue = (() => {
      let classValue = '';

      if (classList.length > 0) {
        classList.forEach((item) => {
          classValue += ` ${item}`;
        });
        classValue.slice(0, 1);
      };

      return classValue;
    })();
  }

  formatImage(
    base64 = String(),
    altText = String()
  ) {
    return `<img class="${this.classValue}" ` +
      `src="${base64}" alt="${altText}">`;
  }
};

export class LinkFormatter {
  constructor(
    linkPrefix = String(),
    classList = Array(String()),
    icon = String()
  ) {
    this.linkPrefix = linkPrefix;
    this.icon = icon;

    this.classValue = (() => {
      let classValue = '';

      if (classList.length > 0) {
        classList.forEach((item) => {
          classValue += ` ${item}`;
        });
        classValue.slice(0, 1);
      };

      return classValue;
    })();
  }

  formatLink(
    id = String()
  ) {
    return `<a class="${this.classValue}" href="${this.linkPrefix + id}"> ${this.icon}</a>`;
  }
};

export class ButtonFormatter {
  constructor(
    classList = Array(),
    icon = String()
    ) {
    this.icon = icon;

    this.classValue = (() => {
      let classValue = '';

      if (classList.length > 0) {
        classList.forEach((item) => {
          classValue += ` ${item}`;
        });
        classValue.slice(0, 1);
      };

      return classValue;
    })();
  }

  formatButton (
    dataList = [{
      key: String(),
      value: String()
    }]
  ) {
    let dataAttribute = '';
    dataList.forEach(data => {
      dataAttribute += ` data-${data.key}="${data.value}"`;
    });
    return `<button class="${this.classValue}" type="button"${dataAttribute}> ${this.icon}</button>`;
  }
};