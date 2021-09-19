import { TextComparison } from '@/autoplaylist/default';
import {
  NumberOperator,
  OneSideOperator,
  TextOperator
} from '@/types/autoplaylist';

describe('Test TextComparison', () => {
  const field = '%artist%';

  it('Should work', () => {
    const tc = new TextComparison(
      field,
      TextOperator.Has,
      'custom string',
      false
    );

    expect(tc.rawQuery()).toStrictEqual(`"${field}" HAS "custom string"`);
  });

  it('Should work with special characters', () => {
    const tc = new TextComparison(field, TextOperator.Is, "$()[]{}'", false);

    expect(tc.rawQuery()).toStrictEqual(
      `"%artist%" IS "$()[]{}'"`
    );
  });

  it('Should work with custom values', () => {
    const tc = new TextComparison('test value', 'test operator', undefined, false);

    expect(tc.rawQuery()).toStrictEqual(
      `"test value" test operator`
    );
  });

  it('Should work with one side operator', () => {
    const tc = new TextComparison(field, OneSideOperator.Present, undefined, false);

    expect(tc.rawQuery()).toStrictEqual(
      `"${field}" PRESENT`
    );
  });

  it('Should negate expression', () => {
    const tc = new TextComparison(field, NumberOperator.Greater, '5', true);

    expect(tc.rawQuery()).toStrictEqual(
      `NOT "${field}" GREATER "5"`
    );
  });
});
