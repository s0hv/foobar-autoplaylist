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

// Forward declaration
// eslint-disable-next-line import/export,@typescript-eslint/no-empty-interface
export declare interface ICombinedQuery {}

// The queries can basically be represented as a linked list of queries
// where the order of the list denotes the order of execution
export interface IAutoplaylistQuery{
  negated: boolean
  /** The operator used to combine this to the next query */
  combinedWith: LogicalOperator | string | null
  type: QueryType

  /** Determines if this is the last query in the chain */
  isLast: boolean

  parent?: ICombinedQuery

  // Only used for vue key property. Can be ignored if not using vue
  id: number

  rawQuery(): string
}

export interface IQueryInput {
  getQuery(): IAutoplaylistQuery | null;
}

// Forward declared
// eslint-disable-next-line import/export
export interface ICombinedQuery extends IAutoplaylistQuery {
  queries: IAutoplaylistQuery[]

  /** Determines if this is the root query */
  isRoot: boolean
}

export interface IFreeSpace extends IAutoplaylistQuery {
  queryText: string
}

export interface ITextComparison extends IAutoplaylistQuery {
  field: string
  comparator: TextOperator | OneSideOperator | string
  comparedAgainst: string | null
}

// Parser related
interface StatementAndNode {
  combinedWith: string | null
  negated: boolean
}

export interface Statement extends StatementAndNode {
  query: string[]
  original: string
}

export interface TreeNode extends StatementAndNode {
  queries: Array<Statement|TreeNode>
  children: TreeNode[]
  prevNode?: TreeNode
}

export interface IParser {
  parse(): TreeNode
}

export type map2queryFn = (query: TreeNode, root?: boolean, parent?: ICombinedQuery) => ICombinedQuery;
