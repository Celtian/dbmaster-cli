import { Field, Fifa, Table } from '../interfaces';
import { FifaConfig } from './fifa-config';
import { fifaConfigFactory } from './fifa-config-factory';

export enum CheckMark {
  False = '✗',
  True = '✓'
}

export interface CompareFifaConfigCategorizedFields {
  bothTables: string[];
  firstTable: string[];
  secondTable: string[];
}

export class CompareFifaConfig {
  private configFirst: FifaConfig;
  private configSecond: FifaConfig;

  constructor(private fifaFirst: Fifa, private fifaSecond: Fifa) {
    this.configFirst = fifaConfigFactory(this.fifaFirst);
    this.configSecond = fifaConfigFactory(this.fifaSecond);
  }

  public compareTableDefinition(table: Table): CompareFifaConfigCategorizedFields {
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

  public printDiffColumns(table: Table): void {
    const { bothTables, firstTable, secondTable } = this.compareTableDefinition(table);

    const data = [...bothTables, ...firstTable, ...secondTable].sort().reduce(
      (r, field) => ({
        ...r,
        [field]: {
          [this.fifaFirst]: firstTable.includes(field) || bothTables.includes(field) ? CheckMark.True : CheckMark.False,
          [this.fifaSecond]:
            secondTable.includes(field) || bothTables.includes(field) ? CheckMark.True : CheckMark.False
        }
      }),
      {}
    );

    console.table(data, [this.fifaFirst, this.fifaSecond]);
  }

  public printDiffDefaults(table: Table): void {
    const { bothTables, firstTable, secondTable } = this.compareTableDefinition(table);

    const tableFirst: Field[] = this.configFirst[table];
    const tableSecond: Field[] = this.configSecond[table];

    const data = [...bothTables, ...firstTable, ...secondTable].sort().reduce(
      (r, field: string) => ({
        ...r,
        [field]: {
          [this.fifaFirst]:
            firstTable.includes(field) || bothTables.includes(field)
              ? tableFirst.find((f) => f.name === field).default
              : undefined,
          [this.fifaSecond]:
            secondTable.includes(field) || bothTables.includes(field)
              ? tableSecond.find((f) => f.name === field).default
              : undefined
        }
      }),
      {}
    );

    console.table(data, [this.fifaFirst, this.fifaSecond]);
  }

  public printDiffRange(table: Table): void {
    const { bothTables, firstTable, secondTable } = this.compareTableDefinition(table);

    const tableFirst: Field[] = this.configFirst[table];
    const tableSecond: Field[] = this.configSecond[table];

    const data = [...bothTables, ...firstTable, ...secondTable].sort().reduce(
      (r, field: string) => ({
        ...r,
        [field]: {
          [this.fifaFirst]:
            firstTable.includes(field) || bothTables.includes(field)
              ? tableFirst.find((f) => f.name === field).range
              : undefined,
          [this.fifaSecond]:
            secondTable.includes(field) || bothTables.includes(field)
              ? tableSecond.find((f) => f.name === field).range
              : undefined
        }
      }),
      {}
    );

    console.table(data, [this.fifaFirst, this.fifaSecond]);
  }
}
