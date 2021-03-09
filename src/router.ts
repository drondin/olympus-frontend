import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Projects from '@/views/Projects.vue';
import About from '@/views/About.vue';
import Auditdao from './views/Auditdao.vue';
import Chains from './views/Chains.vue';
import Iyield from './views/Iyield.vue';
import Enreach from './views/Enreach.vue';
import Eris from './views/Eris.vue';
import Learn from './views/Learn.vue';
import Lucent from './views/Lucent.vue';
import Nftyearn from './views/Nftyearn.vue';
import Radar from './views/Radar.vue';
import Renascent from './views/Renascent.vue';
import Rules from './views/Rules.vue';
import Telikos from './views/Telikos.vue';
import Community from './views/Community.vue';
import Developers from './views/Developers.vue';
import Governance from './views/Governance.vue';
import Presale from './views/Presale.vue';


Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/projects', name: 'projects', component: Projects },
  { path: '/auditdao', name: 'auditdao', component: Auditdao },
  { path: '/chains', name: 'chains', component: Chains },
  { path: '/iyield', name: 'iyield', component: Iyield },
  { path: '/enreach', name: 'enreach', component: Enreach },
  { path: '/eris', name: 'eris', component: Eris },
  { path: '/learn', name: 'learn', component: Learn },
  { path: '/lucent', name: 'lucent', component: Lucent },
  { path: '/nftyearn', name: 'nftyearn', component: Nftyearn },
  { path: '/community', name: 'community', component: Community },
  { path: '/developers', name: 'developers', component: Developers },
  { path: '/governance', name: 'governance', component: Governance },
  { path: '/radar', name: 'radar', component: Radar },
  { path: '/renascent', name: 'renascent', component: Renascent },
  { path: '/rules', name: 'rules', component: Rules },
  { path: '/telikos', name: 'telikos', component: Telikos },
  { path: '/presale', name: 'presale', component: Presale }
  
];

const router = new VueRouter({
  routes
});

export default router;
