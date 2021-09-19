<template>
  <highlightjs
    language="fb2k"
    :code="code"
  />
</template>

<script lang="ts">
import Component from 'vue-class-component';

import hljs from 'highlight.js/lib/core';

import 'highlight.js/styles/a11y-light.css';

import hljsVuePlugin from '@highlightjs/vue-plugin';
import Vue from 'vue';
import fb2k from '@/autoplaylist/language';

hljs.registerLanguage('fb2k', fb2k);

@Component({
  props: {
    code: String
  },
  components: {
    highlightjs: hljsVuePlugin.component
  }
})
export default class QueryHighlighted extends Vue {}
</script>
