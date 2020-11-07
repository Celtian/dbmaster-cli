import { Config, configFactory } from '../config';
import { Field, Fifa, Table } from '../interfaces';

export interface CompareManagerTableDefinition {
  bothTables: string[];
  firstTable: string[];
  secondTable: string[];
}

export class CompareManager {
  private configFirst: Config;
  private configSecond: Config;

  constructor(private fifaFirst: Fifa, private fifaSecond: Fifa) {
    this.configFirst = configFactory(fifaFirst);
    this.configSecond = configFactory(fifaSecond);
  }

  public compareTableDefinition(table: Table): CompareManagerTableDefinition {
    const tableFirst: Field[] = this.configFirst[table];
    const tableSecond: Field[] = this.configSecond[table];

    const bothTables = tableFirst
      .filter((field) => tableSecond.map((f) => f.name).includes(field.name))
      .map((f) => f.name)
      .sort();
    const firstTable = tableFirst
      .filter((field) => !bothTables.includes(field.name))
      .map((f) => f.name)
      .sort();
    const secondTable = tableSecond
      .filter((field) => !bothTables.includes(field.name))
      .map((f) => f.name)
      .sort();

    return {
      bothTables,
      firstTable,
      secondTable
    };
  }

  public diffTableDefinition(table: Table): any {
    const tableFirst: Field[] = this.configFirst[table];
    const tableSecond: Field[] = this.configSecond[table];

    const bothTables = tableFirst
      .filter((field) => tableSecond.map((f) => f.name).includes(field.name))
      .map((f) => f.name)
      .sort();

    const diff = bothTables
      .filter((fieldName) => {
        const a = tableFirst.find((f) => f.name === fieldName);
        const b = tableSecond.find((f) => f.name === fieldName);
        return (
          a.default !== b.default ||
          a.type !== b.type ||
          (a && a.range && b && b.range && a.range.min !== b.range.min) ||
          (a && a.range && b && b.range && a.range.max !== a.range.max)
        );
      })
      .map((fieldName) => {
        const first = tableFirst.find((f) => f.name === fieldName);
        const second = tableSecond.find((f) => f.name === fieldName);
        return {
          name: fieldName,
          first: first ? { type: first.type, default: first.default, range: first.range } : null,
          second: second ? { type: second.type, default: second.default, range: second.range } : null
        };
      });

    return diff.reduce(
      (r, e) => ({
        ...r,
        [e.name]: { [this.fifaFirst]: e.first, [this.fifaSecond]: e.second }
      }),
      {}
    );
  }
}
