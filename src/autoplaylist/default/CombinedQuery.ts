import {
  IAutoplaylistQuery,
  ICombinedQuery,
  QueryType
} from '@/types/autoplaylist';
import { BaseAutoplaylistQuery } from '@/autoplaylist/default/BaseQuery';

export class CombinedQuery extends BaseAutoplaylistQuery implements ICombinedQuery {
  queries: IAutoplaylistQuery[];
  /** Determines if this is the root query */
  isRoot: boolean;
  readonly type = QueryType.CombinedQuery;

  constructor(
    queries: IAutoplaylistQuery[],
    root: boolean,
    negated: boolean,
    parent?: ICombinedQuery
  ) {
    super(negated, parent);

    this.isRoot = root;
    this.queries = queries;
  }

  rawQuery(): string {
    let queriesJoined = '';
    const length = this.queries.length;

    for (let idx = 0; idx < length; idx++) {
      const q = this.queries[idx];
      if (idx === length - 1) {
        queriesJoined += q.rawQuery();
      } else {
        queriesJoined += `${q.rawQuery()}\n${q.combinedWith}\n`;
      }
    }

    let s: string;
    if (this.isRoot) {
      s = queriesJoined;
    } else {
      s = `(${queriesJoined})`;
    }

    return this.negateQuery(s);
  }
}
