import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import LPStaking from './views/LPStaking.vue';
import store from './store/index';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: Home },
  { path: '/lpstake', name: 'lpstake', component: LPStaking },

];

const router = new VueRouter({
  routes
});

router.afterEach((to, from) => {
  store.commit('toggleSidebar', false);

  (window as any).analytics.page({
    path: to.fullPath,
    referrer: from.fullPath
  })
});

export default router;
