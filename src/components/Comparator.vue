<template>
  <v-row v-show="!query.isLast" class="justify-center pa-top-16">
    <v-select
      class="width-100"
      label="Comparator"
      v-model="query.combinedWith"
      :items="logicalOperators"
      dense
    />
  </v-row>
</template>

<script lang="ts">
import {
  IAutoplaylistQuery,
  LogicalOperator
} from '@/types/autoplaylist';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    query: {
      type: Object as () => IAutoplaylistQuery
    }
  }
})
export default class Comparator extends Vue {
  logicalOperators = Object.values(LogicalOperator);
}
</script>

<style scoped>

</style>
