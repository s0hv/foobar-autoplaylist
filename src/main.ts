import Vue from 'vue';
import App from './App.vue';

import vuetify from './plugins/vuetify';
import '@/assets/styles.css';
import VMask from 'v-mask';
Vue.use(VMask);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');
