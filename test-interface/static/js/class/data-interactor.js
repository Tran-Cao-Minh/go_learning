class DataInteractor {
  constructor(
    fetchLink = String(),
    fetchMethod = String()
  ) {
    this.fetchLink = fetchLink;
    this.fetchMethod = fetchMethod;
  }
}

export class DataReader extends DataInteractor {
  constructor(
    fetchLink = String()
  ) {
    super(`${fetchLink}.json`, 'GET');
  }

  readData(
    callbackFn = Function(data = Object()),
  ) {
    fetch(this.fetchLink, {
        method: this.fetchMethod,
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error = ' + res.status);
        };

        return res.json();

      }).then((data) => {
        callbackFn(data);
      })
    // .catch((error) => {
    //   console.log('error: ' + error);
    // });
  }
}

export class DataDeleter extends DataInteractor {
  constructor(
    fetchLink = String()
  ) {
    super(fetchLink, 'DELETE');
  }

  deleteData(
    id = String(),
    callbackFn = Function(data = Object()),
  ) {
    const fetchLink = `${this.fetchLink}/${id}.json`;
    // console.log(fetchLink);

    fetch(fetchLink, {
        method: this.fetchMethod,
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error('error = ' + res.status);
        };

        return res.json();

      }).then((data) => {
        callbackFn(data);
      })
    // .catch((error) => {
    //   console.log('error: ' + error);
    // });
  }
}

export class DataAdder extends DataInteractor {
  constructor(fetchLink = String()) {
    super(fetchLink, 'POST');
  }

  addData (
    formData = Object(),
    successFn = Function(),
    failedFn = Function()
  ) {
    fetch(`${this.fetchLink}.json`, {
      method: this.fetchMethod,
      body: formData
    })
      .then((res) => {
        if (!res.ok) {
          failedFn();
          throw new Error('error = ' + res.status);
        };

        return res.json();

      }).then(() => {
        successFn();
      });
    // .catch((error) => {
    //   console.log('error: ' + error);
    // });
  }
}

export class DataUpdater extends DataInteractor {
  constructor(fetchLink = String()) {
    super(fetchLink, 'PUT');
  }

  updateData (
    id = String(),
    formData = JSON().stringify(Object()) | `"${String()}"` | Number(),
    successFn = Function(),
    failedFn = Function()
  ) {
    fetch(`${this.fetchLink + id}.json`, {
      method: this.fetchMethod,
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          failedFn();
          throw new Error('error = ' + res.status);
        };

        return res.json();

      }).then(() => {
        successFn();
      });
    // .catch((error) => {
    //   console.log('error: ' + error);
    // });
  }
}