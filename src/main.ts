import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';

import vuetify from './plugins/vuetify';
import '@/assets/styles.css';
import VMask from 'v-mask';
import { CodeSnippets, codeSnippetsKey, StoreType } from '@/types/types';
import { EditorView } from '@codemirror/view';
import { validateSnippets } from '@/utils';
Vue.use(VMask);
Vue.use(Vuex);

const parseStringList = (key: string): string[] => {
  const oldFields = window.localStorage.getItem(key);
  if (!oldFields) {
    return [];
  }

  try {
    const arr = JSON.parse(oldFields);
    if (!Array.isArray(arr)) {
      return [];
    }

    return arr.map(i => i.toString());
  } catch {
    return [];
  }
};

const parseCodeSnippets = (): CodeSnippets => {
  const text = window.localStorage.getItem(codeSnippetsKey);
  if (!text) {
    return {};
  }

  return validateSnippets(text) || {};
};

const store = new Vuex.Store<StoreType>({
  state: {
    queryMode: false,
    customFields: parseStringList('customFields'),
    customFunctions: parseStringList('customFunctions'),
    codeSnippets: parseCodeSnippets(),
    codemirrorView: undefined
  },
  mutations: {
    toggleQueryMode(state) {
      state.queryMode = !state.queryMode;
    },

    setCustomFields(state, fields: string[]) {
      state.customFields = fields;
    },

    setCustomFunctions(state, functions: string[]) {
      state.customFunctions = functions;
    },

    setCodeSnippets(state, snippets: CodeSnippets) {
      state.codeSnippets = snippets;
    },

    setActiveCodemirrorView(state, view: EditorView) {
      state.codemirrorView = view;
    }
  }
});

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app');
