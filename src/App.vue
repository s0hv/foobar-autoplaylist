<template>
  <v-app id="app">
    <v-main>
      <v-container class="root-container">
        <v-row justify="center">
          <img alt="Vue logo" src="./assets/logo.png">
        </v-row>
        <v-row justify="center">
          <QueryInputSelector ref="text"></QueryInputSelector>
        </v-row>
        <v-row justify="center">
          <v-btn
            color="primary"
            @click="onClick"
          >
            Update
          </v-btn>
        </v-row>
        <v-row justify="center" v-if="query">
          <QueryHighlighted
            :code="query"
          />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import QueryInputSelector from '@/components/QueryInputSelector.vue';
import Component from 'vue-class-component';

const QueryHighlighted = () => import('@/components/QueryHighlighted.vue');

@Component({
  components: {
    QueryInputSelector,
    QueryHighlighted
  }
})
export default class App extends Vue {
  query = '';

  $refs!: {
    text: QueryInputSelector
  };

  onClick(): void {
    this.query = this.$refs.text.getQuery()?.fullQuery() || '';
  }
}
</script>

<style>
#app {
  display: flex;
  flex-flow: row;
}

html { overflow-y: auto }
</style>
