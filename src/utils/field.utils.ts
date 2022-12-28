import { Field } from '../interfaces';

export const sortByOrder = (a: Field, b: Field) => a.order - b.order;
