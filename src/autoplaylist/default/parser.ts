import {
  IParser,
  LogicalOperator,
  TreeNode,
  Statement,
  IAutoplaylistQuery,
  map2queryFn, ICombinedQuery
} from '@/types/autoplaylist';
import {
  dateRegex,
  oneSideOperators, timeOperators,
  valueOperators
} from '@/autoplaylist/default/utils';
import { TextComparison } from '@/autoplaylist/default/TextComparison';
import { FreeSpace } from '@/autoplaylist/default/FreeSpace';
import { TimeComparison } from '@/autoplaylist/default/TimeComparison';
import { CombinedQuery } from '@/autoplaylist/default/CombinedQuery';

const logicalOperators: string[] = Object.values(LogicalOperator);

interface StatementExtended extends Statement {
  startIdx: number
}

class Reader {
  input: string;
  currentIndex = 0;

  constructor(input: string) {
    this.input = input;
  }

  peek(n = 1): string {
    return this.input.slice(this.currentIndex, this.currentIndex + n);
  }

  consume(n = 1): string {
    this.currentIndex += n;
    return this.input[this.currentIndex - n];
  }

  isEof(): boolean {
    return this.currentIndex === this.input.length;
  }

  backtrack(n: number): void {
    this.currentIndex -= n;
  }

  getRange(start?: number, end?: number) {
    return this.input.slice(start, end);
  }
}

export class Parser implements IParser {
  reader: Reader;
  depth = 0;
  statementTree: TreeNode;
  currentNode: TreeNode;

  constructor(input: string) {
    this.reader = new Reader(input);
    this.statementTree = this.createNode(false);
    this.currentNode = this.statementTree;
  }

  createNode(negated: boolean): TreeNode {
    return {
      queries: [],
      children: [],
      combinedWith: null,
      negated
    };
  }

  createStatement(negated: boolean): StatementExtended {
    return {
      query: [],
      original: '',
      startIdx: this.reader.currentIndex,
      combinedWith: null,
      negated
    };
  }

  handleLogicalToken(statement: StatementExtended, token: string): void {
    statement.combinedWith = token;
    this.addStatement(statement);
  }

  addStatement(statement: StatementExtended): void {
    statement.original = this.reader.getRange(statement.startIdx, this.reader.currentIndex);
    this.currentNode.queries.push(statement);
  }

  isWhitespace(s: string): boolean {
    return /\s/.test(s);
  }

  skipWhitespace(): void {
    while (!this.reader.isEof()) {
      const char = this.reader.peek();

      // Skip whitespace characters
      if (this.isWhitespace(char)) {
        this.reader.consume();
        continue;
      }

      break;
    }
  }

  parse(): TreeNode {
    while (!this.reader.isEof()) {
      this.skipWhitespace();
      if (this.reader.isEof()) break;

      const negated = this.isNegated();

      const char = this.reader.peek();

      if (char === '(') {
        this.depth++;

        const newStatement = this.createNode(negated);
        newStatement.prevNode = this.currentNode;
        this.currentNode.children.push(newStatement);
        this.currentNode.queries.push(newStatement);

        this.currentNode = newStatement;

        this.reader.consume();
      } else if (char === ')') {
        this.depth--;

        this.reader.consume();

        this.skipWhitespace();
        if (this.reader.isEof()) break;

        const c = this.reader.peek();
        // If next character set new currentNode and continue loop
        if (c === ')') {
          if (this.currentNode.prevNode === undefined) {
            throw new SyntaxError(`Expected node to contain prevNode at position ${this.reader.currentIndex}`);
          }

          this.currentNode = this.currentNode.prevNode;
          continue;
        }

        // Since eof not reached and next character did not close a node
        // a token is expected
        const token = this.nextToken();
        if (!logicalOperators.includes(token)) {
          throw new SyntaxError(`Could not parse node at position ${this.reader.currentIndex}.
            Expected one of ${logicalOperators.join(', ')} but got ${token}`
          );
        }

        this.currentNode.combinedWith = token;
        if (this.currentNode.prevNode === undefined) {
          throw new SyntaxError(`Expected node to contain prevNode at position ${this.reader.currentIndex}`);
        }
        this.currentNode = this.currentNode.prevNode;
      } else {
        // Parse a single statement
        const statement = this.createStatement(negated);

        // Get the first piece of text
        let text = this.nextWord();
        statement.query.push(text);

        if (this.reader.isEof() || this.reader.peek() === ')') {
          this.addStatement(statement);
          continue;
        }

        // Get the keyword token next.
        let token = this.nextToken();
        if (logicalOperators.includes(token)) {
          this.handleLogicalToken(statement, token);
          continue;
        } else if (valueOperators.has(token)) {
          statement.query.push(token);
        } else {
          throw new SyntaxError(`Could not parse statement at position ${this.reader.currentIndex}. Expected a built in operator but got a normal word.`);
        }

        if (this.reader.isEof()) {
          this.addStatement(statement);
          continue;
        }

        let c = this.reader.peek();
        // Check if statement ends here
        if (c === ')') {
          this.addStatement(statement);
          continue;
        }

        // Tokens are always uppercase. if next word is logical operator end statement here
        if (/[A-Z]/.test(c)) {
          const idx = this.reader.currentIndex;
          token = this.nextToken();
          if (logicalOperators.includes(token)) {
            this.handleLogicalToken(statement, token);
            continue;
          }

          this.reader.currentIndex = idx;
        }

        // Get the final word and append it to the statement
        text = this.nextWord();
        statement.query.push(text);

        if (this.reader.isEof()) {
          this.addStatement(statement);
          break;
        }

        c = this.reader.peek();
        if (c === ')') {
          this.addStatement(statement);
          continue;
        }

        token = this.nextToken();
        if (logicalOperators.includes(token)) {
          this.handleLogicalToken(statement, token);
        } else {
          throw new SyntaxError(`Could not parse statement at position ${this.reader.currentIndex}.
            Expected one of ${logicalOperators.join(', ')} but got ${token}`
          );
        }
      }
    }

    if (this.depth !== 0) {
      throw new SyntaxError('Unmatched parentheses');
    }

    return this.statementTree;
  }

