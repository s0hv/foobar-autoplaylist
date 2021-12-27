<template>
   <v-container class="flex query-row">
    <v-row class="flex-nowrap">
      <v-checkbox
        v-model="query.negated"
        label="NOT"
      />
      <div class="spacing-18"></div>
      <HintCombobox
        :fields="timeFields"
        :query="query"
      >
      </HintCombobox>
      <v-combobox
        :items="operators"
        v-model="query.comparator"
        class="operator resizable"
        label="Operator"
      >
      </v-combobox>
      <TimeInput
        v-on:input="timeChange"
        class="search resizable"
      >
      </TimeInput>
    </v-row>
     <comparator :query="query" />
   </v-container>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { ITextComparison, TimeOperator } from '@/types/autoplaylist';
import TimeInput from '@/components/TimeInput.vue';
import { timeFields, timeFunctions } from '@/autoplaylist/default/utils';
import Comparator from '@/components/Comparator.vue';
import HintCombobox from '@/components/HintCombobox.vue';

@Component({
  components: {
    HintCombobox,
    Comparator,
    TimeInput
  },
  props: {
    query: {
      type: Object as () => ITextComparison
    }
  }
})
export default class TimeQuery extends Vue {
  operators: string[] = Object.values(TimeOperator);
  timeFields = [
    ...timeFields,
    ...timeFunctions
  ];

  $props!: {
    query: ITextComparison
  };

  timeChange(val: string): void {
    this.$props.query.comparedAgainst = val;
  }
}
</script>

<style scoped>

</style>
