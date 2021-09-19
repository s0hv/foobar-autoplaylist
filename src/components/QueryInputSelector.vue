<template>
  <div class="input-group">
    <v-container v-if="firstQuery !== null" class="root-container">
      <draggable v-model="allQueries" handle=".handle" @end="sortQueries">
        <v-row v-for="query in allQueries" v-bind:key="query.id" class="flex-nowrap">
          <component v-bind:is="getQueryComponent(query)" :query="query"></component>
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
                @click="() => removeQuery(query)"
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
    <v-dialog
      v-model="showDialog"
      max-width="400"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="add-button"
          v-on="on"
          v-bind="attrs"
          icon
        >
          <v-icon>
            add
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          Add query
        </v-card-title>
        <v-card-text>
          <v-select
            label="Query type"
            v-model="selectedQueryType"
            :items="queryInputs"
          >
          </v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="addQuery">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {
  IAutoplaylistQuery,
  IQueryInput, QueryType
} from '@/types/autoplaylist';
import { TextComparison } from '@/autoplaylist/default';
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
  query: IAutoplaylistQuery | null = null;
  showDialog = false;
  selectedQueryType = QueryType.TextQuery;
  firstQuery: IAutoplaylistQuery | null = null;
  lastQuery: IAutoplaylistQuery | null = null;
  allQueries: IAutoplaylistQuery[] = [];

  get queryInputs(): SelectOption[] {
    return queryInputs;
  }

  getQueryComponent(query: IAutoplaylistQuery): string {
    return queryToInput[query.type];
  }

  getQuery(): IAutoplaylistQuery | null {
    console.log(this.firstQuery);
    return this.firstQuery;
  }

  get queriesInOrder(): IAutoplaylistQuery[] {
    return this.allQueries;
  }

  addQuery(): void {
    this.showDialog = false;
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

    query.prevQuery = this.lastQuery;

    if (this.firstQuery === null) {
      this.firstQuery = query;
    } else if (this.lastQuery !== null) {
      this.lastQuery.nextQuery = query;
    }

    this.lastQuery = query;
    this.allQueries.push(query);
  }

  removeQuery(query: IAutoplaylistQuery): void {
    const idx = this.allQueries.indexOf(query);
    this.allQueries.splice(idx, 1);
    console.log(query, query.prevQuery, query.nextQuery);
    if (query.prevQuery) {
      query.prevQuery.nextQuery = query.nextQuery;
    }

    if (query.nextQuery) {
      query.nextQuery.prevQuery = query.prevQuery;
    }

    this.updateFirstAndLastQuery();
  }

  addClicked(): void {
    this.showDialog = true;
  }

  sortQueries(): void {
    let prevQuery: IAutoplaylistQuery | null = null;

    this.allQueries.forEach(q => {
      if (prevQuery !== null) {
        prevQuery.nextQuery = q;
      }

      q.prevQuery = prevQuery;
      prevQuery = q;
    });

    this.updateFirstAndLastQuery();
  }

  updateFirstAndLastQuery(): void {
    if (this.allQueries.length === 0) {
      this.lastQuery = null;
      this.firstQuery = null;
      return;
    }

    this.firstQuery = this.allQueries[0];
    this.lastQuery = this.allQueries[this.allQueries.length - 1];
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

  .add-button {
    color: #4caf50;
  }

  .handle {
    cursor: move;
  }
</style>
