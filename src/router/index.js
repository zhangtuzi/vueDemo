import Vue from 'vue'
import Router from 'vue-router'
import EnterComponent from '@/components/EnterComponent'
import SearchComponent from '@/components/SearchComponent'
import QuestionListComponent from '@/components/QuestionListComponent'
import AnswerComponent from '@/components/AnswerComponent'


Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: EnterComponent
    },{
      path: '/search',
      component: SearchComponent
    },{
      path: '/questionlist',
      component: QuestionListComponent
    },{
      path: '/answer',
      component: AnswerComponent
    }
  ]
})
