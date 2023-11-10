import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InstitutionsView from '../views/InstitutionsView.vue'
import DepartmentsView from '../views/DepartmentsView.vue'
import SectorsView from '../views/SectorsView.vue'
import PeopleView from '../views/PeopleView.vue'
import ResearchGroupsView from '../views/ResearchGroupsView.vue'
import ResearchGroupsMembersView from '../views/ResearchGroupsMembersView.vue'
import InstitutionsFinancialView from '../views/InstitutionsFinancialView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/institutions',
    name: 'institutions',
    component: InstitutionsView
  },
  {
    path: '/departments',
    name: 'departments',
    component: DepartmentsView
  },
  {
    path: '/sectors',
    name: 'sectors',
    component: SectorsView
  },
  {
    path: '/people',
    name: 'people',
    component: PeopleView
  },
  {
    path: '/research-groups',
    name: 'ResearchGroups',
    component: ResearchGroupsView
  },
  {
    path: '/research-groups-members',
    name: 'ResearchGroupsMembers',
    component: ResearchGroupsMembersView
  },
  {
    path: '/institutions-financial',
    name: 'InstitutionsFinancial',
    component: InstitutionsFinancialView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router