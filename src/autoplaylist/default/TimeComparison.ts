import { BaseAutoplaylistQuery } from '@/autoplaylist/default/BaseQuery';
import {
  ITextComparison,
  QueryType,
  TimeOperator
} from '@/types/autoplaylist';
import { dateRegex, escapeText } from '@/autoplaylist/default/utils';

export class TimeComparison extends BaseAutoplaylistQuery implements ITextComparison {
  field: string;
  comparator: TimeOperator | string;
  comparedAgainst: string;
  readonly type = QueryType.TimeQuery;

  constructor(
    field: string,
    comparator: TimeOperator | string,
    comparedAgainst: string,
    negated = false
  ) {
    super(negated);

    this.field = field;
    this.comparator = comparator;
    this.comparedAgainst = comparedAgainst;
  }

  validateTimeSyntax(t: string): boolean {
    return dateRegex.test(t);
  }

  rawQuery(): string {
    if (!this.validateTimeSyntax(this.comparedAgainst)) {
      console.log('oopsie');
    }

    return this.negateQuery(
      `${escapeText(this.field)} ${this.comparator} ${this.comparedAgainst}`
    );
  }
}
