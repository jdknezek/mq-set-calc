import _ from 'lodash';

import weapons from 'data/weapons.csv!./csv';
import armors from 'data/armors.csv!./csv';
import pets from 'data/pets.csv!./csv';
import petsArmors from 'data/armors-pets.csv!./lookup';
import weaponsPets from 'data/pets-weapons.csv!./lookup';
import armorsWeapons from 'data/weapons-armors.csv!./lookup';

parseValues(weapons);
parseValues(armors);
parseValues(pets);

var sets = [];

_.each(weapons, weapon => {
  _.each(armors, armor => {
    _.each(pets, pet => {
      var skills = _.filter([
        armorsWeapons[armor.ARMOR][weapon.WEAPON],
        petsArmors[pet.PET][armor.ARMOR],
        weaponsPets[weapon.WEAPON][pet.PET]
      ]);

      if (skills.length) {
        sets.push({
          distance: Math.max(weapon.DISTANCE, armor.DISTANCE, pet.DISTANCE),
          weapon,
          armor,
          pet,
          skills: skills.sort()
        });
      }
    });
  });
});

export default sets;

function parseValues(items) {
  _.each(items, item => _.each(item, (value, key) => {
    try {
      item[key] = JSON.parse(value);
    } catch (e) {}
  }));
  return items;
}
