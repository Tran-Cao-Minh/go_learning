class CartDataManager {
  static getInstance() {
    if (!(this.CartDataManager instanceof CartDataManager)) {
      this.CartDataManager = new CartDataManager();
    }

    return this.CartDataManager;
  }

  // getStorage() {
  //   // const LocalStorage = require('../../../node_modules/node').LocalStorage;
  //   // localStorage = new LocalStorage('./scratch');

  //   if (typeof this.storage === 'undefined') {
  //     this.storage = [];
  //   }

  //   return this.storage;
  // }

  getCartData() {
    let cartData = [];
    if (localStorage.getItem('cartData') !== null) {
      cartData = JSON.parse(localStorage.getItem('cartData'));
    }
    return cartData;
  }

  setCartData(cartData) {
    localStorage.setItem('cartData', JSON.stringify(cartData));
  }

  addItemToCart(
    id = String(),
    qty = Number(),
    maxQty = Number(),
    successFn = Function(),
    failedFn = Function()
  ) {
    const cartData = this.getCartData();
    // console.log(cartData);

    let isExisted = false;
    cartData.forEach(cartItem => {
      if (cartItem.id === id) {
        isExisted = true;

        if ((cartItem.qty + qty) <= maxQty) {
          cartItem.qty += qty;
          this.setCartData(cartData);
          successFn();

        } else {
          failedFn();
        }
      }
    });

    if (isExisted === false) {
      cartData.push({
        id: id,
        qty: qty
      });
      this.setCartData(cartData);
      successFn();
    }
  }

  increaseItemInCart(
    id = String(),
    qty = Number(),
    maxQty = Number(),
    successFn = Function(),
    failedFn = Function()
  ) {
    const cartData = this.getCartData();

    cartData.forEach(cartItem => {
      if (cartItem.id === id) {
        if ((cartItem.qty + qty) <= maxQty) {
          cartItem.qty += qty;
          this.setCartData(cartData);
          successFn();

        } else {
          failedFn();
        }
      }
    });
  }
}