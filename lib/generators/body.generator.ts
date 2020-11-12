import { random } from 'faker';
import * as Joi from 'joi';
import { BodyTypeCode } from '../interfaces';

enum BmiCategory {
  Over,
  Normal,
  Under
}

export interface BodyGeneratorOptions {
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
  specificBodyType?: boolean;
}

class BodyGeneratorConfig {
  public minHeight = 130;
  public maxHeight = 215;
  public minWeight = 30;
  public maxWeight = 50;
  public specificBodyType = false;
}

const bodyGeneratorConfigFactory = (opts: BodyGeneratorOptions): BodyGeneratorConfig => {
  const config = new BodyGeneratorConfig();

  if (opts.minHeight) {
    config.minHeight = opts.minHeight;
  }

  if (opts.maxHeight) {
    config.maxHeight = opts.maxHeight;
  }

  if (opts.minWeight) {
    config.minWeight = opts.minWeight;
  }

  if (opts.maxWeight) {
    config.maxWeight = opts.maxWeight;
  }

  return config;
};

// tslint:disable-next-line: max-classes-per-file
export class BodyGenerator {
  private config: BodyGeneratorConfig;

  constructor(opts: BodyGeneratorOptions) {
    this.config = bodyGeneratorConfigFactory(opts);
  }

  public generateHeight(weight?: number): number {
    if (this.isWeightValid(weight)) {
      const avg = weight + 100;
      const min = avg - 10 >= this.config.minHeight ? avg - 10 : this.config.minHeight;
      const max = avg + 10 <= this.config.maxHeight ? avg + 10 : this.config.maxHeight;
      return random.number({ min, max });
    }
    return random.number({ min: this.config.minHeight, max: this.config.maxHeight });
  }

  public generateWidth(height?: number): number {
    if (this.isHeightValid(height)) {
      const avg = height - 100;
      const min = avg - 10 >= this.config.minWeight ? avg - 10 : this.config.minWeight;
      const max = avg + 10 <= this.config.maxWeight ? avg + 10 : this.config.maxWeight;
      return random.number({ min, max });
    }
    return random.number({ min: this.config.minWeight, max: this.config.maxWeight });
  }

  private isHeightValid(height: number): boolean {
    const { error, errors } = Joi.number()
      .integer()
      .min(this.config.minHeight)
      .max(this.config.maxHeight)
      .required()
      .validate(height);
    return !error && !errors;
  }

  private isWeightValid(weight: number): boolean {
    const { error, errors } = Joi.number()
      .integer()
      .min(this.config.minWeight)
      .max(this.config.maxWeight)
      .required()
      .validate(weight);
    return !error && !errors;
  }

  private bmi(height: number, weight: number): number {
    return height / (weight * weight);
  }

  public bodyTypeCode(height: number, weight: number, id?: number): BodyTypeCode {
    if (id && this.config.specificBodyType) {
      switch (id) {
        case 158023:
          return BodyTypeCode.Messi;
        case 156321:
          return BodyTypeCode.Akinfenwa;
        case 192119:
          return BodyTypeCode.Courtois;
        case 190871:
          return BodyTypeCode.Neymar;
        case 193348:
          return BodyTypeCode.Shaqiri;
        case 20801:
          return BodyTypeCode.Ronaldo;
        case 226316:
          return BodyTypeCode.Leroux;
        case 209331:
          return BodyTypeCode.Salah;
        case 226301:
          return BodyTypeCode.Morgan;
        default:
          return this.bodyTypeCodeBmi(height, weight);
      }
    } else {
      return this.bodyTypeCodeBmi(height, weight);
    }
  }

  private bodyTypeCodeBmi(height: number, weight: number): BodyTypeCode {
    const category = this.bmiCategory(height, weight);

    if (height > 205) {
      return BodyTypeCode.VeryTallAndLean;
    } else if (height < 170) {
      if (category === BmiCategory.Under) {
        return BodyTypeCode.ShortAndLean;
      } else if (category === BmiCategory.Over) {
        return BodyTypeCode.ShortAndMuscular;
      } else {
        return BodyTypeCode.Short;
      }
    } else if (height > 190) {
      if (category === BmiCategory.Under) {
        return BodyTypeCode.TallAndLean;
      } else if (category === BmiCategory.Over) {
        return BodyTypeCode.TallAndMuscular;
      } else {
        return BodyTypeCode.Tall;
      }
    } else {
      if (category === BmiCategory.Under) {
        return BodyTypeCode.AverageHeightAndLean;
      } else if (category === BmiCategory.Over) {
        return BodyTypeCode.AverageHeightAndMuscular;
      } else {
        return BodyTypeCode.AverageHeight;
      }
    }
  }

  private bmiCategory(height: number, weight: number): BmiCategory {
    const bmi = this.bmi(height, weight);
    if (bmi < 18.5) {
      return BmiCategory.Under;
    } else if (bmi > 25) {
      return BmiCategory.Over;
    } else {
      return BmiCategory.Normal;
    }
  }
}
