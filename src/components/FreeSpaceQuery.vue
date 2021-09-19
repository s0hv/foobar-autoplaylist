<template>
  <v-container class="query-row">
    <v-row>
      <v-textarea
        label="Free text edit space"
        v-model="query.queryText"
        rows="1"
        :no-resize="false"
        hide-details
        auto-grow
        row-height="46"
        class="resizable"
      />
    </v-row>
    <comparator :query="query" />
  </v-container>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { IFreeSpace } from '@/types/autoplaylist';
import Vue from 'vue';
import Comparator from '@/components/Comparator.vue';

@Component({
  components: { Comparator },
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
