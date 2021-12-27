import { map2query, Parser } from '@/autoplaylist/default/parser';
import {
  IAutoplaylistQuery,
  ICombinedQuery,
  LogicalOperator,
  Statement,
  TreeNode
} from '@/types/autoplaylist';
import { CombinedQuery, TextComparison } from '@/autoplaylist/default';
import { TimeComparison } from '@/autoplaylist/default/TimeComparison';
import { FreeSpace } from '@/autoplaylist/default/FreeSpace';

// https://stackoverflow.com/a/52183279/6046713
interface Type<T> extends Function { new (...args: never[]): T; }

describe('Query parser valid cases', () => {
  it('query without quotes', () => {
    const p = new Parser('artist IS Test Artist AND %length_seconds% GREATER 40 AND title PRESENT');
    const result = p.parse();

    expect(result.queries).toHaveLength(3);

    for (const query of result.queries) {
      expect(query).toHaveProperty('query');
      expect(query.negated).toBeFalse();
    }

    const queries: Statement[] = <Statement[]>result.queries;
    expect(queries[0].query).toStrictEqual(['artist', 'IS', 'Test Artist']);
    expect(queries[0].original).toStrictEqual('artist IS Test Artist AND ');
    expect(queries[0].combinedWith).toStrictEqual('AND');

    expect(queries[1].query).toStrictEqual(['%length_seconds%', 'GREATER', '40']);
    expect(queries[1].original).toStrictEqual('%length_seconds% GREATER 40 AND ');
    expect(queries[1].combinedWith).toStrictEqual('AND');

    expect(queries[2].query).toStrictEqual(['title', 'PRESENT']);
    expect(queries[2].original).toStrictEqual('title PRESENT');
    expect(queries[2].combinedWith).toBeNull();
  });

  it('query with quotes', () => {
    const p = new Parser('%album% HAS "test album" OR NOT %length_seconds% GREATER "40"');
    const result = p.parse();

    expect(result.queries).toHaveLength(2);

    for (const query of result.queries) {
      expect(query).toHaveProperty('query');
    }
    const queries: Statement[] = <Statement[]>result.queries;
    expect(queries[0].query).toStrictEqual(['%album%', 'HAS', 'test album']);
    expect(queries[0].original).toStrictEqual('%album% HAS "test album" OR ');
    expect(queries[0].combinedWith).toStrictEqual('OR');
    expect(queries[0].negated).toBeFalse();

    expect(queries[1].query).toStrictEqual(['%length_seconds%', 'GREATER', '40']);
    expect(queries[1].original).toStrictEqual('%length_seconds% GREATER "40"');
    expect(queries[1].negated).toBeTrue();
    expect(queries[1].combinedWith).toBeNull();
  });

  it('should parse nesting', () => {
    const p = new Parser('"$meta(artist,5)" PRESENT OR ("$meta(artist,1)" PRESENT AND %album% HAS "test")');
    const result = p.parse();

    expect(result.queries).toHaveLength(2);
    const query1 = <Statement>result.queries[0];
    const query2 = <TreeNode>result.queries[1];

    expect(query1).toHaveProperty('query');
    expect(query1.negated).toBeFalse();
    expect(query2).toHaveProperty('queries');
    expect(query2.negated).toBeFalse();

    expect(query1.query).toStrictEqual(['$meta(artist,5)', 'PRESENT']);
    expect(query1.original).toStrictEqual('"$meta(artist,5)" PRESENT OR ');
    expect(query1.combinedWith).toStrictEqual('OR');

    expect(query2.queries).toHaveLength(2);
    expect(query2.prevNode).toBe(result);

    expect(query2.queries[0]).toHaveProperty('query', ['$meta(artist,1)', 'PRESENT']);
    expect(query2.queries[0]).toHaveProperty('original', '"$meta(artist,1)" PRESENT AND ');
    expect(query2.queries[0].combinedWith).toStrictEqual('AND');

    expect(query2.queries[1]).toHaveProperty('query', ['%album%', 'HAS', 'test']);
    expect(query2.queries[1]).toHaveProperty('original', '%album% HAS "test"');
    expect(query2.queries[1].combinedWith).toBeNull();
  });

  it('Ignores newlines, tabs and whitespace outside words', () => {
    const p = new Parser(`
      %replaygain_album_peak_db% MISSING
      \tAND
      %first_played% BEFORE 2020-01-21 00:00:00`
    );
    const result = p.parse();

    expect(result.queries).toHaveLength(2);

    for (const query of result.queries) {
      expect(query).toHaveProperty('query');
    }
    const queries: Statement[] = <Statement[]>result.queries;
    expect(queries[0].query).toStrictEqual(['%replaygain_album_peak_db%', 'MISSING']);
    expect(queries[0].combinedWith).toStrictEqual('AND');

    expect(queries[1].query).toStrictEqual(['%first_played%', 'BEFORE', '2020-01-21 00:00:00']);
    expect(queries[1].combinedWith).toBeNull();
  });

  it('Correctly parses deep nesting with NOT statements', () => {
    const p = new Parser(`
      (%album% IS "test" OR NOT (%artist% HAS "a" AND %title% PRESENT))
      AND
      NOT %discnumber% GREATER 1`
    );
    const result = p.parse();

    expect(result.queries).toHaveLength(2);

    const q1 = <TreeNode>result.queries[0];
    const q2 = <Statement>result.queries[1];

    expect(q1).toHaveProperty('queries');
    expect(q2).toHaveProperty('query');

    expect(q1.negated).toBeFalse();
    expect(q2.negated).toBeTrue();

    expect(q2.original).toStrictEqual('%discnumber% GREATER 1');
    expect(q2.query).toStrictEqual(['%discnumber%', 'GREATER', '1']);
    expect(q2.combinedWith).toBeNull();

    expect(q1.combinedWith).toStrictEqual('AND');
    expect(q1.queries).toHaveLength(2);
    const q3 = <Statement>q1.queries[0];
    const q4 = <TreeNode>q1.queries[1];

    expect(q3.negated).toBeFalse();
    expect(q4.negated).toBeTrue();

    expect(q3.query).toStrictEqual(['%album%', 'IS', 'test']);
    expect(q3.original).toStrictEqual('%album% IS "test" OR ');
    expect(q3.combinedWith).toStrictEqual('OR');

    expect(q4.queries).toHaveLength(2);

    const q5 = <Statement>q4.queries[0];
    const q6 = <Statement>q4.queries[1];

    expect(q5.negated).toBeFalse();
    expect(q6.negated).toBeFalse();

    expect(q5.query).toStrictEqual(['%artist%', 'HAS', 'a']);
    expect(q5.original).toStrictEqual('%artist% HAS "a" AND ');
    expect(q5.combinedWith).toStrictEqual('AND');

    expect(q6.query).toStrictEqual(['%title%', 'PRESENT']);
    expect(q6.original).toStrictEqual('%title% PRESENT');
    expect(q6.combinedWith).toBeNull();
  });
});

