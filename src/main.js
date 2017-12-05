// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ProvinceComponent from '@/components/ProvinceComponent'
import LoadingComponent from '@/components/LoadingComponent'
import errorComponent from '@/components/errorComponent'
import "babel-polyfill" 

Vue.config.productionTip = false
Vue.component('province-select',ProvinceComponent)
Vue.component('yh-loading',LoadingComponent)
Vue.component('yh-error-tip',errorComponent)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

