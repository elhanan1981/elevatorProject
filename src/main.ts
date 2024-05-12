import { Building } from './building';
import { Factory } from './factory';

function main() {
  let buildings: Building[] = [];
  for (let i = 0; i < 20; i++) {
    buildings.push(Factory.createBuilding(3, 20));
  }
}

main();
