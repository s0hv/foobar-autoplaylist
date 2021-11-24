import { LogicalOperator, TextOperator, OneSideOperator, NumberOperator, TimeOperator } from '@/types/autoplaylist';
import { dateRegexFull } from '@/autoplaylist/default/utils';

const FUNCTION_MODE: Mode = {
  className: 'title',
  begin: /\$\w+/,
  end: /\(/,
  excludeEnd: true
};

const STRING_MODE: Mode = {
  className: 'string',
  begin: '"',
  end: '"',
  contains: [
    FUNCTION_MODE
  ]
};
const NUMBER_MODE = (hljs: HLJSApi | undefined) => ({
  className: 'number',
  begin: hljs?.NUMBER_RE,
  relevance: 0
});

const autoplaylistQueryLanguage: LanguageFn = (hljs) => ({
  name: 'fb2k',
  case_insensitive: true,
  keywords: [
    ...Object.values(LogicalOperator),
    ...Object.values(TextOperator),
    ...Object.values(OneSideOperator),
    ...Object.values(NumberOperator),
    ...Object.values(TimeOperator),
    'NOT'
  ],
  contains: [
    FUNCTION_MODE,
    {
      className: 'variable',
      begin: /%|"%/,
      end: /%"|%/
    },
    {
      className: 'string',
      begin: `\\b${dateRegexFull}`
    },
    NUMBER_MODE(hljs),
    STRING_MODE
  ]
});

export default autoplaylistQueryLanguage;
