import {
  ICombinedQuery,
  IFreeSpace,
  LogicalOperator,
  QueryType
} from '@/types/autoplaylist';
import { BaseAutoplaylistQuery } from '@/autoplaylist/default/BaseQuery';

export class FreeSpace extends BaseAutoplaylistQuery implements IFreeSpace {
  queryText: string;
  readonly type = QueryType.FreeSpace;

  constructor(
    queryText: string,
    parent?: ICombinedQuery,
    combinedWith: LogicalOperator | string | null = LogicalOperator.And
  ) {
    super(false, parent, combinedWith);

    this.queryText = queryText;
  }

  rawQuery(): string {
    return this.queryText;
  }
}
