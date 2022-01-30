<template>
   <v-container class="container">
     <a ref="downloader" style="display:none"></a>
     <div class="display-flex align-center">
       <v-text-field
         v-model="newSnippetName"
         :error-messages="error"
         label="Code snippet name"
         append-outer-icon="add_circle_outline"
         @click:append-outer="addNewSnippet"
         @keydown="checkEnter"
       />
       <v-file-input
         class="ml-3"
         ref="fileupload"
         :value="file"
         accept="application/json"
         label="Import snippets from file"
         :error-messages="importError"
         @change="doImport"
       ></v-file-input>
       <v-btn
         class="ml-2"
         color="primary"
         @click="exportSnippets"
       >
         Export snippets
       </v-btn>
     </div>
     <h4 v-if="Object.keys(this.codeSnippets).length !== 0">Custom code snippets</h4>
     <ul>
       <li v-for="(_, key) in this.codeSnippets" v-bind:key="key">
         {{ key }}
         <v-btn
           icon
           aria-label="import snippet"
           @click="() => loadSnippet(key)"
         >
           <v-icon>
             file_upload
           </v-icon>
         </v-btn>
         <v-btn
           icon
           aria-label="delete snippet"
           @click="() => removeSnippet(key)"
         >
           <v-icon>
             delete_forever
           </v-icon>
         </v-btn>
      </li>
    </ul>
   </v-container>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { CodeSnippets, codeSnippetsKey } from '@/types/types';
import { EditorView } from '@codemirror/view';
import { validateSnippets } from '@/utils';

@Component({
})
export default class SavedSnippets extends Vue {
  codeSnippets: CodeSnippets = this.$store.state.codeSnippets;
  newSnippetName = '';
  error = '';
  importError = '';
  file: File | null | File[] = null;

  $refs!: {
    downloader: HTMLLinkElement
    fileupload: any
  };

  exportSnippets(): void {
    if (Object.keys(this.codeSnippets).length === 0) return;

    const snippets = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.codeSnippets));
    this.$refs.downloader.setAttribute('href', snippets);
    this.$refs.downloader.setAttribute('download', 'codeSnippets.json');
    this.$refs.downloader.click();
  }

  doImport(file: File | null | File[]): void {
    this.file = file;
    this.importError = '';
    const f = Array.isArray(file) ? file[0] : file;
    if (!f) return;

    f.text()
      .then(validateSnippets)
      .then(val => {
        if (!val) {
          this.importError = 'No snippets found or invalid file given';
          return;
        }

        this.codeSnippets = {
          ...this.codeSnippets,
          ...val
        };
        this.saveCodeSnippets();
      })
      .finally(() => {
        this.file = null;
        this.$refs.fileupload.$refs.input.value = null;
      });
  }

  checkEnter(e: KeyboardEvent): void {
    // Add new field when enter pressed
    if (!e.shiftKey && e.keyCode === 13) this.addNewSnippet();
  }

  addNewSnippet(): void {
    this.error = '';
    if (!this.newSnippetName) return;

    if (this.codeSnippets[this.newSnippetName]) {
      this.error = `Snippet with name ${this.newSnippetName} already exists`;
      return;
    }

    const view: EditorView = this.$store.state.codemirrorView;
    if (!view || view.state.doc.length === 0) {
      this.error = `No code written`;
      return;
    }

    Vue.set(this.codeSnippets, this.newSnippetName, {
      snippet: view.state.sliceDoc()
    });

    this.saveCodeSnippets();
    this.newSnippetName = '';
  }

  loadSnippet(key: string): void {
    const view: EditorView = this.$store.state.codemirrorView;
    if (!view) return;

    const update = view.state.update({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: this.codeSnippets[key].snippet
      }
    });
    view.update([update]);
  }

  removeSnippet(key: string): void {
    Vue.delete(this.codeSnippets, key);
    this.saveCodeSnippets();
  }

  saveCodeSnippets(): void {
    window.localStorage.setItem(codeSnippetsKey, JSON.stringify(this.codeSnippets));
    this.$store.commit('setCodeSnippets', this.codeSnippets);
  }
}
</script>

<style scoped>
.container ul {
  max-height: 200px;
  overflow: auto;
}

.container h4 {
  padding-bottom: 1rem;
}
</style>
