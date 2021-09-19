import {
  IAutoplaylistQuery,
  ICombinedQuery,
  LogicalOperator, QueryType
} from '@/types/autoplaylist';
import { BaseAutoplaylistQuery } from '@/autoplaylist/default/BaseQuery';

export class CombinedQuery extends BaseAutoplaylistQuery implements ICombinedQuery {
  logicalOperator: LogicalOperator | string;
  query1: IAutoplaylistQuery;
  query2: IAutoplaylistQuery;
  readonly type = QueryType.CombinedQuery;

  constructor(
    query1: IAutoplaylistQuery,
    logicalOperator: LogicalOperator | string,
    query2: IAutoplaylistQuery,
    negated: boolean
  ) {
    super(negated);

    this.query1 = query1;
    this.logicalOperator = logicalOperator;
    this.query2 = query2;
  }

  rawQuery(): string {
    return this.negateQuery(
      `(${this.query1.rawQuery()} ${this.logicalOperator} ${this.query2.rawQuery()})`
    );
  }
}
