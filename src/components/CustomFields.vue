<template>
   <v-container class="container">
     <v-text-field
       v-model="newField"
       label="Add %custom field%"
       append-outer-icon="add_circle_outline"
       @click:append-outer="addNewField"
       @keydown="checkEnter"
     />
     <h4 v-if="customFields.length !== 0">Custom metadata fields</h4>
     <ul>
       <li v-for="field in customFields" v-bind:key="field">
         {{ field }}
         <v-btn
           icon
           aria-label="remove field"
           @click="() => removeField(field)"
         >
           <v-icon>
             delete_forever
           </v-icon>
         </v-btn>
      </li>
       <li v-for="fn in customFunctions" v-bind:key="fn">
         {{ fn }}
         <v-btn
           icon
           aria-label="remove function"
           @click="() => removeFunction(fn)"
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
import { ITextComparison } from '@/types/autoplaylist';

const customFieldsKey = 'customFields';
const customFunctionsKey = 'customFunctions';

@Component({
})
export default class CustomFields extends Vue {
  customFields: string[] = this.$store.state.customFields;
  customFunctions: string[] = this.$store.state.customFunctions;
  newField = '';

  checkEnter(e: KeyboardEvent): void {
    // Add new field when enter pressed
    if (!e.shiftKey && e.keyCode === 13) this.addNewField();
  }

  addNewField(): void {
    if (!this.newField) return;

    let s = this.newField.trim();
    const isFunction = s.startsWith('$');
    if (isFunction) {
      this.customFunctions.push(s);
      this.saveCustomFunctions();
    } else {
      if (!s.startsWith('%')) s = `%${s}`;
      if (!s.endsWith('%')) s = `${s}%`;
      this.customFields.push(s);
      this.saveCustomFields();
    }

    this.newField = '';
  }

  removeField(field: string): void {
    this.customFields = this.customFields.filter(s => s !== field);
    this.saveCustomFields();
  }

  removeFunction(fn: string): void {
    this.customFunctions = this.customFunctions.filter(s => s !== fn);
    this.saveCustomFunctions();
  }

  saveCustomFields(): void {
    window.localStorage.setItem(customFieldsKey, JSON.stringify(this.customFields));
    this.$store.commit('setCustomFields', this.customFields);
  }

  saveCustomFunctions(): void {
    window.localStorage.setItem(customFunctionsKey, JSON.stringify(this.customFunctions));
    this.$store.commit('setCustomFunctions', this.customFunctions);
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 350px;
}

.container ul {
  max-height: 200px;
  overflow: auto;
}

.container h4 {
  padding-bottom: 1rem;
}
</style>
