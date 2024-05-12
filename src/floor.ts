import { AudioElement } from './audio';
import { Button } from './button';
import { Timer } from './timer';

export class Floor {
  button: Button;
  timer: Timer;
  audio: AudioElement;
  divElement: HTMLDivElement;
  onClickButton: (current_floor: Floor) => void;

  //Initializes a new floor object with floor number, parent HTML element,
  // draw line option, and click callback, appending it to the DOM
  constructor(
    floorNumber: number,
    parentElement: HTMLElement,
    drawLine: boolean,
    callBack: (current_floor: Floor) => void,
  ) {
    this.onClickButton = callBack;
    this.createObjects(floorNumber, drawLine);
    parentElement.appendChild(this.divElement);
  }

  //Dynamically creates DOM elements for a floor, including a button, timer, and audio elements,
  //based on specified parameters like floor number and whether to draw a line
  createObjects(floorNumber: number, drawLine: boolean) {
    this.divElement = document.createElement('div');
    this.divElement.className = 'floor';

    this.drawBlackLine(drawLine, this.divElement);

    let warpTimerButton = document.createElement('div');
    warpTimerButton.className = 'warp_timer_button';

    this.button = new Button(
      floorNumber,
      warpTimerButton,
      this.handleButtonClick,
    );
    this.timer = new Timer(warpTimerButton, this.handleElevArrival);
    this.divElement.appendChild(warpTimerButton);

    this.audio = new AudioElement();
  }

  //Sets the timer counter to the time until elevator will arrived and starts the timer
  startTimer(time: number) {
    this.timer.setCounter(time);
  }

  //Plays the arrival sound and triggers the arrival action for the button when called
  handleElevArrival = () => {
    this.audio.audio.play();
    this.button.handleArrival();
  };

  //Invokes the specified callback function with the current floor
  //instance when a button click event occurs.
  handleButtonClick = () => {
    this.onClickButton(this);
  };

  //Conditionally creates and appends a black line element to
  //the parent element based on the Draw_line parameter's value
  drawBlackLine(DrawLine: boolean, parentElement: Element) {
    if (DrawLine) {
      let blackLineElement = document.createElement('div');
      blackLineElement.className = 'black_line';
      parentElement.appendChild(blackLineElement);
    }
  }
}
