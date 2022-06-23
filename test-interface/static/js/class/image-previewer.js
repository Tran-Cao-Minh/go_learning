export class SingleImagePreviewer {
  constructor (input = Node()) {
    this.input = input;
  }

  addShowImageEvent (img = Node()) {
    this.input.addEventListener('change', (event) => {
      let imgFile = event.target.files[0];

      let fileReader = new FileReader();
      fileReader.readAsDataURL(imgFile);

      fileReader.addEventListener('load', () => {
        let imgData = fileReader.result;
        img.src = imgData;

        this.input.setAttribute('data-base64', imgData);
      });
    });
  };

  addShowImageFileNameEvent (imgNameContainer = Node()) {
    this.input.addEventListener('change', (event) => {
      let imgFile = event.target.files[0];

      let imgFileName = imgFile.name;
      imgNameContainer.innerHTML = imgFileName;
    });
  };
}