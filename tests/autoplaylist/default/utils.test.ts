import { escapeText } from '@/autoplaylist/default/utils';

describe('escapeText', () => {
  it('Should not quote fields without spaces', () => {
    expect(escapeText('%test_field%')).toStrictEqual('%test_field%');
    expect(escapeText('%abc%')).toStrictEqual('%abc%');
  });

  it('Should quote fields with spaces', () => {
    expect(escapeText('%with space%')).toStrictEqual('"%with space%"');
  });

  it('Should return numbers as is', () => {
    expect(escapeText('5')).toStrictEqual('5');
    expect(escapeText('5.5')).toStrictEqual('5.5');
    expect(escapeText('100.500')).toStrictEqual('100.500');
  });

  it('Should quote normal strings', () => {
    expect(escapeText('abc')).toStrictEqual('"abc"');
    expect(escapeText('with many spaces')).toStrictEqual('"with many spaces"');
  });
});
