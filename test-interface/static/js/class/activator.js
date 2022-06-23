class Activator {
  constructor(activeClass = String()) {
    this.activeClass = activeClass;
  }
}

export class SingleActivator extends Activator {
  constructor(activeClass = String(), targetElement = Node()) {
    super(activeClass);
    this.targetElement = targetElement;
  }

  createEvent(element = Node(), event = String()) {
    element.addEventListener(event, () => {
      this.targetElement.classList.toggle(this.activeClass);
    });
  }
}

export class Test extends Activator {
  constructor(activeClass = String()) {
    super(activeClass);
  }

  alertClass() {
    alert(this.activeClass);
  }
}

export class MultipleActivator extends Activator {
  constructor(activeClass = String(), targetElementList = [Node()]) {
    super(activeClass);
    this.targetElementList = targetElementList;
  }

  createEvent(element = Node(), event = String()) {
    element.addEventListener(event, () => {
      this.targetElementList.forEach((elementItem) => {
        elementItem.classList.remove(this.activeClass);
      });
      element.classList.toggle(this.activeClass);
    });
  }
}
