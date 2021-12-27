<template>
  <v-combobox
    v-model="query.field"
    :items="fields"
    class="search resizable field"
    label="Field"
    :messages="itemDescription"
    v-on:update:search-input="(newVal) => inputValue = (newVal || '')"
  >
    <template v-slot:item="{ item }">
      <span v-if="typeof item === 'string'">{{ item }}</span>
      <span v-else>{{ item.name }}</span>
    </template>
    <template v-slot:message="{ message }">
      <span class="message">{{ message }}</span>
    </template>
    <template v-slot:prepend-item="">
      <span class="item-message" v-if="itemDescription">{{ itemDescription }}</span>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import {
  ITextComparison
} from '@/types/autoplaylist';
import Vue from 'vue';
import Component from 'vue-class-component';
import {
  findFieldDescription
} from '@/autoplaylist/default/utils';

type HintFn = (name: string) => string;

@Component({
  props: {
    fields: {
      type: Array as () => string[]
    },
    getHint: {
      type: Function,
      default: findFieldDescription
    },
    query: {
      type: Object as () => ITextComparison
    }
  }
})
export default class HintCombobox extends Vue {
  inputValue = '';

  $props!: {
    fields: string[],
    getHint: HintFn,
    query: ITextComparison
  };

  get itemDescription(): string {
    return this.$props.getHint(this.inputValue);
  }
}
</script>

<style scoped>
span.message {
  white-space: break-spaces;
  max-width: 400px;
  display: block;
  padding-bottom: 4px;
}
span.item-message {
  white-space: break-spaces;
  max-width: 700px;
  display: block;
  padding: 8px 16px 1.5rem 16px;
  font-style: italic;
}
</style>