describe('Query parser invalid cases', () => {
  it('Should throw on mismatched parentheses', () => {
    const queries = [')', '(abc) AND (', '(abc) AND )', '('];

    for (const query of queries) {
      expect(() => new Parser(query).parse())
        .toThrowWithMessage(SyntaxError, /Unmatched parentheses/);
    }
  });

  it('Should throw when quote closes nothing', () => {
    const msg = /Expected node to contain prevNode at position \d+/;
    expect(() => new Parser(')) ()').parse())
      .toThrowWithMessage(SyntaxError, msg);

    expect(() => new Parser(') AND ()').parse())
      .toThrowWithMessage(SyntaxError, msg);
  });

  it('Should throw when no logical operator after closing quote', () => {
    expect(() => new Parser(') (test PRESENT)').parse())
      .toThrowWithMessage(SyntaxError, /Could not parse node at position \d+/);
  });

  it('Should throw on unclosed quotes', () => {
    expect(() => new Parser('test HAS "abc AND abc MISSING').parse())
      .toThrowWithMessage(SyntaxError, /Unclosed quote when parsing/);
  });

  it('Should throw when quote found in unquoted string', () => {
    expect(() => new Parser('test HAS a"bc" AND abc MISSING').parse())
      .toThrowWithMessage(SyntaxError, /Unexpected quote in unquoted string at position/);
  });

  it('Should throw when queries not joined with a logical operator', () => {
    expect(() => new Parser('test HAS "abc" ANDD abc MISSING').parse())
      .toThrowWithMessage(SyntaxError, /Could not parse statement at position \d+\.\s+Expected one of/);
  });

  it('Should throw when query does not contain built in operator', () => {
    expect(() => new Parser('"test" HASS "abc" AND abc MISSING').parse())
      .toThrowWithMessage(SyntaxError, /Could not parse statement at position \d+\. Expected a built in operator but got a normal word\./);
  });
});

