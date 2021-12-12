<template>
  <v-container class="query-row">
    <span v-show="query.queries.length === 0">Drag queries here</span>
    <v-checkbox
        v-model="query.negated"
        label="NOT"
        v-show="query.queries.length !== 0"
      />
    <draggable v-model="query.queries" handle=".handle" @end="sortQueries" :group="{ name: 'queries' }" class="nested-draggable">
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
              @click="() => removeQuery(q, query)"
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
    <comparator :query="query" />
  </v-container>
</template>

<script lang="ts">
import {
  ICombinedQuery
} from '@/types/autoplaylist';
import Component from 'vue-class-component';
import FreeSpaceQuery from '@/components/FreeSpaceQuery.vue';
import {
  CombinedQueryFunctions,
  getQueryComponent
} from '@/components/query-constants';
import Vue from 'vue';
import Comparator from '@/components/Comparator.vue';

// lazy loading
const TextFieldQuery = () => import('@/components/TextFieldQuery.vue');
const TimeQuery = () => import('@/components/TimeQuery.vue');

const draggable = () => import('vuedraggable');

@Component({
  components: {
    draggable,
    TextFieldQuery,
    TimeQuery,
    FreeSpaceQuery,
    Comparator
  },
  props: {
    query: {
      type: Object as () => ICombinedQuery
    }
  }
})
export default class CombinedQueryInput extends Vue {
  getQueryComponent = getQueryComponent;
  updateFirstAndLastQuery = CombinedQueryFunctions.updateFirstAndLastQuery;
  removeQuery = CombinedQueryFunctions.removeQuery;

  $props!: {
    query: ICombinedQuery
  };

  sortQueries(): void {
    this.updateFirstAndLastQuery(this.$props.query);
  }
}
</script>

<style scoped>
  .handle {
    cursor: move;
  }
  .nested-draggable {
    padding-bottom: 100px;
  }
  .nested-draggable:empty {
    padding-bottom: 180px;
  }
</style>
