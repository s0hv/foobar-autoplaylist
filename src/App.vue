<template>
  <v-app id="app">
    <v-main v-if="openView !== '1'">
      <header class="header">
        <h2>Foobar query editor</h2>
      </header>
      <v-container class="root-container">
        <v-row justify="center">
          <HowToUse />
        </v-row>
        <v-row justify="center" class="pb-2">
          <v-btn @click="toggleView" dark>
            Switch to  text editor
            <v-icon>swap_horiz</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="center">
          <QueryInputSelector ref="text" :initial-query="queryObj"></QueryInputSelector>
        </v-row>
        <v-row justify="center">
          <v-btn
            color="primary"
            @click="generateQuery"
          >
            Generate query
          </v-btn>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                class="align-self-center"
                aria-label="copy to clipboard"
                v-bind="attrs"
                v-on="on"
                @click="copyToClipboard"
              >
                <v-icon>
                  content_copy
                </v-icon>
              </v-btn>
            </template>
            <span>Copy to clipboard</span>
          </v-tooltip>
        </v-row>
        <v-row justify="center">
           <v-checkbox
            v-model="generateMultiline"
            label="Display query as multiline (easier to read, can't be copy pasted directly to foobar unless copied with the copy button)"
          >
          </v-checkbox>
        </v-row>
        <v-row justify="center" v-if="query">
          <QueryHighlighted
            :code="query"
            class="ma-5"
          />
        </v-row>
        <v-row justify="center" class="pa-4">
          <v-btn
            color="primary"
            @click="importQuery"
          >
            Import query
          </v-btn>
        </v-row>
        <v-row>
          <v-textarea
            v-model="importedQuery"
            :error-messages="errors"
            placeholder="Import query"
            outlined
            id="import-query"
          >
          </v-textarea>
        </v-row>
      </v-container>
    </v-main>
    <v-main v-else>
      <header class="header">
        <h2>Foobar query/title formatting editor</h2>
      </header>
      <v-container>
        <v-row justify="center" class="pb-2">
          <div class="how-to-use-textarea">
            <h3>How to use</h3>
            <details>
              <summary>Query/title formatting editor</summary>
              This page contains a textbox that can be used for writing code for queries or general formatting.
              The editor has autocompletion and syntax highlighting.
              Clicking the <v-icon>content_copy</v-icon> icon copies the code to clipboard without newlines
            </details>
          </div>
        </v-row>
        <v-row justify="center" class="pb-2">
          <v-btn @click="toggleView" dark>
            Switch to query only editor
            <v-icon>swap_horiz</v-icon>
          </v-btn>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                class="align-self-center"
                aria-label="copy to clipboard"
                v-bind="attrs"
                v-on="on"
                @click="copyToClipboard"
              >
                <v-icon>
                  content_copy
                </v-icon>
              </v-btn>
            </template>
            <span>Copy text without newlines</span>
          </v-tooltip>
        </v-row>
      </v-container>
      <v-container class="root-container codemirror">
        <Codemirror v-model="freeformText" :value="freeformText" />
        <v-switch
          :value="$store.state.queryMode"
          @change="() => $store.commit('toggleQueryMode')"
          label="Use query mode"
          style="width: max-content"
        >
          <template v-slot:label>
            Use query mode
            <v-tooltip bottom max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    info
                  </v-icon>
                </v-btn>
              </template>
              <span>
                Queries work a bit differently than normal text formatting in foobar2000.
                Functions for example need to be inside quotes in some cases.
                e.g. <span style="font-style: italic">$meta(artist) HAS name</span> won't work
                but <span style="font-style: italic">"$meta(artist)" HAS name</span> will.
              </span>
            </v-tooltip>
          </template>
        </v-switch>
        <v-row justify="center" class="custom-inputs">
          <div style="width: 100%">
            <custom-fields />
          </div>
          <div style="width: 100%">
            <saved-snippets />
          </div>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import Component from 'vue-class-component';
import { Parser, map2query } from '@/autoplaylist/default/parser';
import {
  ICombinedQuery,
  IQueryInput
} from '@/types/autoplaylist';
import HowToUse from '@/components/HowToUse.vue';
import CustomFields from '@/components/CustomFields.vue';
import SavedSnippets from '@/components/SavedSnippets.vue';

const QueryInputSelector = () => import('@/components/QueryInputSelector.vue');
const Codemirror = () => import('@/components/Codemirror.vue');
const QueryHighlighted = () => import('@/components/QueryHighlighted.vue');

@Component({
  components: {
    SavedSnippets,
    CustomFields,
    Codemirror,
    HowToUse,
    QueryInputSelector,
    QueryHighlighted
  }
})
export default class App extends Vue {
  query = '';
  queryObj?: ICombinedQuery | null;
  importedQuery = '';
  errors: string[] = [];
  generateMultiline = true;
  openView = window.localStorage.getItem('preferredView') || '1';
  freeformText = '';

  $refs!: {
    text: IQueryInput & Vue
  };

  singleLineQuery(s: string): string {
    return s.replace(/\s*\n\s*/g, ' ');
  }

  copyToClipboard(): void {
    let s: string;
    if (this.openView === '1') {
      s = this.freeformText;
    } else {
      s = this.query;
    }
    navigator.clipboard.writeText(this.singleLineQuery(s));
  }

  toggleView(): void {
    if (this.openView === '1') {
      this.openView = '2';
    } else {
      // Save old query
      this.queryObj = this.$refs.text?.getQuery();

      this.openView = '1';
    }
    window.localStorage.setItem('preferredView', this.openView);
  }

  generateQuery(): void {
    this.query = this.$refs.text.getQuery()?.rawQuery() || '';
    if (!this.generateMultiline) {
      this.query = this.singleLineQuery(this.query);
    }
  }

  importQuery(): void {
    const p = new Parser(this.importedQuery);
    let query: ICombinedQuery;

    try {
      query = map2query(p.parse());
    } catch (e) {
      this.errors = [(e as Error).toString()];
      return;
    }

    this.errors = [];
    this.$refs.text.setQuery(query);
    this.generateQuery();
  }
}
</script>

<style>
#app {
  display: flex;
  flex-flow: row;
}

.header {
  padding: 2em 0;
  text-align: center;
}

html { overflow-y: auto }

.codemirror .cm-scroller, .codemirror .cm-gutter {
  overflow: auto;
  min-height: 350px;
}

.how-to-use-textarea {
  padding-bottom: 2em;
  width: 40%;
}
.how-to-use-textarea details {
  text-align: left;
}

.custom-inputs {
  flex-flow: row;
}
</style>
