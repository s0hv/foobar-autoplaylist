import { BaseAutoplaylistQuery } from '@/autoplaylist/default/BaseQuery';
import { LogicalOperator, QueryType } from '@/types/autoplaylist';

class BaseQueryTest extends BaseAutoplaylistQuery {
  readonly type: QueryType = QueryType.FreeSpace;
  query: string;

  constructor(negated: boolean, query: string) {
    super(negated);

    this.query = query;
  }

  rawQuery(): string {
    return this.query;
  }
}

describe('BaseAutoplaylistQuery', () => {
  it('fullQuery should return given query when no queries present', () => {
    const query = 'test query';
    const tc = new BaseQueryTest(false, query);

    expect(tc.fullQuery()).toStrictEqual(query);
  });

  it('Default values should match', () => {
    const query = 'test query';
    const tc = new BaseQueryTest(false, query);

    expect(tc.prevQuery).toBeNull();
    expect(tc.nextQuery).toBeNull();
    expect(tc.combinedWith).toStrictEqual(LogicalOperator.And);
    expect(tc.negated).toStrictEqual(false);
  });

  it('fullQuery should combine two queries', () => {
    const query = 'test query';
    const tc1 = new BaseQueryTest(false, query);

    const query2 = 'abc 123';
    const tc2 = new BaseQueryTest(true, query2);
    tc1.nextQuery = tc2;
    tc2.prevQuery = tc1;

    tc1.combinedWith = LogicalOperator.Or;

    expect(tc1.fullQuery()).toStrictEqual(`${query}\nOR\n${query2}`);
  });

  it('toArray should return all queries in order in an array', () => {
    const tc1 = new BaseQueryTest(false, 'query');
    const tc2 = new BaseQueryTest(true, 'query2');
    tc1.nextQuery = tc2;
    const tc3 = new BaseQueryTest(true, 'query3');
    tc2.nextQuery = tc3;
    const tc4 = new BaseQueryTest(true, 'query4');
    tc3.nextQuery = tc4;

    expect(tc1.toArray()).toEqual([tc1, tc2, tc3, tc4]);
    expect(tc2.toArray()).toEqual([tc2, tc3, tc4]);
  });
});
