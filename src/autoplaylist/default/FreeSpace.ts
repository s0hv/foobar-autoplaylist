import { IFreeSpace, QueryType } from '@/types/autoplaylist';
import { BaseAutoplaylistQuery } from '@/autoplaylist/default/BaseQuery';

export class FreeSpace extends BaseAutoplaylistQuery implements IFreeSpace {
  queryText: string;
  readonly type = QueryType.FreeSpace;

  constructor(queryText: string) {
    super(false);

    this.queryText = queryText;
  }

  rawQuery(): string {
    return this.queryText;
  }
}
