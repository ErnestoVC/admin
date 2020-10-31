import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './components/Login.vue'
import Planes from './components/Planes.vue'
import Profesor from './components/Profesor.vue'
import Estudiante from './components/Estudiante.vue'
import store from './store'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta :{
        administrador :true
      }
    },
    {
      path: '/planes',
      name: 'planes',
      component: Planes,
      meta :{
        administrador :true
      }
    },
    {
      path: '/profesores',
      name: 'profesores',
      component: Profesor,
      meta :{
        administrador :true
      }
    },
    {
      path: '/estudiantes',
      name: 'estudiantes',
      component: Estudiante,
      meta :{
        administrador :true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta : {
        libre: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)){
    next()
  } else if (store.state.usuario && store.state.roles == 'ROLE_ADMIN'){
    if (to.matched.some(record => record.meta.administrador)){
      next()
    }
  } else{
    next({
      name: 'login'
    })
  }
})

export default router
