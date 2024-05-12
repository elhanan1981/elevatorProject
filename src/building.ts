import { Floor } from './floor';
import { Elevator } from './elevator';
import { Factory } from './factory';

export class Building {
  floors: Floor[];
  elevators: Elevator[];

  buildingElement: HTMLDivElement;
  floorsElement: HTMLDivElement;
  elevatorsElement: HTMLDivElement;

  //Initializes the building elements, creates floors and elevators using a factory method,
  // and appends them to the screen
  constructor(elevatorsNumber: number, floorsNumber: number) {
    this.initializeElements();

    this.floors = Factory.createFloors(
      floorsNumber,
      this.floorsElement,
      this.onClick,
    );
    this.elevators = Factory.createElevators(
      elevatorsNumber,
      this.elevatorsElement,
    );

    this.buildingElement.appendChild(this.floorsElement);
    this.buildingElement.appendChild(this.elevatorsElement);

    document.getElementById('screen')?.appendChild(this.buildingElement);
  }

  // Creates and initializes building, floors,
  // and elevators elements with appropriate class names;
  initializeElements() {
    this.buildingElement = document.createElement('div');
    this.floorsElement = document.createElement('div');
    this.elevatorsElement = document.createElement('div');

    this.buildingElement.className = 'building';
    this.floorsElement.className = 'floors';
    this.elevatorsElement.className = 'elevators';
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
    let minTimeArrived = this.elevators[0].getTimeUntilArrived(floor_number);

    for (let i = 1; i < this.elevators.length; i++) {
      let iTimeArrived = this.elevators[i].getTimeUntilArrived(floor_number);

      if (iTimeArrived < minTimeArrived) {
        suitableElevator = i;
        minTimeArrived = iTimeArrived;
      }
    }
    return suitableElevator;
  }
}
