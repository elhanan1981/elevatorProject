import { Building } from './building';
import { Factory } from './factory';
import { Settings } from './settings';

function main() {
  let buildings: Building[] = [];
  for (let i = 0; i < Settings.amountBuildings; i++) {
    buildings.push(
      Factory.createBuilding(Settings.amountElevators, Settings.amountFloors),
    );
  }
}

main();
