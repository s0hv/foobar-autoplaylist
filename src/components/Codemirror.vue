<template>
  <div style="width: 100%;" ref="codemirror"></div>
</template>

<script lang="ts">
import { EditorState, Compartment } from '@codemirror/state';
import { basicSetup } from '@codemirror/basic-setup';
import { EditorView, keymap, ViewUpdate } from '@codemirror/view';
import { autocompletion } from '@codemirror/autocomplete';
import { Foobar2000Query } from 'codemirror-foobar2k';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentWithTab } from '@codemirror/commands';

import Component from 'vue-class-component';
import Vue from 'vue';
import {
  applyField,
  createAutocompleteFunction,
  fieldAutocomplete, fieldRegex, functionApplyCompletion,
  functionAutocomplete, functionRegex, functionTooltip, operatorAutocomplete
} from '@/autoplaylist/default/utils';

const languageConf = new Compartment();

@Component({
  props: {
    value: {
      type: String,
      default: ''
    }
  }
})
export default class Codemirror extends Vue {
  $props!: {
    value: string,
  };

  updateQuery(view: ViewUpdate): void {
    if (view.docChanged) {
      this.$emit('input', view.state.sliceDoc());
    }
  }

  mounted(): void {
    const editor = EditorState.create({
      doc: this.$props.value || '',
      extensions: [
        basicSetup,
        autocompletion({
          override: [
            functionAutocomplete((s: string) => this.$store.state.queryMode ? functionApplyCompletion(s) : s),
            fieldAutocomplete((s: string) => this.$store.state.queryMode ? applyField(s) : s),
            createAutocompleteFunction(fieldRegex,
              () => this.$store.state.customFields,
              'variable', undefined,
              (s: string) => this.$store.state.queryMode ? applyField(s) : s
            ),
            createAutocompleteFunction(functionRegex,
              () => this.$store.state.customFunctions,
              'function', undefined,
              (s: string) => this.$store.state.queryMode ? functionApplyCompletion(s) : s
            ),
            operatorAutocomplete
          ]
        }),
        functionTooltip,
        oneDark,
        keymap.of([indentWithTab]),
        languageConf.of(Foobar2000Query()),
        EditorView.updateListener.of(this.updateQuery)
      ]
    });

    this.view = new EditorView({
      state: editor,
      parent: this.$refs.codemirror as Element
    });

    this.$store.commit('setActiveCodemirrorView', this.view);
  }

  unmounted(): void {
    this.$store.commit('setActiveCodemirrorView', undefined);
  }

  view: EditorView | undefined;
}
</script>