describe('Query mapper', () => {
  const testRootQuery = (query: ICombinedQuery) => {
    expect(query).toBeInstanceOf(CombinedQuery);
    expect(query.isRoot).toBeTrue();
    expect(query.parent).toBeUndefined();
    expect(query.negated).toBeFalse();
  };

  const testQueryTypes = (query: ICombinedQuery, types: Type<IAutoplaylistQuery>|Type<IAutoplaylistQuery>[]) => {
    const queries = query.queries;
    for (let i = 0; i < queries.length; i++) {
      if (Array.isArray(types)) {
        expect(queries[i]).toBeInstanceOf(types[i]);
      } else {
        expect(queries[i]).toBeInstanceOf(types);
      }
    }
  };

  const testTextComparison = (mapped: TextComparison|TimeComparison, expected: TextComparison|TimeComparison) => {
    expect(mapped.comparator).toStrictEqual(expected.comparator);
    expect(mapped.comparedAgainst).toStrictEqual(expected.comparedAgainst);
    expect(mapped.field).toStrictEqual(expected.field);
    expect(mapped.combinedWith).toStrictEqual(expected.combinedWith);
    expect(mapped.negated).toStrictEqual(expected.negated);
    expect(mapped.parent).toBe(expected.parent);
  };

  const testFreeSpace = (mapped: FreeSpace, expected: FreeSpace) => {
    expect(mapped.queryText).toStrictEqual(expected.queryText);
    expect(mapped.combinedWith).toStrictEqual(expected.combinedWith);
    expect(mapped.negated).toStrictEqual(expected.negated);
    expect(mapped.parent).toBe(expected.parent);
  };

  it('Should map simple query correctly', () => {
    const p = new Parser('artist IS Test Artist AND %length_seconds% GREATER 40 OR NOT title PRESENT');
    const query = map2query(p.parse());

    testRootQuery(query);
    expect(query.queries).toHaveLength(3);
    testQueryTypes(query, TextComparison);

    testTextComparison(
      <TextComparison>query.queries[0],
      new TextComparison('artist', 'IS', 'Test Artist', false, query, LogicalOperator.And)
    );

    testTextComparison(
      <TextComparison>query.queries[1],
      new TextComparison('%length_seconds%', 'GREATER', '40', false, query, LogicalOperator.Or)
    );

    testTextComparison(
      <TextComparison>query.queries[2],
      new TextComparison('title', 'PRESENT', null, true, query, null)
    );
  });

  it('Should map nested queries', () => {
    const p = new Parser('"$meta(artist,5)" PRESENT OR (NOT "$meta(artist,1)" PRESENT AND %album% HAS "test")');
    const query = map2query(p.parse());

    testRootQuery(query);
    expect(query.queries).toHaveLength(2);
    testQueryTypes(query, [TextComparison, CombinedQuery]);

    testTextComparison(
      <TextComparison>query.queries[0],
      new TextComparison('$meta(artist,5)', 'PRESENT', null, false, query, LogicalOperator.Or)
    );

    const innerQuery = <CombinedQuery>query.queries[1];
    testQueryTypes(innerQuery, [TextComparison, TextComparison]);

    testTextComparison(
      <TextComparison>innerQuery.queries[0],
      new TextComparison('$meta(artist,1)', 'PRESENT', null, true, innerQuery, LogicalOperator.And)
    );

    testTextComparison(
      <TextComparison>innerQuery.queries[1],
      new TextComparison('%album%', 'HAS', 'test', false, innerQuery, null)
    );
  });

  it('Should map time query and free space', () => {
    const p = new Parser(`
      (NOT free space OR NOT (%added% BEFORE 1111-11-11 11:11:11 AND free space query))
      AND
      NOT %discnumber% GREATER 1`
    );
    const query = map2query(p.parse());

    testRootQuery(query);
    expect(query.queries).toHaveLength(2);
    testQueryTypes(query, [CombinedQuery, TextComparison]);

    testTextComparison(
      <TextComparison>query.queries[1],
      new TextComparison('%discnumber%', 'GREATER', '1', true, query, null)
    );

    const innerQuery = <CombinedQuery>query.queries[0];
    testQueryTypes(innerQuery, [FreeSpace, CombinedQuery]);
    expect(innerQuery.combinedWith).toStrictEqual(LogicalOperator.And);

    testFreeSpace(
      <FreeSpace>innerQuery.queries[0],
      new FreeSpace('NOT free space', innerQuery, LogicalOperator.Or)
    );

    const innerQuery2 = <CombinedQuery>innerQuery.queries[1];
    expect(innerQuery2.negated).toBeTrue();

    testTextComparison(
      <TimeComparison>innerQuery2.queries[0],
      new TimeComparison('%added%', 'BEFORE', '1111-11-11 11:11:11', false, innerQuery2, LogicalOperator.And)
    );

    testFreeSpace(
      <FreeSpace>innerQuery2.queries[1],
      new FreeSpace('free space query', innerQuery2, null)
    );
  });
});
