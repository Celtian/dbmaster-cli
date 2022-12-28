export {};

declare global {
  interface Date {
    /**
     * @returns date in fifa format
     */
    toFifaDate(): number;
    /**
     * @returns incremented date
     */
    addYear(years: number): Date;
    /**
     * @returns date without time and zone
     */
    normalize(): Date;
    /**
     * @returns age
     */
    age(refDate?: Date): number;
  }
  interface DateConstructor {
    /**
     * @returns date from fifa format
     */
    fromFifaDate(value: number): Date;
  }
}

Date.prototype.toFifaDate = function (): number {
  // tslint:disable-next-line: no-invalid-this
  return Math.round((this.getTime() - this.getTimezoneOffset() * 60000) / 8.64e7) + 141428;
};

Date.prototype.addYear = function (years: number): Date {
  // tslint:disable-next-line: no-invalid-this
  return new Date(this.setFullYear(this.getFullYear() + years));
};

Date.prototype.normalize = function (): Date {
  // tslint:disable-next-line: no-invalid-this
  return new Date(this.getFullYear(), this.getMonth(), this.getDate(), -this.getTimezoneOffset() / 60, 0, 0);
};

Date.prototype.age = function age(refDate?: Date): number {
  // tslint:disable-next-line: no-parameter-reassignment
  refDate = refDate ? refDate.normalize() : new Date().normalize();
  // tslint:disable-next-line: no-invalid-this
  const diff = refDate.getTime() - this.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

Date.fromFifaDate = (value: number): Date => {
  return new Date((value - 141428) * 8.64e7);
};
