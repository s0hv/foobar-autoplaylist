import { BaseAutoplaylistQuery } from '@/autoplaylist/default/BaseQuery';
import {
  ICombinedQuery,
  ITextComparison, LogicalOperator,
  OneSideOperator, QueryType,
  TextOperator
} from '@/types/autoplaylist';
import { escapeText } from '@/autoplaylist/default/utils';

export const oneSideOperatorValues: string[] = Object.values(OneSideOperator);

export class TextComparison extends BaseAutoplaylistQuery implements ITextComparison {
  field: string;
  comparator: TextOperator | OneSideOperator | string;
  comparedAgainst: string | null;
  readonly type = QueryType.TextQuery;

  constructor(
    field: string,
    comparator: TextOperator | OneSideOperator | string,
    comparedAgainst: string | null,
    negated = false,
    parent?: ICombinedQuery,
    combinedWith?: LogicalOperator | string | null
  ) {
    super(negated, parent, combinedWith);

    this.field = field;
    this.comparator = comparator;
    this.comparedAgainst = comparedAgainst;
  }

  rawQuery(): string {
    const rightSide = (
      oneSideOperatorValues.includes(this.comparator) ||
      typeof this.comparedAgainst !== 'string' ||
      !this.comparedAgainst
    ) ?
      '' :
      ' ' + escapeText(this.comparedAgainst);

    return this.negateQuery(
      `${escapeText(this.field)} ${this.comparator}${rightSide}`
    );
  }
}