  /**
   * Parses a keyword token. Assumes that the next word is a keyword token.
   */
  nextToken(): string {
    let token = '';

    while (!this.reader.isEof()) {
      const c = this.reader.peek();
      if (this.isWhitespace(c) || c === ')') {
        break;
      }

      this.reader.consume();
      token += c;
    }

    this.skipWhitespace();

    return token;
  }

  isNegated(): boolean {
    const negateToken = 'NOT';
    if (this.reader.peek(negateToken.length) === negateToken) {
      this.reader.consume(negateToken.length);
      this.skipWhitespace();
      return true;
    }

    return false;
  }

  nextWord(): string {
    let s = '';
    let hasQuotes = false;
    const words: string[] = [];

    if (this.reader.peek() === '"') {
      this.reader.consume();
      hasQuotes = true;
    }

    const validWord = (w: string): boolean => {
      return logicalOperators.includes(w) || valueOperators.has(w); // || /[A-Z]+/.test(w);
    };

    while (!this.reader.isEof()) {
      const c = this.reader.consume();

      if (!hasQuotes && c === ')') {
        // Check if latest word was a token or not
        if (validWord(s)) {
          this.reader.backtrack(s.length + 1);
        } else {
          this.reader.backtrack(1);
          words.push(s);
        }

        s = '';
        break;
      }

      if (c === '"' && this.reader.peek() !== '"') {
        if (!hasQuotes) {
          throw new SyntaxError(`Unexpected quote in unquoted string at position ${this.reader.currentIndex}.\n${words.join(' ')}${c}`);
        }

        words.push(s);
        s = '';
        break;
      }

      if (this.isWhitespace(c)) {
        if (!hasQuotes && validWord(s)) {
          this.reader.backtrack(s.length + 1);
          s = '';
          break;
        }

        words.push(s);
        s = '';
      } else {
        s += c;
      }
    }

    if (this.reader.isEof() && s !== '') {
      if (hasQuotes) {
        throw new SyntaxError(`Unclosed quote when parsing ${words.join(' ')} ${s}`);
      }

      if (validWord(s)) {
        this.reader.backtrack(s.length + 1);
      } else {
        words.push(s.trimEnd());
      }
    }

    this.skipWhitespace();

    return words.join(' ');
  }
}

function statement2query(statement: Statement, parent: ICombinedQuery): IAutoplaylistQuery {
  const queryCount = statement.query.length;
  const query = statement.query;
  let newQuery: IAutoplaylistQuery | undefined;

  if (queryCount === 2) {
    if (oneSideOperators.has(query[1])) {
      newQuery = new TextComparison(query[0], query[1], null);
    }
  } else if (queryCount === 3) {
    if (timeOperators.has(query[1]) && dateRegex.test(query[2])) {
      newQuery = new TimeComparison(query[0], query[1], query[2]);
    } else if (valueOperators.has(query[1])) {
      newQuery = new TextComparison(query[0], query[1], query[2]);
    }
  }

  if (newQuery === undefined) {
    let original = statement.original;
    if (statement.combinedWith) {
      // Remove AND/OR from the end
      original = original.replace(new RegExp(` ${statement.combinedWith} *$`), '');
    }
    if (statement.negated) {
      original = `NOT ${original}`;
      statement.negated = false;
    }
    newQuery = new FreeSpace(original);
  }

  newQuery.combinedWith = statement.combinedWith;
  newQuery.negated = statement.negated;
  newQuery.parent = parent;
  return newQuery;
}

export const map2query: map2queryFn = (queryTree: TreeNode, root: boolean | undefined = true, parent?: ICombinedQuery): ICombinedQuery => {
  const query = new CombinedQuery([], root, queryTree.negated, parent);

  for (const q of queryTree.queries) {
    // Is a statement
    if ('query' in q) {
      query.queries.push(statement2query(q, query));
      continue;
    }

    // Is a TreeNode
    query.queries.push(map2query(q, false, query));
  }

  query.queries[query.queries.length - 1].isLast = true;

  return query;
};
