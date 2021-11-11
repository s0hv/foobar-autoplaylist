<template>
  <div class="input-group">
    <v-container v-if="query.queries.length !== 0" class="root-container">
      <draggable v-model="query.queries" handle=".handle" @end="sortQueries">
        <v-row v-for="q in query.queries" v-bind:key="q.id" class="flex-nowrap">
          <component v-bind:is="getQueryComponent(q)" :query="q"></component>
          <v-icon class="handle">
            drag_handle
          </v-icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                class="align-self-center"
                aria-label="remove query"
                v-bind="attrs"
                v-on="on"
                @click="() => removeQuery(q)"
              >
                <v-icon>
                  delete_forever
                </v-icon>
              </v-btn>
            </template>
            <span>Remove query</span>
          </v-tooltip>
        </v-row>

      </draggable>
    </v-container>
    <div class="display-flex flex-row align-center">
      <v-select
        label="Query type"
        v-model="selectedQueryType"
        :items="queryInputs"
        class="ma-5"
      >
      </v-select>
      <v-btn color="primary" @click="addQuery">Add new query</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import {
  IAutoplaylistQuery, ICombinedQuery,
  IQueryInput, QueryType
} from '@/types/autoplaylist';
import { CombinedQuery, TextComparison } from '@/autoplaylist/default';
import Vue from 'vue';
import Component from 'vue-class-component';
import { TimeComparison } from '@/autoplaylist/default/TimeComparison';
import { FreeSpace } from '@/autoplaylist/default/FreeSpace';
import FreeSpaceQuery from '@/components/FreeSpaceQuery.vue';

// lazy loading
const TextFieldQuery = () => import('@/components/TextFieldQuery.vue');
const TimeQuery = () => import('@/components/TimeQuery.vue');

const draggable = () => import('vuedraggable');

const queryToInput: Record<QueryType, string> = {
  [QueryType.TextQuery]: 'text-field-query',
  [QueryType.CombinedQuery]: '',
  [QueryType.TimeQuery]: 'time-query',
  [QueryType.FreeSpace]: 'free-space-query'
};

interface SelectOption {
  text: string
  value: QueryType
}

const queryInputs: SelectOption[] = [
  {
    text: 'Metadata query',
    value: QueryType.TextQuery
  },
  {
    text: 'Time query',
    value: QueryType.TimeQuery
  },
  {
    text: 'Free editing space',
    value: QueryType.FreeSpace
  }
];

@Component({
  components: {
    draggable,
    TextFieldQuery,
    TimeQuery,
    FreeSpaceQuery
  }
})
export default class QueryInputSelector extends Vue implements IQueryInput {
  query: ICombinedQuery = new CombinedQuery([], true, false);
  selectedQueryType = QueryType.TextQuery;

  get queryInputs(): SelectOption[] {
    return queryInputs;
  }

  getQueryComponent(query: IAutoplaylistQuery): string {
    return queryToInput[query.type];
  }

  getQuery(): ICombinedQuery | null {
    console.log(this.query);
    return this.query;
  }

  get queriesInOrder(): IAutoplaylistQuery[] {
    return this.query.queries;
  }

  addQuery(): void {
    let query: IAutoplaylistQuery;

    switch (this.selectedQueryType) {
      case QueryType.TextQuery:
        query = new TextComparison('', '', '');
        break;

      case QueryType.TimeQuery:
        query = new TimeComparison('', '', '');
        break;

      case QueryType.FreeSpace:
        query = new FreeSpace('');
        break;

      default:
        throw Error('Unsupported query type');
    }

    query.parent = this.query;

    this.query.queries.push(query);
    this.updateFirstAndLastQuery(query.parent);
  }

  removeQuery(query: IAutoplaylistQuery): void {
    const idx = this.query.queries.indexOf(query);
    this.query.queries.splice(idx, 1);
    this.updateFirstAndLastQuery(query.parent || this.query);
  }

  sortQueries(): void {
    this.updateFirstAndLastQuery(this.query);
  }

  updateFirstAndLastQuery(query: ICombinedQuery): void {
    const length = query.queries.length;
    if (length === 0) return;

    query.queries.forEach(q => (q.isLast = false));
    query.queries[length - 1].isLast = true;
  }
}
</script>

<style scoped>
  .input-group {
    border-left: 1px slategray;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    width: 100%;
  }

  .handle {
    cursor: move;
  }
</style>
