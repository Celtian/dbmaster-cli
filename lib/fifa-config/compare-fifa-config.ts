import { Field, Fifa, Table } from '../interfaces';
import { FifaConfig } from './fifa-config';
import { fifaConfigFactory } from './fifa-config-factory';

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

  public printDiffColumns(table: Table): void {
    const { bothTables, firstTable, secondTable } = this.compareTableDefinition(table);

    const data = [...bothTables, ...firstTable, ...secondTable].sort().reduce(
      (r, field) => ({
        ...r,
        [field]: {
          [this.fifaFirst]: firstTable.includes(field) || bothTables.includes(field),
          [this.fifaSecond]: secondTable.includes(field) || bothTables.includes(field)
        }
      }),
      {}
    );

    console.table(data, [this.fifaFirst, this.fifaSecond]);
  }

  public printDiffDefaults(table: Table): void {
    this.printDiffTable(table, 'default');
  }

  public printDiffDatatype(table: Table): void {
    this.printDiffTable(table, 'type');
  }

  public printDiffRange(table: Table): void {
    this.printDiffTable(
      table,
      'range',
      (valueFirst, valueSecond) =>
        (valueFirst && valueSecond && (valueFirst.min !== valueSecond.min || valueFirst.max !== valueFirst.max)) ||
        Boolean(!valueFirst && valueSecond) ||
        Boolean(valueFirst && !valueSecond)
    );
  }

  public printDiffOrder(table: Table): void {
    this.printDiffTable(table, 'order');
  }

  private compareTableDefinition(table: Table): CompareFifaConfigCategorizedFields {
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

  private printDiffTable(
    table: Table,
    mode: 'default' | 'type' | 'range' | 'order',
    diffFn?: (valueFirst: any, valueSecond: any) => boolean
  ): void {
    const { bothTables, firstTable, secondTable } = this.compareTableDefinition(table);

    const tableFirst: Field[] = this.configFirst[table];
    const tableSecond: Field[] = this.configSecond[table];

    const data = [...bothTables, ...firstTable, ...secondTable].sort().reduce((r, field: string) => {
      const valueFirst =
        firstTable.includes(field) || bothTables.includes(field)
          ? tableFirst.find((f) => f.name === field)[mode]
          : undefined;
      const valueSecond =
        secondTable.includes(field) || bothTables.includes(field)
          ? tableSecond.find((f) => f.name === field)[mode]
          : undefined;

      return {
        ...r,
        [field]: {
          [this.fifaFirst]: valueFirst,
          [this.fifaSecond]: valueSecond,
          diff: diffFn ? diffFn(valueFirst, valueSecond) : valueFirst !== valueSecond
        }
      };
    }, {});

    console.table(data, [this.fifaFirst, this.fifaSecond, 'diff']);
  }
}
