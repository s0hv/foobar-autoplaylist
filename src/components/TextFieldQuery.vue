<template>
  <v-container class="flex query-row">
    <v-row class="flex-nowrap">
      <v-checkbox
        v-model="query.negated"
        label="NOT"
      />
      <div class="spacing-18"></div>
      <HintCombobox
        :query="query"
        :fields="fields"
      >
      </HintCombobox>
      <v-combobox
        :items="operators"
        v-model="query.comparator"
        class="operator resizable"
        label="Operator"
      >
      </v-combobox>
      <v-text-field
        v-show="!oneSideOperatorSelected()"
        v-model="query.comparedAgainst"
        class="search resizable"
        label="Compared to"
        clearable
      >
      </v-text-field>
    </v-row>
    <comparator :query="query" />
  </v-container>
</template>

<script lang="ts">
import {
  arithmeticFunctions, boolFunctions,
  fields,
  stringFunctions
} from '@/autoplaylist/default/utils';
import {
  ITextComparison,
  NumberOperator,
  TextOperator
} from '@/types/autoplaylist';
import { oneSideOperatorValues } from '@/autoplaylist/default';
import Vue from 'vue';
import Component from 'vue-class-component';
import Comparator from '@/components/Comparator.vue';
import HintCombobox from '@/components/HintCombobox.vue';

@Component({
  components: {
    HintCombobox,
    Comparator
  },
  props: {
    query: {
      type: Object as () => ITextComparison
    }
  }
})
export default class TextFieldQuery extends Vue {
  fields: string[] = [
    ...fields,
    ...boolFunctions,
    ...stringFunctions,
    ...arithmeticFunctions
  ];

  operators = [...Object.values(TextOperator), ...oneSideOperatorValues, ...Object.values(NumberOperator)];

  $props!: {
    query: ITextComparison
  };

  oneSideOperatorSelected(): boolean {
    return oneSideOperatorValues.indexOf(this.$props.query.comparator) >= 0;
  }
}
</script>
