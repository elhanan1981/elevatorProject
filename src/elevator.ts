import { Settings } from './settings';
export class Elevator {
  timeAvailable: number;
  destination: number;
  img: HTMLImageElement;

  //Sets up a new elevator instance with current time availability,
  //initial destination, and adds its image to the DOM.
  constructor(parentElement: HTMLElement) {
    this.timeAvailable = Date.now();
    this.destination = 0;
    this.img = document.createElement('img');
    this.img.className = 'elevator';
    this.img.src = 'elv.png';

    parentElement.appendChild(this.img);
  }

  // Initiates elevator movement towards a specified floor, scheduling the movement with a
  //transition time based on distance and updating time availability
  work(floorNumber: number) {
    let transitionTime = this.getDistance(floorNumber) * Settings.floorTime;

    setTimeout(() => {
      this.move(floorNumber, transitionTime);
    }, this.getTimeUntilAvailable());

    this.updateAvailableTime(transitionTime);
    this.destination = floorNumber;
  }

  //Animates the elevator's vertical movement to a specified floor using CSS transitions,
  // adjusting the transition time and translation accordingly
  private move(floorNumber: number, transitionTime: number) {
    const translateY = -Settings.floorSize * floorNumber;
    this.img.style.transition = `transform ${transitionTime}s ease`;
    this.img.style.transform = `translateY(${translateY}px)`;
  }

  //Updates the time available for the elevator based on the transition
  // time and adds additional time for preparation and travel.
  private updateAvailableTime(transitionTime: number) {
    let addedTime =
      (transitionTime + Settings.floorWaitingTime) * Settings.milliSecond;
    if (!this.isWorking()) {
      this.timeAvailable = Date.now();
    }
    this.timeAvailable += addedTime;
  }

  //Calculates and returns the absolute distance between the elevator's
  // current destination and a specified floor number
  private getDistance(floorNumber: number) {
    return Math.abs(this.destination - floorNumber);
  }

  //Checks if the elevator is currently working or available based on
  //the comparison between its available time and the current time
  private isWorking(): boolean {
    return this.timeAvailable > Date.now();
  }

  //Calculates and returns the time until the elevator becomes available,
  // considering its current working status and available time
  private getTimeUntilAvailable(): number {
    let timeUntilAvailable = 0;
    if (this.isWorking()) {
      timeUntilAvailable = this.timeAvailable - Date.now();
    }
    return timeUntilAvailable;
  }

  //Calculates estimated arrival time to a floor, factoring in availability time and half of the distance.
  public getTimeUntilArrived(floorNumber: number): number {
    const timeArrivedAsSecond =
      this.getTimeUntilAvailable() / Settings.milliSecond +
      this.getDistance(floorNumber) * Settings.floorTime;
    return timeArrivedAsSecond;
  }
}
