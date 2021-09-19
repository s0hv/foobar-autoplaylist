export enum LogicalOperator {
  And = 'AND',
  Or = 'OR'
}

export enum TextOperator {
  Has = 'HAS',
  Is = 'IS',
}

// Operators that only have argument on the left side. e.g. <field> MISSING
export enum OneSideOperator {
  Missing = 'MISSING',
  Present = 'PRESENT'
}

export enum TimeOperator {
  Before = 'BEFORE',
  After = 'AFTER',
  Since = 'SINCE',
  During = 'DURING'
}

export enum NumberOperator {
  Greater = 'GREATER',
  Less = 'LESS',
  Equal = 'EQUAL'
}

export enum QueryType {
  TextQuery,
  CombinedQuery,
  TimeQuery,
  FreeSpace
}

// The queries can basically be represented as a linked list of queries
// where the order of the list denotes the order of execution
export interface IAutoplaylistQuery{
  negated: boolean
  prevQuery: IAutoplaylistQuery | null
  nextQuery: IAutoplaylistQuery | null
  /** The operator used to combine this to the next query */
  combinedWith?: LogicalOperator | string
  type: QueryType

  // Only used for vue key property. Can be ignored if not using vue
  id: number

  toArray(): IAutoplaylistQuery[]
  rawQuery(): string
  fullQuery(): string
}

export interface IQueryInput {
  getQuery(): IAutoplaylistQuery | null;
}

export interface ICombinedQuery extends IAutoplaylistQuery {
  query1: IAutoplaylistQuery
  logicalOperator: LogicalOperator | string
  query2: IAutoplaylistQuery
}

export interface IFreeSpace extends IAutoplaylistQuery {
  queryText: string
}

export interface ITextComparison extends IAutoplaylistQuery {
  field: string
  comparator: TextOperator | OneSideOperator | string
  comparedAgainst?: string | null
}

export interface ITimeQuery extends IAutoplaylistQuery {
  time1: Date
  operator: TimeOperator | string
  time2: Date
}
