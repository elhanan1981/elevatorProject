import { Settings } from './settings';
export class Timer {
  counter: number;
  divElement: HTMLDivElement;
  callBack: () => void;

  constructor(parentElement: HTMLDivElement, callBack: () => void) {
    this.callBack = callBack;
    this.divElement = document.createElement('div');
    this.divElement.className = 'timer';
    parentElement.appendChild(this.divElement);
  }

  //Sets the timer's counter to a specified time
  setCounter(newTime: number) {
    this.counter = newTime;
    this.counting();
  }

  //Starts the timer's countdown, updating the timer's counter every half a second.
  counting() {
    let intervalId = setInterval(() => {
      this.counter = this.counter - Settings.decimal;
      let roundedCounter = this.counter.toFixed(1);
      this.divElement.textContent = `${roundedCounter}`;
      if (this.counter < 0) {
        this.ending(intervalId);
      }
    }, Settings.reUpdateTime);
  }

  //Ends the timer's countdown and calls the callback function.
  ending(intervalId: number) {
    clearInterval(intervalId);
    this.divElement.textContent = '';
    this.callBack();
  }
}
