import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/MainView.vue";
import DynamicQI from "../views/DynamicQI.vue";
import AnalyzeRendering from "../views/AnalyzeRendering.vue";
import LotTraceability from "../views/LotTraceability.vue";
import SectionLots from "../views/SectionLots.vue";

const routes = [
  {
    path: "",
    name: "home",
    meta: { title: "龙岩金叶复烤·批次质量管控系统" },
    component: DynamicQI,
  },
  {
    path: "/dynamic-Qi",
    name: "dynamic",
    meta: { title: "龙岩金叶-动态QI" },
    component: DynamicQI,
  },
  {
    path: "/analyze-rendering",
    name: "analyzeRendering",
    meta: { title: "龙岩金叶-分析效果图" },
    component: AnalyzeRendering,
  },
  {
    path: "/tracebility",
    name: "tracebility",
    meta: { title: "龙岩金叶-批次追溯" },
    component: LotTraceability,
  },
  {
    path: "/section-lots",
    name: "sectionLots",
    meta: { title: "龙岩金叶-批次信息" },
    component: SectionLots,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});
export default router;
