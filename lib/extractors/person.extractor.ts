import { ReadWriteStreamBuilder } from '../actions';
import { FifaConfig, fifaConfigFactory } from '../fifa-config';
import {
  AttributeByGender,
  AttributeGender,
  Fifa,
  Gender,
  HeadClassCode,
  KeyValueFrequency,
  Person,
  PersonAttribute,
  Table
} from '../interfaces';

type FilterByGenderFn = (person: Person) => boolean;
type FilterByHeadClassFn = (person: Person) => boolean;
type ReduceFn = (acc: KeyValueFrequency, cur: Person) => {};
type PersonAttributesByGender = { [key: string]: AttributeByGender };

export class PersonExtractor {
  private config: FifaConfig;

  constructor(targetFifa: Fifa) {
    this.config = fifaConfigFactory(targetFifa);
  }

  public async getAttributes(inputFolder: string): Promise<PersonAttributesByGender> {
    const players = await this.readTable(inputFolder, Table.Players);
    const referees = await this.readTable(inputFolder, Table.Referee);

    return Object.values(PersonAttribute).reduce(
      (acc, attr) => ({
        ...acc,
        [attr]: this.getGroupedAttribute(players, referees, attr)
      }),
      {}
    );
  }

  public async getAttribute(inputFolder: string, attribute: PersonAttribute): Promise<AttributeByGender> {
    const players = await this.readTable(inputFolder, Table.Players);
    const referees = await this.readTable(inputFolder, Table.Referee);
    return this.getGroupedAttribute(players, referees, attribute);
  }

  private getGroupedAttribute(players: Person[], referees: Person[], attribute: PersonAttribute): AttributeByGender {
    switch (attribute) {
      case PersonAttribute.HeadTypeCode:
        return this.groupedAttribute(
          players.filter(this.filterByHeadClassFn(HeadClassCode.Generic)),
          referees.filter(this.filterByHeadClassFn(HeadClassCode.Generic)),
          attribute
        );
      default:
        return this.groupedAttribute(players, referees, attribute);
    }
  }

  private groupedAttribute(players: Person[], referees: Person[], attribute: PersonAttribute): AttributeByGender {
    const playersAttribute = this.filterAttribute(
      players.filter(this.filterByHeadClassFn(HeadClassCode.Generic)),
      attribute
    );
    const refereesAttribute = this.filterAttribute(
      referees.filter(this.filterByHeadClassFn(HeadClassCode.Generic)),
      attribute
    );
    return {
      man: this.mergeTables(refereesAttribute, playersAttribute, 'man').man,
      woman: this.mergeTables(refereesAttribute, playersAttribute, 'woman').woman
    };
  }

  private filterAttribute(persons: Person[], attribute: PersonAttribute): AttributeByGender {
    const woman = persons.filter(this.filterByGenderFn(Gender.Woman)).reduce(this.reduceFn(attribute), {});

    const man = persons.filter(this.filterByGenderFn(Gender.Man)).reduce(this.reduceFn(attribute), {});

    return { man, woman };
  }

  private async readTable(inputFolder: string, table: Table): Promise<Person[]> {
    const list: Person[] = [];
    return new Promise(async (resolve, reject) =>
      new ReadWriteStreamBuilder(inputFolder, table, this.config[table])
        .actionOnData((data: any) => list.push(data))
        .onFinish(() => resolve(list))
        .onError(() => reject(list))
    );
  }

  private filterByHeadClassFn(headClassCode: HeadClassCode): FilterByHeadClassFn {
    return (p: Person) => p.headclasscode === headClassCode;
  }

  private filterByGenderFn(gender: Gender): FilterByGenderFn {
    return (p: Person) => {
      if (gender === Gender.Woman) {
        return p.gender === Gender.Woman;
      } else {
        return p.gender === null || p.gender === undefined || p.gender === Gender.Man;
      }
    };
  }

  private reduceFn(field: PersonAttribute): ReduceFn {
    return (acc: KeyValueFrequency, cur: Person) => {
      const value = acc[cur[field]];
      return { ...acc, [cur[field]]: value ? value + 1 : 1 };
    };
  }

  private mergeTables(
    source: AttributeByGender,
    target: AttributeByGender,
    genderKey: AttributeGender
  ): AttributeByGender {
    for (const key of Object.keys(source[genderKey])) {
      const value = target[genderKey][key];
      if (value) {
        target[genderKey][key] += source[genderKey][key];
      } else {
        target[genderKey][key] = source[genderKey][key];
      }
    }
    return target;
  }
}
