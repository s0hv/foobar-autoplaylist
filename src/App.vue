<template>
  <v-app id="app">
    <v-main>
      <header class="header">
        <h2>Foobar autoplaylist query editor</h2>
      </header>
      <v-container class="root-container">
        <v-row justify="center">
          <HowToUse />
        </v-row>
        <v-row justify="center">
          <QueryInputSelector ref="text"></QueryInputSelector>
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
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import QueryInputSelector from '@/components/QueryInputSelector.vue';
import Component from 'vue-class-component';
import { Parser, map2query } from '@/autoplaylist/default/parser';
import { ICombinedQuery } from '@/types/autoplaylist';
import HowToUse from '@/components/HowToUse.vue';

const QueryHighlighted = () => import('@/components/QueryHighlighted.vue');

@Component({
  components: {
    HowToUse,
    QueryInputSelector,
    QueryHighlighted
  }
})
export default class App extends Vue {
  query = '';
  importedQuery = '';
  errors: string[] = [];
  generateMultiline = true;

  $refs!: {
    text: QueryInputSelector
  };

  singleLineQuery(s: string): string {
    return s.replace(/\s*\n\s*/g, ' ');
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.singleLineQuery(this.query));
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
</style>
