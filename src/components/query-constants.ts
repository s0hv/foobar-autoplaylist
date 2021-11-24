import {
  IAutoplaylistQuery,
  ICombinedQuery,
  QueryType
} from '@/types/autoplaylist';
import { CombinedQuery } from '@/autoplaylist/default';

export const queryToInput: Record<QueryType, string> = {
  [QueryType.TextQuery]: 'text-field-query',
  [QueryType.CombinedQuery]: 'combined-query-input',
  [QueryType.TimeQuery]: 'time-query',
  [QueryType.FreeSpace]: 'free-space-query'
};

export function getQueryComponent(query: IAutoplaylistQuery): string {
  return queryToInput[query.type];
}

export const CombinedQueryFunctions = {
  removeQuery(query: IAutoplaylistQuery, combinedQuery: ICombinedQuery): void {
    const idx = combinedQuery.queries.indexOf(query);
    combinedQuery.queries.splice(idx, 1);
    this.updateFirstAndLastQuery(query.parent || combinedQuery);
  },

  updateFirstAndLastQuery(query: ICombinedQuery): void {
    for (const q of query.queries) {
      q.parent = query;
      if (q instanceof CombinedQuery) {
        this.updateFirstAndLastQuery(q);
      }
    }

    const length = query.queries.length;
    if (length === 0) return;

    query.queries.forEach(q => (q.isLast = false));
    query.queries[length - 1].isLast = true;
  }
};
