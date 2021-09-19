import { CombinedQuery } from '@/autoplaylist/default/CombinedQuery';
import { IAutoplaylistQuery, LogicalOperator } from '@/types/autoplaylist';

class DummyQuery implements IAutoplaylistQuery {
  query: string;
  negated: boolean;
  nextQuery: IAutoplaylistQuery | null;
  prevQuery: IAutoplaylistQuery | null;
  type = 0;
  id = 0;

  constructor(query: string) {
    this.query = query;
    this.negated = false;
    this.nextQuery = null;
    this.prevQuery = null;
  }

  rawQuery(): string {
    return this.query;
  }

  fullQuery(): string {
    return this.query;
  }

  toArray(): IAutoplaylistQuery[] {
    return [];
  }
}

describe('CombinedQuery should work correctly', () => {
  const q1 = new DummyQuery('"%artist%" HAS "test"');
  const q2 = new DummyQuery('NOT "%title%" HAS "test 2"');

  it('Should combine two queries using the given logical operator', () => {
    const cq = new CombinedQuery(q1, LogicalOperator.And, q2, false);

    expect(cq.rawQuery()).toStrictEqual(
      `(${q1.rawQuery()} AND ${q2.rawQuery()})`
    );
  });

  it('Should combine two queries using the given logical operator negated', () => {
    const cq = new CombinedQuery(q1, LogicalOperator.And, q2, true);

    expect(cq.rawQuery()).toStrictEqual(
      `NOT (${q1.rawQuery()} AND ${q2.rawQuery()})`
    );
  });
});
