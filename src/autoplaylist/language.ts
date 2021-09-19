import { LogicalOperator, TextOperator, OneSideOperator, NumberOperator, TimeOperator } from '@/types/autoplaylist';
import { dateRegexFull } from '@/autoplaylist/default/utils';

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
    {
      className: 'title',
      begin: /\$/,
      end: /\(/,
      excludeEnd: true
    },
    {
      className: 'variable',
      begin: /%|"%/,
      end: /%"|%/
    },
    {
      className: 'string',
      begin: `\\b${dateRegexFull}`
    },
    {
      className: 'number',
      begin: hljs?.NUMBER_RE,
      relevance: 0
    },
    {
      className: 'string',
      begin: '"',
      end: '"'
    }
  ]
});

export default autoplaylistQueryLanguage;
