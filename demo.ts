import { DateGenerator } from './lib/generators';
import { PersonRole } from './lib/interfaces';
import './lib/utils/date.utils';

const ref = new Date('2021-01-01T00:00:00.000Z');

const gen = new DateGenerator(ref);

for (const i of new Array(50)) {
  const date = Date.fromFifaDate(gen.birthDate(PersonRole.Player));
  console.log(date, date.age(ref));
}
