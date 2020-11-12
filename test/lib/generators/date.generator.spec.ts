import { DateGenerator } from '../../../lib/generators';
import { PersonRole } from '../../../lib/interfaces';

describe('Date Generator', () => {
  let generator: DateGenerator;
  let refDate: Date;

  describe('birthdate', () => {
    beforeEach(() => {
      refDate = new Date('2020-01-01T00:00:00Z');
      generator = new DateGenerator();
    });

    it(PersonRole.Referee, () => {
      const referees = new Array(30).map(() => generator.birthDate(PersonRole.Referee));

      expect(
        referees.every((date) => {
          return (
            Date.fromFifaDate(date) >= new Date('1950-01-01T00:00:00.000Z') &&
            Date.fromFifaDate(date) <= new Date('1990-01-01T00:00:00.000Z')
          );
        })
      ).toEqual(true);
    });

    it(PersonRole.Manager, () => {
      const managers = new Array(30).map(() => generator.birthDate(PersonRole.Manager));

      expect(
        managers.every((date) => {
          return (
            Date.fromFifaDate(date) >= new Date('1965-01-01T00:00:00.000Z') &&
            Date.fromFifaDate(date) <= new Date('1990-01-01T00:00:00.000Z')
          );
        })
      ).toEqual(true);
    });

    it(PersonRole.Player, () => {
      const players = new Array(30).map(() => generator.birthDate(PersonRole.Player));

      expect(
        players.every((date) => {
          return (
            Date.fromFifaDate(date) >= new Date('1982-01-01T00:00:00.000Z') &&
            Date.fromFifaDate(date) <= new Date('2005-01-01T00:00:00.000Z')
          );
        })
      ).toEqual(true);
    });
  });

  describe('contractValidUntil', () => {
    beforeEach(() => {
      refDate = new Date('2020-01-01T00:00:00Z');
      generator = new DateGenerator();
    });

    it('contractValidUntil', () => {
      const dates = new Array(30).map(() => generator.contractValidUntil());

      expect(
        dates.every((date) => {
          return Date.fromFifaDate(date) >= refDate && Date.fromFifaDate(date) <= new Date('2023-01-01T00:00:00.000Z');
        })
      ).toEqual(true);
    });
  });

  describe('playerJoinTeamDate', () => {
    beforeEach(() => {
      refDate = new Date('2020-01-01T00:00:00Z');
      generator = new DateGenerator();
    });

    it('playerJoinTeamDate', () => {
      const dates = new Array(30).map(() => generator.playerJoinTeamDate());

      expect(
        dates.every((date) => {
          return Date.fromFifaDate(date) >= refDate && Date.fromFifaDate(date) <= new Date('2023-01-01T00:00:00.000Z');
        })
      ).toEqual(true);
    });
  });

  describe('loanDateEnd', () => {
    beforeEach(() => {
      refDate = new Date('2020-01-01T00:00:00Z');
      generator = new DateGenerator();
    });

    it('loanDateEnd', () => {
      const dates = new Array(30).map(() => generator.loanDateEnd());

      expect(
        dates.every((date) => {
          return Date.fromFifaDate(date) >= refDate && Date.fromFifaDate(date) <= new Date('2021-01-01T00:00:00.000Z');
        })
      ).toEqual(true);
    });
  });

  describe('stadiumYearBuild', () => {
    beforeEach(() => {
      refDate = new Date('2020-01-01T00:00:00Z');
      generator = new DateGenerator();
    });

    it('stadiumYearBuild', () => {
      const dates = new Array(30).map(() => generator.stadiumYearBuild());
      expect(dates.every((date) => date >= 1920 && date <= 2020)).toEqual(true);
    });
  });

  describe('teamFoundationYear', () => {
    beforeEach(() => {
      refDate = new Date('2020-01-01T00:00:00Z');
      generator = new DateGenerator();
    });

    it('teamFoundationYear', () => {
      const dates = new Array(30).map(() => generator.teamFoundationYear());
      expect(dates.every((date) => date >= 1920 && date <= 2020)).toEqual(true);
    });
  });
});
