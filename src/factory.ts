import { Building } from './building';
import { Floor } from './floor';
import { Elevator } from './elevator';

export class Factory {
  //Creates and returns an array of floor instances
  static createFloors(
    floorsNumber: number,
    parentElement: HTMLElement,
    callBack: (currentFloor: Floor) => void,
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
    parentElement: HTMLElement,
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
  static createHtmlElement(element: Element, type: string, className: string) {
    element = document.createElement(type);
    element.className = className;
  }
}
