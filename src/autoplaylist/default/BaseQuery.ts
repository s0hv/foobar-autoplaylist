import {
  IAutoplaylistQuery,
  ICombinedQuery,
  LogicalOperator,
  QueryType
} from '@/types/autoplaylist';

let id = 0;

export abstract class BaseAutoplaylistQuery implements IAutoplaylistQuery {
  negated: boolean;
  combinedWith: LogicalOperator | string | null;
  isLast = false;
  parent?: ICombinedQuery;
  id: number;
  abstract readonly type: QueryType;

  protected constructor(
    negated: boolean,
    parent?: ICombinedQuery,
    combinedWith: LogicalOperator | string | null = LogicalOperator.And
  ) {
    this.negated = negated;
    this.combinedWith = combinedWith;
    this.parent = parent;

    this.id = id++;
  }

  protected negateQuery(query: string): string {
    return this.negated ? `NOT ${query}` : query;
  }

  abstract rawQuery(): string;
}
