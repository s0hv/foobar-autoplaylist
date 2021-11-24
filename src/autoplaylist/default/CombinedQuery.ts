import {
  IAutoplaylistQuery,
  ICombinedQuery,
  QueryType
} from '@/types/autoplaylist';
import { BaseAutoplaylistQuery } from '@/autoplaylist/default/BaseQuery';

const INDENT = '  ';

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

    let depth = 0;
    let parent = this.parent;
    while (parent !== undefined) {
      parent = parent.parent;
      depth++;
    }

    const indent = INDENT.repeat(depth);
    const bracketIndent = INDENT.repeat(Math.max(depth - 1, 0));

    for (let idx = 0; idx < length; idx++) {
      const q = this.queries[idx];
      if (idx === length - 1) {
        queriesJoined += q.rawQuery();
      } else {
        queriesJoined += `${q.rawQuery()}\n${indent}${q.combinedWith}\n${indent}`;
      }
    }

    let s: string;
    if (this.isRoot) {
      s = queriesJoined;
    } else {
      s = `(\n${indent}${queriesJoined}\n${bracketIndent})`;
    }

    return this.negateQuery(s);
  }
}
