import { date } from 'faker';
import { PersonRole } from '../interfaces';
import '../utils/date.utils';

export class DateGenerator {
  private refDate: Date;

  constructor(refDate?: Date) {
    this.refDate = refDate ? refDate.normalize() : new Date().normalize();
  }

  public birthDate(role: PersonRole): number {
    switch (role) {
      case PersonRole.Referee:
        return date
          .between(new Date(this.refDate).addYear(-55), new Date(this.refDate).addYear(-30))
          .normalize()
          .toFifaDate();
      case PersonRole.Manager:
        return date
          .between(new Date(this.refDate).addYear(-70), new Date(this.refDate).addYear(-30))
          .normalize()
          .toFifaDate();
      default:
        // Player
        return date
          .between(new Date(this.refDate).addYear(-38), new Date(this.refDate).addYear(-15))
          .normalize()
          .toFifaDate();
    }
  }

  public contractValidUntil(): number {
    return date.future(3, this.refDate).normalize().toFifaDate();
  }

  public playerJoinTeamDate(): number {
    return date.past(3, this.refDate).normalize().toFifaDate();
  }

  public loanDateEnd(): number {
    return date.future(1, this.refDate).normalize().toFifaDate();
  }

  public stadiumYearBuild(): number {
    return date.past(100, this.refDate).normalize().getFullYear();
  }

  public teamFoundationYear(): number {
    return date.past(100, this.refDate).normalize().getFullYear();
  }
}
