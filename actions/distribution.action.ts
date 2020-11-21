import chalk from 'chalk';
import { Input } from '../commands';
import { actionFactory, ActionType } from '../lib/actions';
import { FifaConfig, fifaConfigFactory } from '../lib/fifa-config';
import { Fifa, RawData, Table } from '../lib/interfaces';
import { Aggregated, aggregateFn, sortAggregateFn, sortByOrder } from '../lib/utils';
import { AbstractAction } from './abstract.action';

export class DistributionAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const path = options.find((option) => option.name === 'path').value as string;
    const table = options.find((option) => option.name === 'table').value as Table;
    const fifa = options.find((option) => option.name === 'fifa').value as Fifa;
    const column = options.find((option) => option.name === 'column').value as string;

    const cfg = fifaConfigFactory(fifa);

    if (column && !cfg[table].find((f) => f.name === column)) {
      console.error('Invalid argument "column".');
      return;
    }

    if (column) {
      await this.printColumnDistribution(cfg, path, fifa, table, column);
    } else {
      await this.printTableDistribution(cfg, path, fifa, table);
    }
  }

  private async printColumnDistribution(
    cfg: FifaConfig,
    path: string,
    fifa: Fifa,
    table: Table,
    column: string
  ): Promise<void> {
    console.info(
      chalk.green(`[${fifa}]`),
      chalk.green(`[${table}]`),
      chalk.red(`[${column}]`),
      chalk.yellow('How is the value distributed?')
    );
    console.info(chalk.white('Default value is:'), chalk.yellow(cfg[table].find((c) => c.name === column).default));

    const agg: Aggregated[] = [];
    await actionFactory({
      input: {
        fields: cfg[table],
        folder: path
      },
      table,
      actions: [
        {
          type: ActionType.ActionOnData,
          onDataFn: (data: RawData) => {
            aggregateFn(agg, data, column);
          }
        }
      ]
    });
    const sortedAggs = agg.sort(sortAggregateFn);

    console.info(
      chalk.white('Most frequent value is:'),
      chalk.yellow(sortedAggs.length ? sortedAggs[0].value : undefined)
    );
    console.table(sortedAggs);
  }

  private async printTableDistribution(cfg: FifaConfig, path: string, fifa: Fifa, table: Table): Promise<void> {
    console.info(chalk.green(`[${fifa}]`), chalk.red(`[${table}]`), chalk.yellow('How are the values distributed?'));

    const aggregatedData: any = new Object();
    await actionFactory({
      input: {
        fields: cfg[table],
        folder: path
      },
      table,
      actions: [
        {
          type: ActionType.ActionOnData,
          onDataFn: (data: RawData) => {
            for (const f of cfg[table].sort(sortByOrder)) {
              const agg: Aggregated[] = aggregatedData[f.name] || [];
              aggregateFn(agg, data, f.name);
              aggregatedData[f.name] = agg.sort(sortAggregateFn);
            }
          }
        }
      ]
    });

    let showedData = new Object();
    for (const key of Object.keys(aggregatedData)) {
      const firstFrequent = aggregatedData[key][0] || undefined;
      const secondFrequent = aggregatedData[key][1] || undefined;
      const thirdFrequent = aggregatedData[key][2] || undefined;

      const defaultValue = cfg[table].find((f) => f.name === key).default;

      showedData = {
        ...showedData,
        [key]: {
          mostFreqIsDefault: defaultValue === (firstFrequent ? firstFrequent.value : undefined),
          defaultValue,
          firstValue: firstFrequent ? firstFrequent.value : undefined,
          firstCount: firstFrequent ? firstFrequent.count : undefined,
          secondValue: secondFrequent ? secondFrequent.value : undefined,
          secondCount: secondFrequent ? secondFrequent.count : undefined,
          thirdValue: thirdFrequent ? thirdFrequent.value : undefined,
          thirdCount: thirdFrequent ? thirdFrequent.count : undefined
        }
      };
    }
    console.table(showedData);
  }
}
