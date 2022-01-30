<template>
  <v-container class="query-row">
    <v-row>
      <codemirror v-model="query.queryText" :value="query.queryText" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { IFreeSpace } from '@/types/autoplaylist';
import Vue from 'vue';
import Comparator from '@/components/Comparator.vue';
import Codemirror from '@/components/Codemirror.vue';

@Component({
  components: { Codemirror, Comparator },
  props: {
    query: {
      type: Object as () => IFreeSpace
    }
  }
})
export default class FreeSpaceQuery extends Vue {
  $props!: {
    query: IFreeSpace
  };
}
</script>

<style scoped>
.resizable-textarea >>> textarea {
  resize: horizontal !important;
  min-width: 100px;
  max-width: min(1300px, 70vw);
}
</style>
