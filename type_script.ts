class Building {
  floors: Floor[];
  elevators: Elevator[];

  buildingElement: HTMLDivElement;
  floorsElement: HTMLDivElement;
  elevatorsElement: HTMLDivElement;

  //Initializes the building elements, creates floors and elevators using a factory method,
  // and appends them to the screen
  constructor(elevatorsNumber: number, floorsNumber: number) {
    this.initializeElements();

    this.floors = FloorsFactory.createFloors(
      floorsNumber,
      this.floorsElement,
      this.onClick
    );
    this.elevators = FloorsFactory.createElevators(
      elevatorsNumber,
      this.elevatorsElement
    );

    this.buildingElement.appendChild(this.floorsElement);
    this.buildingElement.appendChild(this.elevatorsElement);

    document.getElementById("screen")?.appendChild(this.buildingElement);
  }

  // Creates and initializes building, floors,
  // and elevators elements with appropriate class names;
  initializeElements() {
    this.buildingElement = document.createElement("div");
    this.floorsElement = document.createElement("div");
    this.elevatorsElement = document.createElement("div");

    this.buildingElement.className = "building";
    this.floorsElement.className = "floors";
    this.elevatorsElement.className = "elevators";
  }

  //Handles click events by determining the most suitable elevator to the specified floor,
  //setting timer counters, and instructing the selected elevator to work towards the specified floor.
  onClick = (currentFloor: Floor) => {
    let floorNumber = currentFloor.button.floorNumber;
    let suitElevator = this.findSuitableElevator(floorNumber);

    let timeUntilArrived =
      this.elevators[suitElevator].getTimeUntilArrived(floorNumber);
      currentFloor.startTimer(timeUntilArrived);

    this.elevators[suitElevator].work(floorNumber);
  };

  //Determines the most suitable elevator for a given floor by comparing the time
  //until arrival for each elevator and returning the index of the best option
  findSuitableElevator(floor_number: number) {
    let suitableElevator = 0;
    let minTimeArrived =
      this.elevators[0].getTimeUntilArrived(floor_number);

    for (let i = 1; i < this.elevators.length; i++) {
      let iTimeArrived =
        this.elevators[i].getTimeUntilArrived(floor_number);

      if (iTimeArrived < minTimeArrived) {
        suitableElevator = i;
        minTimeArrived = iTimeArrived;
      }
    }
    return suitableElevator;
  }
}

class Floor {
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
    callBack: (current_floor: Floor) => void
  ) {
    this.onClickButton = callBack;
    this.createObjects(floorNumber, drawLine);
    parentElement.appendChild(this.divElement);
  }

  //Dynamically creates DOM elements for a floor, including a button, timer, and audio elements,
  //based on specified parameters like floor number and whether to draw a line
  createObjects(floorNumber: number, drawLine: boolean) {
    this.divElement = document.createElement("div");
    this.divElement.className = "floor";

    this.drawBlackLine(drawLine, this.divElement);

    let warpTimerButton = document.createElement("div");
    warpTimerButton.className = "warp_timer_button";

    this.button = new Button(
      floorNumber,
      warpTimerButton,
      this.handleButtonClick
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
      let blackLineElement = document.createElement("div");
      blackLineElement.className = "black_line";
      parentElement.appendChild(blackLineElement);
    }
  }
}

class Button {
  floorNumber: number;
  flag: boolean;
  img: HTMLElement;

  //Initializes a new instance of the Button class with the specified floor number,
  // parent HTML element, and callback function, and appends the button element to the parent element in the DOM.
  constructor(
    floorNumber: number,
    parentElement: HTMLElement,
    callBack: () => void
  ) {
    this.floorNumber = floorNumber;
    this.flag = false;
    this.initImgElement(callBack);

    parentElement.appendChild(this.img);
  }

  //Creates and configures the button's HTML element, sets its class and text content,
  //and assigns a click event handler that triggers the button's work method when clicked
  initImgElement(call_bake: () => void) {
    this.img = document.createElement("button");
    this.img.className = "metal linear";
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

class AudioElement {
  audio: HTMLAudioElement;
  constructor() {
    this.audio = document.createElement("audio");
    this.audio.src = "./ding.mp3";
  }
}

class Elevator {
  timeAvailable: number;
  destination: number;
  img: HTMLImageElement;

  //Sets up a new elevator instance with current time availability,
  //initial destination, and adds its image to the DOM.
  constructor(parentElement: HTMLElement) {
    this.timeAvailable = Date.now();
    this.destination = 0;
    this.img = document.createElement("img");
    this.img.className = "elevator";
    this.img.src = "./elv.png";

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
    let addedTime = (transitionTime + Settings.floorWaitingTime) * Settings.milliSecond;
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

class FloorsFactory {
  //Creates and returns an array of floor instances
  static createFloors(
    floorsNumber: number,
    parentElement: HTMLElement,
    callBack: (currentFloor: Floor) => void
  ): Floor[] {
    let floors: Floor[] = [];
    for (var i = floorsNumber; i >= 0; i--) {
      floors.push(new Floor(i, parentElement, i != floorsNumber, callBack));
    }
    return floors;
  }

  //Creates and returns an array of elevator instances
  static createElevators(
    elevatorsNumber: number,
    parentElement: HTMLElement
  ): Elevator[] {
    let elevators: Elevator[] = [];
    for (var i = 0; i < elevatorsNumber; i++) {
      elevators.push(new Elevator(parentElement));
    }
    return elevators;
  }

  //Creates and returns a building instance
  static createBuilding(floorsNum: number, elevatorsNum: number): Building {
    return new Building(floorsNum, elevatorsNum);
  }

  //Creates an html element
  static createHtmlElement(element:Element,type:string,className:string) {
    element = document.createElement(type);
    element.className = className;
  }
}

class Timer {
  counter: number;
  divElement: HTMLDivElement;
  callBack: () => void;

  constructor(parentElement: HTMLDivElement, callBack: () => void) {
    this.callBack = callBack;
    this.divElement = document.createElement("div");
    this.divElement.className = "timer";
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
  ending(intervalId : number) {
    clearInterval(intervalId);
    this.divElement.textContent = "";
    this.callBack();
  }
}

class Settings{
  static floorWaitingTime = 2;
  static floorTime = 0.5;
  static milliSecond = 1000;

  static floorSize = 110;
  static blackLineSize = 7;

  static decimal = 0.1;
  static reUpdateTime = 100;

  static buttonPressed = "green";
  static buttonUnPressed = "black";
}

function main() {
  let buildings: Building[] = [];
  for (let i = 0; i < 20; i++) {
    buildings.push(FloorsFactory.createBuilding(3, 20));
  }
}

main();
