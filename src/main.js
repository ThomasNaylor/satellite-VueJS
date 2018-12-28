import Vue from 'vue'
import App from './App.vue'
import store from './store'
import axios from 'axios';
import VueAxios from 'vue-axios';
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: 'YOURAPIKEY',
    libraries: 'places'
  }
});

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
