import { BodyGenerator, BodyGeneratorOptions } from '../../../src/generators';
import { BodyTypeCode } from '../../../src/interfaces';

describe('Body Generator', () => {
  let generator: BodyGenerator;
  const opts: BodyGeneratorOptions = {
    minHeight: 130,
    maxHeight: 215,
    minWeight: 30,
    maxWeight: 115,
    specificBodyType: true
  };

  describe('height', () => {
    beforeEach(() => {
      generator = new BodyGenerator(opts);
    });

    it('unknown weight', () => {
      const values = new Array(30).map(() => generator.height());
      expect(values.every((v) => v >= opts.minHeight && v <= opts.maxHeight)).toEqual(true);
    });

    it('known weight', () => {
      const values = new Array(30).map(() => generator.height(80));
      expect(values.every((v) => v >= opts.minHeight && v <= opts.maxHeight)).toEqual(true);
    });
  });

  describe('weight', () => {
    beforeEach(() => {
      generator = new BodyGenerator(opts);
    });

    it('unknown height', () => {
      const values = new Array(30).map(() => generator.weight());
      expect(values.every((v) => v >= opts.minWeight && v <= opts.maxWeight)).toEqual(true);
    });

    it('known height', () => {
      const values = new Array(30).map(() => generator.weight(180));
      expect(values.every((v) => v >= opts.minWeight && v <= opts.maxWeight)).toEqual(true);
    });
  });

  describe('bodyTypeCode', () => {
    beforeEach(() => {
      generator = new BodyGenerator(opts);
    });

    it('height higher than 205', () => {
      expect(generator.bodyTypeCode(206, 106)).toEqual(BodyTypeCode.VeryTallAndLean);
    });

    it('height lower than 170', () => {
      expect(generator.bodyTypeCode(160, 60)).toEqual(
        BodyTypeCode.ShortAndLean || BodyTypeCode.ShortAndMuscular || BodyTypeCode.Short
      );
    });

    it('height from 190 to 205', () => {
      expect(generator.bodyTypeCode(195, 95)).toEqual(
        BodyTypeCode.TallAndLean || BodyTypeCode.TallAndMuscular || BodyTypeCode.Tall
      );
    });

    it('height from 170 to 190', () => {
      expect(generator.bodyTypeCode(180, 80)).toEqual(
        BodyTypeCode.AverageHeightAndLean || BodyTypeCode.AverageHeightAndMuscular || BodyTypeCode.AverageHeight
      );
    });

    it('Messi', () => {
      expect(generator.bodyTypeCode(180, 80, 158023)).toEqual(BodyTypeCode.Messi);
    });

    it('Akinfenwa', () => {
      expect(generator.bodyTypeCode(180, 80, 156321)).toEqual(BodyTypeCode.Akinfenwa);
    });

    it('Courtois', () => {
      expect(generator.bodyTypeCode(180, 80, 192119)).toEqual(BodyTypeCode.Courtois);
    });

    it('Neymar', () => {
      expect(generator.bodyTypeCode(180, 80, 190871)).toEqual(BodyTypeCode.Neymar);
    });

    it('Shaqiri', () => {
      expect(generator.bodyTypeCode(180, 80, 193348)).toEqual(BodyTypeCode.Shaqiri);
    });

    it('Ronaldo', () => {
      expect(generator.bodyTypeCode(180, 80, 20801)).toEqual(BodyTypeCode.Ronaldo);
    });

    it('Leroux', () => {
      expect(generator.bodyTypeCode(180, 80, 226316)).toEqual(BodyTypeCode.Leroux);
    });

    it('Salah', () => {
      expect(generator.bodyTypeCode(180, 80, 209331)).toEqual(BodyTypeCode.Salah);
    });

    it('Morgan', () => {
      expect(generator.bodyTypeCode(180, 80, 226301)).toEqual(BodyTypeCode.Morgan);
    });
  });
});
