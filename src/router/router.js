import {createRouter,createWebHashHistory} from 'vue-router'
import Student from '../components/Student.vue'
import Top from '../layouts/Layout.vue'
import Course from '../components/Course.vue'
import Score from '../components/Score.vue'

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:"/",
            component:Top
        },
        {
            path:"/student",
            component:Student
        },
        {
            path:"/course",
            component:Course
        },
        {
            path:"/score",
            component:Score
        }
    ]
})

export default router