import {
  IAutoplaylistQuery,
  LogicalOperator,
  QueryType
} from '@/types/autoplaylist';

let id = 0;

export abstract class BaseAutoplaylistQuery implements IAutoplaylistQuery {
  negated: boolean;
  combinedWith?: LogicalOperator | string;
  nextQuery: IAutoplaylistQuery | null;
  prevQuery: IAutoplaylistQuery | null;
  id: number;
  abstract readonly type: QueryType;

  protected constructor(negated: boolean) {
    this.negated = negated;
    this.combinedWith = LogicalOperator.And;
    this.nextQuery = null;
    this.prevQuery = null;
    this.id = id++;
  }

  protected negateQuery(query: string): string {
    return this.negated ? `NOT ${query}` : query;
  }

  abstract rawQuery(): string;

  fullQuery(): string {
    const queries = this.toArray();
    let query: string | undefined = queries[0].rawQuery();
    let combine = this.combinedWith;

    for (const q of queries.slice(1)) {
      query = `${query}\n${combine}\n${q.rawQuery()}`;
      combine = q.combinedWith;
    }

    return query;
  }

  toArray(): IAutoplaylistQuery[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let currentQuery: IAutoplaylistQuery | null = this;
    const arr = [];

    while (currentQuery != null) {
      arr.push(currentQuery);
      currentQuery = currentQuery.nextQuery;
    }

    return arr;
  }
}
