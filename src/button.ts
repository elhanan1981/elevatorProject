import { Settings } from './settings';
export class Button {
  floorNumber: number;
  flag: boolean;
  img: HTMLElement;

  //Initializes a new instance of the Button class with the specified floor number,
  // parent HTML element, and callback function, and appends the button element to the parent element in the DOM.
  constructor(
    floorNumber: number,
    parentElement: HTMLElement,
    callBack: () => void,
  ) {
    this.floorNumber = floorNumber;
    this.flag = false;
    this.initImgElement(callBack);

    parentElement.appendChild(this.img);
  }

  //Creates and configures the button's HTML element, sets its class and text content,
  //and assigns a click event handler that triggers the button's work method when clicked
  initImgElement(call_bake: () => void) {
    this.img = document.createElement('button');
    this.img.className = 'metal linear';
    this.img.textContent = `${this.floorNumber}`;
    this.img.onclick = () => {
      this.handleClick(call_bake);
    };
  }

  //Executes a callback function and updates button status if not flagged,
  //triggering a request and changing the flag.
  handleClick(callBack: () => void) {
    if (!this.flag) {
      callBack();
      this.toggleFlag();
      this.changeColor(Settings.buttonPressed);
    }
  }

  //Changes the button's color to black upon arrival, then after a delay, toggles the button's status.
  handleArrival() {
    this.changeColor(Settings.buttonUnPressed);
    setTimeout(() => {
      this.toggleFlag();
    }, 2000);
  }

  //Toggles the flag status of the button
  toggleFlag() {
    this.flag = !this.flag;
  }

  //Changes the button's color to the specified color
  changeColor(color: string) {
    this.img.style.color = color;
  }
}
